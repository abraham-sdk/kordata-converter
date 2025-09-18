import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, File, X, CloudUpload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FileUploadCardProps {
  //   onFormUploaded: (formId: string) => void;
  onFormUploaded: (fileName: string, fileContent: string) => void;
  selectedFormId?: string | null;
}

export function FileUploadCard({ onFormUploaded }: FileUploadCardProps) {
  const { toast } = useToast();
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (file.type !== "application/json") {
      toast({
        title: "Invalid file type",
        description: "Please upload a valid JSON file.",
        variant: "destructive",
      });
      return;
    }

    setUploadedFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const fileContent = e.target?.result as string;
        onFormUploaded?.(file.name, fileContent);
      };

      reader.readAsText(file); // Read the file as text
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Upload className="h-5 w-5 text-primary" />
          <span>Upload JSON Form</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!uploadedFile ? (
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
                  Drop JSON file here or click to browse
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Supports .json files up to 10MB
                </p>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".json"
              onChange={handleFileInput}
              data-testid="input-file"
            />
          </div>
        ) : (
          <div className="flex items-center space-x-2 p-3 bg-accent rounded-md">
            <File className="h-5 w-5 text-primary" />
            <div className="flex-1">
              <p className="text-sm font-medium" data-testid="text-filename">
                {uploadedFile.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {(uploadedFile.size / 1024).toFixed(1)} KB •
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={removeFile}
              disabled={isProcessing}
              data-testid="button-remove-file"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {isProcessing && (
          <div className="mt-4">
            <div className="bg-muted rounded-full h-2">
              <div className="bg-primary h-2 rounded-full transition-all duration-300 w-2/3"></div>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Processing...</span>
              <span>65%</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
