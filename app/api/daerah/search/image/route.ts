import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get("image") as File;

    if (!image) {
      return NextResponse.json(
        {
          success: false,
          error: "Image is required",
        },
        { status: 400 }
      );
    }

    // Convert image to base64
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString("base64");

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

    const prompt = `Kamu adalah asisten pencarian daerah di Indonesia berdasarkan gambar. Berikut adalah daftar daerah yang tersedia:

${daerahContext}

User mengunggah sebuah gambar. Analisis gambar tersebut dan cari daerah di Indonesia yang paling cocok berdasarkan:
1. Elemen budaya yang terlihat di gambar (rumah adat, pakaian tradisional, makanan, kesenian, dll)
2. Karakteristik arsitektur atau desain yang khas
3. Motif atau ornamen tradisional
4. Objek atau benda budaya lainnya

PENTING: Kembalikan response dalam format JSON berikut:
{
  "imageDescription": "[Deskripsi singkat tentang apa yang terlihat di gambar]",
  "matches": [
    {
      "id": "[uuid daerah]",
      "explanation": "[Penjelasan detail 2-3 kalimat kenapa daerah ini cocok dengan gambar yang diunggah. Sebutkan elemen spesifik dari gambar yang cocok dengan kebudayaan daerah ini]",
      "confidence": "[high/medium/low - tingkat keyakinan match ini]"
    }
  ]
}

Jika ada beberapa yang cocok, kembalikan maksimal 3 daerah yang paling relevan, urutkan berdasarkan confidence.
Jika tidak ada yang cocok sama sekali, kembalikan:
{
  "imageDescription": "[Deskripsi singkat tentang apa yang terlihat di gambar]",
  "matches": []
}

Contoh response yang benar:
{
  "imageDescription": "Gambar menampilkan rumah tradisional dengan atap melengkung khas dan ornamen tanduk kerbau",
  "matches": [
    {
      "id": "abc-123-def-456",
      "explanation": "Rumah adat di gambar sangat mirip dengan Tongkonan, rumah adat Toraja. Atap melengkung dengan hiasan tanduk kerbau (pa'tedong) adalah ciri khas arsitektur Toraja yang sangat ikonik. Ornamen ukiran pada dinding juga menunjukkan motif geometris khas Toraja.",
      "confidence": "high"
    }
  ]
}`;

    // Use Gemini Vision API
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: image.type,
          data: base64Image,
        },
      },
    ]);

    const response = await result.response;
    const geminiResponse = response.text().trim();

    console.log("Gemini Vision response:", geminiResponse);

    // Parse Gemini JSON response
    interface GeminiMatch {
      id: string;
      explanation: string;
      confidence: string;
    }

    interface GeminiResponse {
      imageDescription: string;
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
          matchedBy: "gemini_vision_no_match",
          summary:
            "Tidak dapat mengidentifikasi daerah dari gambar yang diunggah",
          imageDescription: "Tidak dapat menganalisis gambar",
        });
      }

      parsedResponse = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error("Error parsing Gemini response:", parseError);
      return NextResponse.json({
        success: true,
        data: [],
        matchedBy: "gemini_vision_parse_error",
        summary: "Tidak dapat memproses hasil analisis gambar",
        imageDescription: "Error dalam memproses gambar",
      });
    }

    // Check if there are any matches
    if (!parsedResponse.matches || parsedResponse.matches.length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
        matchedBy: "gemini_vision_no_match",
        summary:
          "Tidak ditemukan daerah yang cocok dengan gambar yang diunggah",
        imageDescription:
          parsedResponse.imageDescription ||
          "Gambar tidak dapat diidentifikasi",
      });
    }

    // Extract IDs and create explanation + confidence map
    const ids = parsedResponse.matches.map((m) => m.id);
    const matchDetailsMap = new Map(
      parsedResponse.matches.map((m) => [
        m.id,
        {
          explanation: m.explanation,
          confidence: m.confidence,
        },
      ])
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

    // Add explanations and confidence to matched daerah
    const daerahWithExplanations = matchedDaerah.map((daerah) => {
      const details = matchDetailsMap.get(daerah.id);
      return {
        ...daerah,
        aiExplanation: details?.explanation || null,
        aiConfidence: details?.confidence || null,
      };
    });

    // Sort by confidence (high > medium > low)
    const confidenceOrder = { high: 0, medium: 1, low: 2 };
    daerahWithExplanations.sort((a, b) => {
      const aConf =
        confidenceOrder[a.aiConfidence as keyof typeof confidenceOrder] ?? 999;
      const bConf =
        confidenceOrder[b.aiConfidence as keyof typeof confidenceOrder] ?? 999;
      return aConf - bConf;
    });

    return NextResponse.json({
      success: true,
      data: daerahWithExplanations,
      matchedBy: "gemini_vision",
      imageDescription: parsedResponse.imageDescription,
      summary:
        matchedDaerah.length > 0
          ? `Ditemukan ${matchedDaerah.length} daerah yang mungkin cocok dengan gambar yang diunggah`
          : "Tidak ditemukan daerah yang cocok dengan gambar yang diunggah",
      searchId: Date.now().toString(),
    });
  } catch (error) {
    console.error("Error in image search:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to search by image",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
