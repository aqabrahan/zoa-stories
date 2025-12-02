import type { LoaderFunctionArgs } from "react-router";
import { requireUser } from "~/core/auth/auth.server";
import { DrizzleStoryRepository } from "~/infrastructure/db/repositories/story.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUser(request);
  const storyRepository = new DrizzleStoryRepository();

  const stories = await storyRepository.findByUserId(user.id);

  return { stories, user };
}
