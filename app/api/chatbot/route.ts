import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: Request) {
  console.log('tes' + process.env.GEMINI_API_KEY);
  try {
    const { message, history } = await request.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Build context for Indonesian culture chatbot
    const systemPrompt = `Anda adalah asisten AI yang ahli dalam budaya Indonesia. 
Tugas Anda adalah membantu pengguna memahami, mengeksplorasi, dan melestarikan kekayaan budaya Nusantara.
Anda dapat menjawab pertanyaan tentang:
- Kebudayaan daerah dari 38 provinsi Indonesia
- Kesenian tradisional (tari, musik, seni rupa)
- Makanan khas daerah
- Rumah adat dan arsitektur tradisional
- Suku dan adat istiadat
- Bahasa daerah dan sastra
- Sejarah dan warisan budaya

Berikan jawaban yang informatif, ramah, dan mendorong apresiasi terhadap budaya Indonesia.
Gunakan bahasa Indonesia yang baik dan benar.`;

    // Convert history to Gemini format
    const chatHistory =
      history?.map((msg: any) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      })) || [];

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: systemPrompt }],
        },
        {
          role: "model",
          parts: [
            {
              text: "Baik, saya siap membantu Anda mengeksplorasi budaya Indonesia!",
            },
          ],
        },
        ...chatHistory,
      ],
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ message: text });
  } catch (error: any) {
    console.error("Chatbot error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to process message" },
      { status: 500 }
    );
  }
}
