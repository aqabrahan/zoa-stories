import OpenAI from "openai";
import { STORY_SYSTEM_PROMPT } from "./prompts";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is missing");
}

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export class OpenAIService {
  /**
   * Generates a story using GPT-4o with streaming.
   */
  async *generateStoryStream(params: {
    childName: string;
    childAge: number;
    interests: string[];
    theme: string;
  }): AsyncIterable<string> {
    const userPrompt = `
    Niño: ${params.childName}, ${params.childAge} años.
    Intereses: ${params.interests.join(", ")}.
    Tema visual: ${params.theme}.

    Escribe un cuento titulado "La aventura de ${params.childName}".
    `;

    const stream = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: STORY_SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      stream: true,
      temperature: 0.7,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      if (content) {
        yield content;
      }
    }
  }

  /**
   * Generates an image prompt based on the story summary (simplified for MVP).
   */
  async generateImage(prompt: string): Promise<string> {
    const response = await client.images.generate({
      model: "dall-e-3",
      prompt: `Pixar style 3D render, cute, vibrant colors. ${prompt}`,
      n: 1,
      size: "1024x1024",
    });

    return response.data?.[0]?.url || "";
  }

  /**
   * Generates audio from text using TTS-1.
   */
  async generateAudio(text: string): Promise<Buffer> {
    const mp3 = await client.audio.speech.create({
      model: "tts-1",
      voice: "nova", // 'nova' is good for children stories
      input: text,
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());
    return buffer;
  }
}
