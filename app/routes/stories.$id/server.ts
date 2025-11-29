import type { LoaderFunctionArgs } from "react-router";
import { DrizzleStoryRepository } from "~/infrastructure/db/repositories/story.server";

export async function loader({ params }: LoaderFunctionArgs) {
  const storyId = params.id;
  if (!storyId) throw new Response("Story ID required", { status: 400 });

  const storyRepository = new DrizzleStoryRepository();
  const story = await storyRepository.findById(storyId);

  if (!story) throw new Response("Story not found", { status: 404 });

  return { story };
}
