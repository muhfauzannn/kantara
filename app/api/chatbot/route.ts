import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: Request) {
  try {
    const { message, history } = await request.json();

    if (!process.env.GEMINI_API_KEY) {
      return new Response(
        JSON.stringify({ error: "Gemini API key not configured" }),
        { status: 500 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

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

    // Create a streaming response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const result = await chat.sendMessageStream(message);

          for await (const chunk of result.stream) {
            const text = chunk.text();
            const data = `data: ${JSON.stringify({ text })}\n\n`;
            controller.enqueue(encoder.encode(data));
          }

          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (error: any) {
          console.error("Stream error:", error);
          const errorData = `data: ${JSON.stringify({
            error: error?.message || "Stream failed",
          })}\n\n`;
          controller.enqueue(encoder.encode(errorData));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error: any) {
    console.error("Chatbot error:", error);
    return new Response(
      JSON.stringify({ error: error?.message || "Failed to process message" }),
      { status: 500 }
    );
  }
}
