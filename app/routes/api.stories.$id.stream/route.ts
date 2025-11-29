import type { LoaderFunctionArgs } from "react-router";
import { eventStream } from "remix-utils/sse/server";
import { DrizzleStoryRepository } from "~/infrastructure/db/repositories/story.server";
import { OpenAIService } from "~/infrastructure/ai/openai";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const storyId = params.id;
  if (!storyId) return new Response("Story ID required", { status: 400 });

  const storyRepository = new DrizzleStoryRepository();
  const aiService = new OpenAIService();

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

        // Update DB with full content
        await storyRepository.update(storyId, {
          content: fullContent,
          status: 'completed',
        });

        // 3. Wait for Image Generation to finish (if it hasn't already)
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
