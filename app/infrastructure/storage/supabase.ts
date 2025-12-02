import { createClient } from "@supabase/supabase-js";

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_API_KEY) {// || !process.env.SUPABASE_ANON_KEY
  throw new Error("SUPABASE_URL or SUPABASE_ANON_KEY is missing");
}

// Note: For server-side uploads bypassing RLS, we might need SERVICE_ROLE_KEY.
// For now, we'll try with ANON_KEY assuming the bucket is public or has proper policies.
// Ideally, we should use SERVICE_ROLE_KEY for backend operations.
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_API_KEY; // || process.env.SUPABASE_ANON_KEY
console.log("🚀 ~ supabaseUrl:", supabaseUrl, supabaseKey)

const supabase = createClient(supabaseUrl, supabaseKey);

export class SupabaseStorageService {
  private bucket = "stories-audio";

  async uploadAudio(filename: string, audioBuffer: Buffer): Promise<string> {
    const { data, error } = await supabase.storage
      .from(this.bucket)
      .upload(`audio/${filename}`, audioBuffer, {
        contentType: "audio/mpeg",
        upsert: true,
      });

    if (error) {
      console.error("Supabase Storage Upload Error:", error);
      throw new Error(`Failed to upload audio: ${error.message}`);
    }

    // Get Public URL
    const { data: { publicUrl } } = supabase.storage
      .from(this.bucket)
      .getPublicUrl(`audio/${filename}`);

    return publicUrl;
  }
}
