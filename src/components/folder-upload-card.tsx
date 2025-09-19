import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, File, X, CloudUpload, Files } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { FormFile } from "@/types";

interface FolderUploadCardProps {
  onBatchParsed: (results: FormFile[]) => void;
}

export function FolderUploadCard({ onBatchParsed }: FolderUploadCardProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isParsing, setIsParsing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const batchParse = async (files: File[]) => {
    setIsParsing(true);
    const filesData = await Promise.all(
      files.map(async (file) => {
        const content = await file.text();
        return {
          fileName: file.name,
          fileContent: content,
          uploadedAt: new Date(),
        };
      })
    );
    setIsParsing(false);
    onBatchParsed?.(filesData);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files) {
      const filesArray = Array.from(e.dataTransfer.files);
      await handleFiles(filesArray);
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      await handleFiles(filesArray);
    }
  };

  const handleFolderInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).filter((file) =>
        file.name.endsWith(".json")
      );
      await handleFiles(filesArray);
    }
  };

  const handleFiles = async (files: File[]) => {
    const jsonFiles = files.filter((file) => {
      return file.type === "application/json" || file.name.endsWith(".json");
    });

    if (jsonFiles.length === 0) {
      toast({
        title: "No valid JSON files found",
        description: "Please select JSON files to upload.",
        variant: "destructive",
      });
      return;
    }

    if (jsonFiles.length !== files.length) {
      toast({
        title: "Some files filtered out",
        description: `Only ${jsonFiles.length} of ${files.length} files are valid JSON files.`,
      });
    }

    setUploadedFiles(jsonFiles);
    await batchParse(jsonFiles);
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const clearAllFiles = () => {
    setUploadedFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (folderInputRef.current) {
      folderInputRef.current.value = "";
    }
    onBatchParsed([]);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Files className="h-5 w-5 text-primary" />
          <span>Upload JSON Forms (Batch)</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {uploadedFiles.length === 0 ? (
          <div className="space-y-4">
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                dragActive
                  ? "border-primary bg-accent"
                  : "border-border hover:border-primary/50 hover:bg-accent/50"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              data-testid="dropzone-upload"
            >
              <div className="space-y-4">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                  <CloudUpload className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    Drop JSON files here or click to browse
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Supports multiple .json files up to 10MB each
                  </p>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".json"
                multiple
                onChange={handleFileInput}
                data-testid="input-files"
              />
            </div>
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={() => folderInputRef.current?.click()}
                className="flex items-center space-x-2"
                data-testid="button-upload-folder"
              >
                <Upload className="h-4 w-4" />
                <span>Select Folder</span>
              </Button>
              <input
                ref={folderInputRef}
                type="file"
                className="hidden"
                {...{ webkitdirectory: "true" }}
                multiple
                onChange={handleFolderInput}
                data-testid="input-folder"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium">
                {uploadedFiles.length} file
                {uploadedFiles.length !== 1 ? "s" : ""} selected
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFiles}
                // disabled={batchUploadMutation.isPending}
                data-testid="button-clear-all"
              >
                Clear All
              </Button>
            </div>
            <div className="max-h-48 overflow-y-auto space-y-2">
              {uploadedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 p-3 bg-accent rounded-md"
                >
                  <File className="h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <p
                      className="text-sm font-medium"
                      data-testid={`text-filename-${index}`}
                    >
                      {file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    // disabled={batchUploadMutation.isPending}
                    data-testid={`button-remove-file-${index}`}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {isParsing && (
          <div className="mt-4">
            <div className="bg-muted rounded-full h-2">
              <div className="bg-primary h-2 rounded-full transition-all duration-300 w-2/3"></div>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Processing {uploadedFiles.length} files...</span>
              <span>Processing...</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
