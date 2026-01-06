import React, { useRef, useState } from "react";
import { Upload, X, Image as ImageIcon, Video } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "sonner";

interface FileUploadProps {
  accept?: string;
  maxSize?: number; // in MB
  onUpload: (base64: string, fileName: string) => void;
  currentFile?: string;
  type?: "image" | "video";
  label?: string;
}

export function FileUpload({
  accept = "image/*",
  maxSize = 5,
  onUpload,
  currentFile,
  type = "image",
  label = "Upload File"
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string>(currentFile || "");
  const [isUploading, setIsUploading] = useState(false);

  // Sync preview with currentFile prop changes
  React.useEffect(() => {
    setPreview(currentFile || "");
  }, [currentFile]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSize) {
      toast.error(`File size must be less than ${maxSize}MB`);
      return;
    }

    setIsUploading(true);

    try {
      // Convert to base64
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setPreview(base64);
        onUpload(base64, file.name);
        setIsUploading(false);
        toast.success("File uploaded successfully!");
      };
      reader.onerror = () => {
        toast.error("Failed to read file");
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload file");
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview("");
    onUpload("", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
      />

      {preview ? (
        <div className="relative group">
          {type === "image" ? (
            <img
              src={preview}
              alt="Preview"
              className="w-full h-48 object-cover rounded-lg border"
            />
          ) : (
            <div className="w-full h-48 bg-gray-100 rounded-lg border flex items-center justify-center">
              <Video className="w-12 h-12 text-gray-400" />
              <p className="ml-2 text-sm text-gray-600">Video uploaded</p>
            </div>
          )}
          <Button
            type="button"
            size="sm"
            variant="destructive"
            onClick={handleRemove}
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          onClick={handleClick}
          disabled={isUploading}
          className="w-full h-48 border-dashed border-2 hover:border-blue-500 hover:bg-blue-50 transition-colors"
        >
          <div className="flex flex-col items-center gap-2">
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="text-sm">Uploading...</span>
              </>
            ) : (
              <>
                {type === "image" ? (
                  <ImageIcon className="h-8 w-8 text-gray-400" />
                ) : (
                  <Video className="h-8 w-8 text-gray-400" />
                )}
                <span className="text-sm font-medium">{label}</span>
                <span className="text-xs text-gray-500">
                  Max size: {maxSize}MB
                </span>
              </>
            )}
          </div>
        </Button>
      )}
    </div>
  );
}

interface MultiFileUploadProps {
  accept?: string;
  maxSize?: number;
  onUpload: (files: Array<{ url: string; name: string }>) => void;
  currentFiles?: Array<{ url: string; name: string }>;
  maxFiles?: number;
  type?: "image" | "video";
}

export function MultiFileUpload({
  accept = "image/*",
  maxSize = 5,
  onUpload,
  currentFiles = [],
  maxFiles = 10,
  type = "image"
}: MultiFileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<Array<{ url: string; name: string }>>(currentFiles);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (!selectedFiles.length) return;

    if (files.length + selectedFiles.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} files allowed`);
      return;
    }

    setIsUploading(true);

    try {
      const newFiles: Array<{ url: string; name: string }> = [];

      for (const file of selectedFiles) {
        const fileSizeMB = file.size / (1024 * 1024);
        if (fileSizeMB > maxSize) {
          toast.error(`${file.name} is too large (max ${maxSize}MB)`);
          continue;
        }

        await new Promise<void>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            const base64 = event.target?.result as string;
            newFiles.push({ url: base64, name: file.name });
            resolve();
          };
          reader.onerror = () => reject();
          reader.readAsDataURL(file);
        });
      }

      const updatedFiles = [...files, ...newFiles];
      setFiles(updatedFiles);
      onUpload(updatedFiles);
      setIsUploading(false);
      toast.success(`${newFiles.length} file(s) uploaded successfully!`);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload files");
      setIsUploading(false);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemove = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    onUpload(updatedFiles);
    toast.success("File removed");
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Upload Button */}
      <Button
        type="button"
        variant="outline"
        onClick={handleClick}
        disabled={isUploading || files.length >= maxFiles}
        className="w-full border-dashed border-2 hover:border-blue-500 hover:bg-blue-50 transition-colors"
      >
        <Upload className="h-4 w-4 mr-2" />
        {isUploading ? "Uploading..." : `Upload ${type === "image" ? "Images" : "Videos"} (${files.length}/${maxFiles})`}
      </Button>

      {/* File Grid */}
      {files.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {files.map((file, index) => (
            <div key={index} className="relative group">
              {type === "image" ? (
                <img
                  src={file.url}
                  alt={file.name}
                  className="w-full h-32 object-cover rounded-lg border"
                />
              ) : (
                <div className="w-full h-32 bg-gray-100 rounded-lg border flex flex-col items-center justify-center">
                  <Video className="w-8 h-8 text-gray-400" />
                  <p className="text-xs text-gray-600 mt-1 truncate px-2 max-w-full">
                    {file.name}
                  </p>
                </div>
              )}
              <Button
                type="button"
                size="sm"
                variant="destructive"
                onClick={() => handleRemove(index)}
                className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}