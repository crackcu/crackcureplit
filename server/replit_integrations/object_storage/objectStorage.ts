import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!,
);

// Upload a file
export async function uploadFile(fileBuffer: Buffer, fileName: string) {
  const { data, error } = await supabase.storage
    .from("uploads") // your bucket name
    .upload(fileName, fileBuffer, {
      upsert: true, // overwrite if same name exists
    });

  if (error) throw error;

  // Get the public URL
  const { data: urlData } = supabase.storage
    .from("uploads")
    .getPublicUrl(data.path);

  return urlData.publicUrl; // this URL is what you save in your database
}

// Delete a file
export async function deleteFile(fileName: string) {
  const { error } = await supabase.storage.from("uploads").remove([fileName]);

  if (error) throw error;
}
