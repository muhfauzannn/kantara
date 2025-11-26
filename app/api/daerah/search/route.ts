import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { fallbackDaerahData } from "@/lib/data/fallback-daerah";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json(
        {
          success: false,
          error: "Query parameter is required",
        },
        { status: 400 }
      );
    }

    const matchFallbackData = (keyword: string) => {
      const normalized = keyword.toLowerCase();
      return fallbackDaerahData.filter((daerah) => {
        const matchNama = daerah.nama.toLowerCase().includes(normalized);
        const matchDescription = daerah.description
          .toLowerCase()
          .includes(normalized);
        const matchKebudayaan = daerah.kebudayaans.some(
          (k) =>
            k.nama.toLowerCase().includes(normalized) ||
            k.description.toLowerCase().includes(normalized)
        );
        return matchNama || matchDescription || matchKebudayaan;
      });
    };

    if (!prisma) {
      const fallbackMatches = matchFallbackData(query);
      return NextResponse.json({
        success: true,
        data: fallbackMatches,
        matchedBy: fallbackMatches.length ? "fallback_search" : "none",
        summary:
          fallbackMatches.length > 0
            ? `Ditemukan ${fallbackMatches.length} daerah yang cocok dengan pencarian "${query}" (mode offline)`
            : `Tidak ada daerah yang cocok dengan pencarian "${query}" pada data offline.`,
        fallback: true,
      });
    }

    // Step 1: Try basic filtering by nama, description, and kebudayaans
    const daerahResults = await prisma.daerah.findMany({
      where: {
        OR: [
          {
            nama: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            kebudayaans: {
              some: {
                OR: [
                  {
                    nama: {
                      contains: query,
                      mode: "insensitive",
                    },
                  },
                  {
                    description: {
                      contains: query,
                      mode: "insensitive",
                    },
                  },
                ],
              },
            },
          },
        ],
      },
      select: {
        id: true,
        nama: true,
        description: true,
        latitude: true,
        longitude: true,
        icon: true,
        backgroundImg: true,
        images: true,
        kebudayaans: {
          select: {
            id: true,
            nama: true,
            jenis: true,
            images: true,
          },
        },
      },
    });

    // If we found results with basic filtering, return them
    if (daerahResults.length > 0) {
      return NextResponse.json({
        success: true,
        data: daerahResults,
        matchedBy: "direct_search",
        summary: `Ditemukan ${daerahResults.length} daerah yang cocok dengan pencarian "${query}"`,
      });
    }

    // Step 2: If no results found, use Gemini API to find the best match
    console.log("No direct matches found, using Gemini API...");

    // Get all daerah data for Gemini to analyze
    const allDaerah = await prisma.daerah.findMany({
      select: {
        id: true,
        nama: true,
        description: true,
        latitude: true,
        longitude: true,
        icon: true,
        backgroundImg: true,
        images: true,
        kebudayaans: {
          select: {
            id: true,
            nama: true,
            jenis: true,
            description: true,
          },
        },
      },
    });

    if (allDaerah.length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
        matchedBy: "none",
        summary: "Tidak ada daerah yang ditemukan dalam database",
      });
    }

    // Prepare context for Gemini
    const daerahContext = allDaerah
      .map((d) => {
        const kebudayaanList = d.kebudayaans
          .map((k) => `${k.nama} (${k.jenis}): ${k.description}`)
          .join("; ");
        return `ID: ${d.id}\nNama: ${d.nama}\nDeskripsi: ${d.description}\nKebudayaan: ${kebudayaanList}`;
      })
      .join("\n\n---\n\n");

    const prompt = `Kamu adalah asisten pencarian daerah di Indonesia. Berikut adalah daftar daerah yang tersedia:

${daerahContext}

User mencari: "${query}"

Tugasmu adalah menemukan daerah yang paling cocok dengan pencarian user. Analisis berdasarkan:
1. Kesamaan nama daerah
2. Relevansi deskripsi daerah
3. Kebudayaan yang ada di daerah tersebut (suku, rumah adat, makanan khas, kesenian)

PENTING: Kembalikan response dalam format JSON berikut:
{
  "matches": [
    {
      "id": "[uuid daerah]",
      "explanation": "[Penjelasan singkat 1-2 kalimat kenapa daerah ini cocok dengan pencarian]"
    }
  ]
}

Jika ada beberapa yang cocok, kembalikan maksimal 3 daerah yang paling relevan.
Jika tidak ada yang cocok sama sekali, kembalikan:
{
  "matches": []
}

Contoh response yang benar:
{
  "matches": [
    {
      "id": "abc-123-def-456",
      "explanation": "Daerah ini memiliki kebudayaan Suku Baduy yang terkenal dengan tradisi isolasi dan kearifan lokalnya."
    }
  ]
}`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const geminiResponse = response.text().trim();

    console.log("Gemini response:", geminiResponse);

    // Parse Gemini JSON response
    interface GeminiMatch {
      id: string;
      explanation: string;
    }

    interface GeminiResponse {
      matches: GeminiMatch[];
    }

    let parsedResponse: GeminiResponse;
    try {
      // Try to extract JSON from response (handle markdown code blocks)
      const jsonMatch = geminiResponse.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        return NextResponse.json({
          success: true,
          data: [],
          matchedBy: "gemini_no_match",
          summary: `Tidak ditemukan daerah yang cocok dengan pencarian "${query}"`,
        });
      }

      parsedResponse = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error("Error parsing Gemini response:", parseError);
      return NextResponse.json({
        success: true,
        data: [],
        matchedBy: "gemini_parse_error",
        summary: `Tidak dapat memproses hasil pencarian untuk "${query}"`,
      });
    }

    // Check if there are any matches
    if (!parsedResponse.matches || parsedResponse.matches.length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
        matchedBy: "gemini_no_match",
        summary: `Tidak ditemukan daerah yang cocok dengan pencarian "${query}"`,
      });
    }

    // Extract IDs and create explanation map
    const ids = parsedResponse.matches.map((m) => m.id);
    const explanationMap = new Map(
      parsedResponse.matches.map((m) => [m.id, m.explanation])
    );

    // Fetch the matched daerah
    const matchedDaerah = await prisma.daerah.findMany({
      where: {
        id: {
          in: ids,
        },
      },
      select: {
        id: true,
        nama: true,
        description: true,
        latitude: true,
        longitude: true,
        icon: true,
        backgroundImg: true,
        images: true,
        kebudayaans: {
          select: {
            id: true,
            nama: true,
            jenis: true,
            images: true,
          },
        },
      },
    });

    // Add explanations to matched daerah
    const daerahWithExplanations = matchedDaerah.map((daerah) => ({
      ...daerah,
      aiExplanation: explanationMap.get(daerah.id) || null,
    }));

    return NextResponse.json({
      success: true,
      data: daerahWithExplanations,
      matchedBy: "gemini_ai",
      summary:
        matchedDaerah.length > 0
          ? `Ditemukan ${matchedDaerah.length} daerah yang mungkin cocok dengan "${query}"`
          : `Tidak ditemukan daerah yang cocok dengan pencarian "${query}"`,
    });
  } catch (error) {
    console.error("Error in search:", error);
    const fallbackMatches = fallbackDaerahData.filter((daerah) => {
      const keyword = request.nextUrl.searchParams.get("q")?.toLowerCase();
      if (!keyword) return false;
      return (
        daerah.nama.toLowerCase().includes(keyword) ||
        daerah.description.toLowerCase().includes(keyword) ||
        daerah.kebudayaans.some(
          (k) =>
            k.nama.toLowerCase().includes(keyword) ||
            k.description.toLowerCase().includes(keyword)
        )
      );
    });
    if (fallbackMatches.length > 0) {
      return NextResponse.json({
        success: true,
        data: fallbackMatches,
        matchedBy: "fallback_error_recovery",
        summary: `Database tidak dapat diakses, tetapi ditemukan ${fallbackMatches.length} hasil dari data offline.`,
        fallback: true,
      });
    }
    return NextResponse.json(
      {
        success: false,
        error: "Failed to search daerah",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
