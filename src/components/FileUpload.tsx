import { useState, useRef } from "react";
import { Upload, X, File, FileText, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface FileUploadProps {
  onUpload: (url: string, fileName: string) => void;
  accept?: string;
  maxSize?: number; // in MB
  label?: string;
  bucketPath?: string;
}

const FileUpload = ({ 
  onUpload, 
  accept = ".pdf,.doc,.docx,.png,.jpg,.jpeg", 
  maxSize = 10,
  label = "Upload file",
  bucketPath = "documents"
}: FileUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{ url: string; name: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      toast({
        title: "File too large",
        description: `Maximum file size is ${maxSize}MB`,
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${bucketPath}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('founder-uploads')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('founder-uploads')
        .getPublicUrl(filePath);

      setUploadedFile({ url: publicUrl, name: file.name });
      onUpload(publicUrl, file.name);
      
      toast({
        title: "File uploaded",
        description: file.name
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext || '')) {
      return <ImageIcon className="w-4 h-4" />;
    }
    if (['pdf', 'doc', 'docx'].includes(ext || '')) {
      return <FileText className="w-4 h-4" />;
    }
    return <File className="w-4 h-4" />;
  };

  if (uploadedFile) {
    return (
      <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
        {getFileIcon(uploadedFile.name)}
        <span className="flex-1 text-sm truncate">{uploadedFile.name}</span>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6" 
          onClick={removeFile}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
        id="file-upload"
      />
      <label htmlFor="file-upload">
        <Button
          variant="outline"
          className="gap-2 cursor-pointer w-full"
          disabled={isUploading}
          asChild
        >
          <span>
            {isUploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            {isUploading ? "Uploading..." : label}
          </span>
        </Button>
      </label>
    </div>
  );
};

export default FileUpload;
