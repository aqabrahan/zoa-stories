import type { ActionFunctionArgs } from "react-router";
import { redirect } from "react-router";
import { DrizzleStoryRepository } from "~/infrastructure/db/repositories/story.server";
import { CreateStoryUseCase } from "~/core/stories/use-cases";
import { OpenAIService } from "~/infrastructure/ai/openai";

// TODO: Dependency Injection
const storyRepository = new DrizzleStoryRepository();
const aiService = new OpenAIService();
// We only need the repository for creation now, generation happens later
const createStoryUseCase = new CreateStoryUseCase(storyRepository, aiService);

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const childName = formData.get("childName") as string;
  const childAge = Number(formData.get("childAge"));
  const interests = (formData.get("interests") as string).split(",").map(s => s.trim());
  const theme = formData.get("theme") as string;

  // Mock User ID (null for guest)
  const userId = null;

  try {
    // We only want the story object to redirect
    const { story } = await createStoryUseCase.execute({
      userId,
      childName,
      childAge,
      interests,
      theme,
    });
    console.log("🚀 ~ action ~ story:", story)

    // We don't consume the stream here. We let the client connect to the stream endpoint.
    // Ideally, we shouldn't even start the stream here if we are not consuming it.
    // But for now, let's assume the UseCase *starts* the process.
    // Wait, if I don't await the stream, it might not run?
    // In Node, generators are lazy. If I don't iterate, it doesn't run.

    return redirect(`/stories/${story.id}`);
  } catch (error) {
    console.error("Error creating story:", error);
    return { error: "Lo sentimos, hubo un problema al crear tu cuento mágico. Por favor intenta de nuevo." };
  }
}
