import type { LoaderFunctionArgs } from "react-router";
import { eventStream } from "remix-utils/sse/server";
import { DrizzleStoryRepository } from "~/infrastructure/db/repositories/story.server";
import { OpenAIService } from "~/infrastructure/ai/openai";
import { SupabaseStorageService } from "~/infrastructure/storage/supabase";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const storyId = params.id;
  if (!storyId) return new Response("Story ID required", { status: 400 });

  const storyRepository = new DrizzleStoryRepository();
  const aiService = new OpenAIService();
  const storageService = new SupabaseStorageService();

  const story = await storyRepository.findById(storyId);
  if (!story) return new Response("Story not found", { status: 404 });

  // Only stream if status is 'generating' or 'draft'
  if (story.status === 'completed') {
    return new Response("Story already completed", { status: 200 });
  }

  return eventStream(request.signal, function setup(send) {
    const run = async () => {
      try {
        // 1. Trigger Image Generation in Background
        const imagePrompt = `${story.childName} playing with ${story.interests.join(", ")}. ${story.theme} style.`;

        const imagePromise = aiService.generateImage(imagePrompt)
          .then(async (url) => {
            if (url) {
              await storyRepository.update(storyId, { coverImageUrl: url });
              // Send image update via JSON
              send({ data: JSON.stringify({ type: 'image', url }) });
            }
          })
          .catch(err => console.error("Image generation failed:", err));

        // 2. Start Text Stream
        const stream = aiService.generateStoryStream({
          childName: story.childName,
          childAge: story.childAge,
          interests: story.interests,
          theme: story.theme,
        });

        let fullContent = "";

        for await (const chunk of stream) {
          fullContent += chunk;
          send({ data: JSON.stringify({ type: 'delta', content: chunk }) });
        }

        // 3. Update DB with full content
        await storyRepository.update(storyId, {
          content: fullContent,
          status: 'completed', // We mark as completed even if audio/image are pending? Ideally yes, but maybe 'generating_audio'?
          // Let's keep 'completed' for text, but maybe we need a separate status for audio?
          // For now, we update content.
        });

        // 4. Generate Audio (After text is ready)
        // We do this BEFORE sending [DONE] but maybe in parallel with Image wait?
        // Audio generation depends on full text.
        try {
          const audioBuffer = await aiService.generateAudio(fullContent);
          const audioFilename = `${storyId}-${Date.now()}.mp3`;
          console.log("🚀 ~ run ~ audioFilename:", audioFilename, audioBuffer)
          const audioUrl = await storageService.uploadAudio(audioFilename, audioBuffer);

          await storyRepository.update(storyId, { audioUrl });
          send({ data: JSON.stringify({ type: 'audio', url: audioUrl }) });
        } catch (audioErr) {
          console.error("🚀 Audio generation failed:", audioErr);
        }

        // 5. Wait for Image Generation to finish
        await imagePromise;

        send({ data: JSON.stringify({ type: 'done' }) });
      } catch (error) {
        console.error("Streaming error:", error);
        await storyRepository.update(storyId, { status: 'failed' });
        send({ event: "error", data: String(error) });
      }
    };

    run();

    return function cleanup() {
      // Cleanup logic if needed
    };
  });
}
