import { NextRequest, NextResponse } from "next/server";
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: NextRequest) {
  try {
    const { text, daerahNama } = await request.json();

    if (!text || !daerahNama) {
      return NextResponse.json(
        { error: "Text and daerahNama are required" },
        { status: 400 }
      );
    }

    // Generate detailed narration using Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `Anda adalah pemandu wisata budaya Indonesia yang ramah dan informatif. 
Buatkan narasi audio yang menarik dan edukatif tentang daerah "${daerahNama}" dalam bahasa Indonesia.

Informasi daerah:
${text}

Buat narasi yang:
1. Dimulai dengan sapaan yang hangat dan memperkenalkan daerah
2. Jelaskan keunikan dan daya tarik daerah tersebut (2-3 kalimat)
3. Sebutkan kebudayaan yang menarik untuk dijelajahi (jika ada)
4. Akhiri dengan ajakan untuk mengenal lebih dalam

Narasi harus dalam bahasa Indonesia yang natural dan cocok untuk dibacakan (sekitar 100-150 kata).
Jangan gunakan markdown atau format khusus, hanya teks biasa yang siap dibacakan.`;

    const result = await model.generateContent(prompt);
    const narrationText = result.response.text();

    // Convert text to speech using ElevenLabs
    // Using voice ID for female voice that supports Indonesian:
    // - 'EXAVITQu4vr4xnSDxMaL' (Bella - female, clear voice)
    // - 'ThT5KcBeYPX3keUQqHPh' (Dorothy - female, mature voice)
    // - 'XB0fDUnXU5powFXDhCwa' (Charlotte - female, natural voice)
    const audioStream = await elevenlabs.textToSpeech.convert(
      "EXAVITQu4vr4xnSDxMaL",
      {
        text: narrationText,
        modelId: "eleven_multilingual_v2",
        voiceSettings: {
          stability: 0.5,
          similarityBoost: 0.75,
        },
      }
    );

    // Convert the stream to a buffer
    const chunks: Uint8Array[] = [];
    const reader = audioStream.getReader();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
    }

    const audioBuffer = Buffer.concat(chunks);

    // Return audio as response
    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": audioBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("Error generating speech:", error);
    return NextResponse.json(
      { error: "Failed to generate speech" },
      { status: 500 }
    );
  }
}
