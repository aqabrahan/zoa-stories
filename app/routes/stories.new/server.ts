import type { ActionFunctionArgs } from "react-router";
import { redirect } from "react-router";
import { DrizzleStoryRepository } from "~/infrastructure/db/repositories/story.server";
import { CreateStoryUseCase } from "~/core/stories/use-cases";

// TODO: Inject this dependency properly (e.g. via a container or context)
const storyRepository = new DrizzleStoryRepository();
const createStoryUseCase = new CreateStoryUseCase(storyRepository);

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const childName = formData.get("childName") as string;
  const childAge = Number(formData.get("childAge"));
  const interests = (formData.get("interests") as string).split(",").map(s => s.trim());
  const theme = formData.get("theme") as string;

  // Mock User ID for now (until Auth is implemented)
  const userId = "00000000-0000-0000-0000-000000000000";

  try {
    const story = await createStoryUseCase.execute({
      userId,
      childName,
      childAge,
      interests,
      theme,
    });

    return redirect(`/stories/${story.id}`);
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unknown error" };
  }
}
