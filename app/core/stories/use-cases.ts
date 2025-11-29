import type { CreateStoryParams, Story, StoryRepository } from "./domain";
import type { OpenAIService } from "~/infrastructure/ai/openai";

export class CreateStoryUseCase {
  constructor(
    private storyRepository: StoryRepository,
    private aiService: OpenAIService
  ) {}

  async execute(params: CreateStoryParams): Promise<{ story: Story; stream: AsyncIterable<string> }> {
    // 1. Validate inputs
    if (!params.childName) throw new Error("Child name is required");
    if (params.childAge < 0) throw new Error("Invalid age");

    // 2. Create the story entity (Draft)
    const story = await this.storyRepository.create({
      userId: params.userId,
      childName: params.childName,
      childAge: params.childAge,
      interests: params.interests,
      theme: params.theme || "pixar",
      status: 'generating', // Mark as generating
      title: `Cuento para ${params.childName}`,
      content: "",
      isPublic: false,
    });

    // 3. Start Streaming
    const stream = this.aiService.generateStoryStream({
      childName: params.childName,
      childAge: params.childAge,
      interests: params.interests,
      theme: params.theme || "pixar",
    });

    return { story, stream };
  }
}
