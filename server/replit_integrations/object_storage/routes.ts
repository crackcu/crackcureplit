import type { Express } from "express";
import { createClient } from "@supabase/supabase-js";
import multer from "multer";
import { randomUUID } from "crypto";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

function getSupabaseClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error("SUPABASE_URL and SUPABASE_ANON_KEY must be set");
  }
  return createClient(url, key);
}

function getBucketName() {
  return process.env.SUPABASE_BUCKET || "Uploads";
}

export function registerObjectStorageRoutes(app: Express): void {
  app.post("/api/uploads/request-url", upload.single("file"), async (req, res) => {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).json({ error: "No file provided" });
      }

      const supabase = getSupabaseClient();
      const bucketName = getBucketName();
      const ext = file.originalname.split(".").pop() || "jpg";
      const fileName = `uploads/${randomUUID()}.${ext}`;

      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
          upsert: true,
        });

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(data.path);

      res.json({
        uploadURL: urlData.publicUrl,
        objectPath: urlData.publicUrl,
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).json({ error: "Failed to upload file" });
    }
  });
}
