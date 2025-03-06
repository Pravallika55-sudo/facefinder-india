
import React, { useState, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { fileToDataUrl, isValidImageType, isValidFileSize, generateBlurPlaceholder } from '@/utils/imageHelpers';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { UploadCloud, Image, X, AlertCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface UploadAreaProps {
  onImageUploaded: (imageUrl: string, file: File) => void;
  className?: string;
}

const UploadArea: React.FC<UploadAreaProps> = ({ onImageUploaded, className }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [placeholderImage, setPlaceholderImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFile = useCallback(async (file: File) => {
    try {
      setError(null);
      
      // Validate file
      if (!isValidImageType(file)) {
        setError('Please upload a valid image file (JPEG, PNG, or WebP)');
        return;
      }
      
      if (!isValidFileSize(file, 5)) {
        setError('Image size should be less than 5MB');
        return;
      }
      
      setIsLoading(true);
      setUploadProgress(15);
      
      // Generate blur placeholder quickly
      const placeholder = await generateBlurPlaceholder(file);
      setPlaceholderImage(placeholder);
      setUploadProgress(30);
      
      // Get full preview
      const dataUrl = await fileToDataUrl(file);
      setUploadProgress(70);
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 800));
      setUploadProgress(100);
      
      setPreview(dataUrl);
      onImageUploaded(dataUrl, file);
      toast.success('Image uploaded successfully');
    } catch (err) {
      console.error(err);
      setError('An error occurred while processing your image');
      toast.error('Upload failed. Please try again.');
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  }, [onImageUploaded]);
  
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);
  
  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);
  
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);
  
  const handleButtonClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);
  
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  }, [handleFile]);
  
  const handleRemoveImage = useCallback(() => {
    setPreview(null);
    setPlaceholderImage(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);
  
  return (
    <div className={cn("w-full", className)}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg,image/png,image/jpg,image/webp"
        className="hidden"
      />
      
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative w-full rounded-2xl transition-all duration-300 overflow-hidden",
          "border-2 border-dashed border-gray-200 dark:border-gray-700",
          "bg-gray-50 dark:bg-gray-800/30",
          "p-8 flex flex-col items-center justify-center gap-4 text-center",
          "group hover:border-primary/50 hover:bg-gray-100/80 dark:hover:bg-gray-800/40",
          isDragging && "border-primary bg-blue-50/80 dark:bg-blue-900/20",
          (preview || isLoading) && "border-solid border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50"
        )}
      >
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-10">
            <div className="flex flex-col items-center space-y-4 max-w-xs mx-auto w-full">
              <div className="relative w-full">
                <Progress value={uploadProgress} className="h-1 w-full bg-gray-200 dark:bg-gray-700" />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Processing image...</p>
              
              {placeholderImage && (
                <div className="mt-2 relative w-24 h-24 overflow-hidden rounded-lg shadow-md animate-pulse">
                  <img
                    src={placeholderImage}
                    alt="Processing"
                    className="w-full h-full object-cover blur-md"
                  />
                </div>
              )}
            </div>
          </div>
        )}
        
        {preview ? (
          <div className="relative w-full h-[280px] group/image">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-contain rounded-lg"
            />
            <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/40 transition-all duration-300 rounded-lg flex items-center justify-center opacity-0 group-hover/image:opacity-100">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="rounded-full"
                      onClick={handleRemoveImage}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Remove image</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        ) : (
          <>
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700/50 flex items-center justify-center mb-2">
              {error ? (
                <AlertCircle className="h-8 w-8 text-red-500" />
              ) : (
                <div className="relative">
                  <UploadCloud className="h-8 w-8 text-gray-400 group-hover:text-primary transition-colors duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-primary/20 rounded-full animate-ping opacity-0 group-hover:opacity-100" />
                  </div>
                </div>
              )}
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
                {error ? 'Upload Error' : 'Upload an image'}
              </h3>
              
              {error ? (
                <p className="text-sm text-red-500 max-w-xs">{error}</p>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 max-w-xs">
                  Drag and drop a photo, or click to browse
                </p>
              )}
            </div>
            
            <Button 
              onClick={handleButtonClick}
              variant={error ? "destructive" : "default"}
              className="relative overflow-hidden group/btn"
            >
              <span className="relative z-10 flex items-center gap-2">
                <Image className="h-4 w-4" />
                {error ? 'Try Again' : 'Select Image'}
              </span>
              <span className="absolute inset-0 bg-primary transform scale-x-0 group-hover/btn:scale-x-100 transition-transform origin-left duration-300" />
            </Button>
            
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
              Supported formats: JPEG, PNG, WebP (max 5MB)
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default UploadArea;
