import type { ActionFunctionArgs } from "react-router";
import { DrizzleStoryRepository } from "~/infrastructure/db/repositories/story.server";
import { OpenAIService } from "~/infrastructure/ai/openai";
import { SupabaseStorageService } from "~/infrastructure/storage/supabase";

export async function action({ request, params }: ActionFunctionArgs) {
  const storyId = params.id;
  if (!storyId) return new Response("Story ID required", { status: 400 });

  const storyRepository = new DrizzleStoryRepository();
  const aiService = new OpenAIService();
  const storageService = new SupabaseStorageService();

  const story = await storyRepository.findById(storyId);
  if (!story) return new Response("Story not found", { status: 404 });
  if (!story.content) return new Response("Story content is missing", { status: 400 });

  try {
    console.log("🚀 Starting manual audio generation for:", storyId);

    // 1. Generate Audio
    const audioBuffer = await aiService.generateAudio(story.content);
    console.log("🚀 Audio generated, size:", audioBuffer.length);

    // 2. Upload to Supabase
    const audioFilename = `${storyId}-${Date.now()}.mp3`;
    const audioUrl = await storageService.uploadAudio(audioFilename, audioBuffer);
    console.log("🚀 Audio uploaded to:", audioUrl);

    // 3. Update DB
    await storyRepository.update(storyId, { audioUrl });

    return new Response(JSON.stringify({ success: true, audioUrl }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("🚀 Manual audio generation failed:", error);
    return new Response(JSON.stringify({ success: false, error: String(error) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
