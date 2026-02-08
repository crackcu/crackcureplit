import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, Link, Loader2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
}

export function ImageUploader({ value, onChange, label = "Image", placeholder = "https://..." }: ImageUploaderProps) {
  const [mode, setMode] = useState<"url" | "upload">(value && !value.startsWith("/objects/") ? "url" : "url");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast({ title: "Please select an image file", variant: "destructive" });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast({ title: "File too large (max 10MB)", variant: "destructive" });
      return;
    }

    setUploading(true);
    try {
      const res = await fetch("/api/uploads/request-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: file.name, size: file.size, contentType: file.type }),
      });
      if (!res.ok) throw new Error("Failed to get upload URL");
      const { uploadURL, objectPath } = await res.json();

      const putRes = await fetch(uploadURL, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!putRes.ok) throw new Error("Upload failed");

      onChange(objectPath);
      toast({ title: "Image uploaded" });
    } catch (err: any) {
      toast({ title: err.message || "Upload failed", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-2 mb-1">
        <Label className="text-xs">{label}</Label>
        <div className="flex gap-1">
          <Button
            type="button"
            variant={mode === "url" ? "default" : "outline"}
            size="sm"
            className="h-6 text-xs px-2"
            onClick={() => setMode("url")}
            data-testid="button-mode-url"
          >
            <Link className="h-3 w-3 mr-1" /> URL
          </Button>
          <Button
            type="button"
            variant={mode === "upload" ? "default" : "outline"}
            size="sm"
            className="h-6 text-xs px-2"
            onClick={() => setMode("upload")}
            data-testid="button-mode-upload"
          >
            <Upload className="h-3 w-3 mr-1" /> Upload
          </Button>
        </div>
      </div>

      {mode === "url" ? (
        <Input
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          data-testid="input-image-url"
        />
      ) : (
        <div className="space-y-2">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleUpload(file);
            }}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="w-full"
            data-testid="button-upload-image"
          >
            {uploading ? (
              <><Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> Uploading...</>
            ) : (
              <><Upload className="h-3.5 w-3.5 mr-1" /> Choose Image</>
            )}
          </Button>
        </div>
      )}

      {value && (
        <div className="flex items-center gap-2 mt-2">
          <img src={value} alt="Preview" className="w-16 h-12 rounded-md object-cover" />
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={() => { onChange(""); if (fileRef.current) fileRef.current.value = ""; }}
            data-testid="button-clear-image"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
          <span className="text-xs text-muted-foreground truncate max-w-[200px]">{value}</span>
        </div>
      )}
    </div>
  );
}
