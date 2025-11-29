import type { CreateStoryParams, Story, StoryRepository } from "./domain";

export class CreateStoryUseCase {
  constructor(private storyRepository: StoryRepository) {}

  async execute(params: CreateStoryParams): Promise<Story> {
    // 1. Validate inputs (Basic validation, more complex validation can be done with Zod in the controller)
    if (!params.childName) throw new Error("Child name is required");
    if (params.childAge < 0) throw new Error("Invalid age");

    // 2. Create the story entity (Draft)
    const story = await this.storyRepository.create({
      userId: params.userId,
      childName: params.childName,
      childAge: params.childAge,
      interests: params.interests,
      theme: params.theme || "pixar",
      status: 'draft',
      title: `Cuento para ${params.childName}`, // Placeholder title
      content: "",
      isPublic: false,
      // Optional fields
      coverImageUrl: undefined,
      audioUrl: undefined,
    });

    // 3. Trigger Async Generation (This would be a background job or just return the draft to start streaming)
    // For now, we just return the draft. The controller will trigger the generation.

    return story;
  }
}
