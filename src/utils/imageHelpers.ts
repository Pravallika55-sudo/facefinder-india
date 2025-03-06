
/**
 * Utility functions for image processing
 */

// Convert File to Data URL for preview
export const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Load image from URL and return an HTMLImageElement
export const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

// Resize an image to fit within maxWidth/maxHeight while maintaining aspect ratio
export const resizeImage = async (
  file: File, 
  maxWidth: number = 800, 
  maxHeight: number = 800,
  quality: number = 0.9
): Promise<File> => {
  const dataUrl = await fileToDataUrl(file);
  const img = await loadImage(dataUrl);
  
  // Calculate new dimensions
  let width = img.width;
  let height = img.height;
  
  if (width > height) {
    if (width > maxWidth) {
      height = Math.round(height * (maxWidth / width));
      width = maxWidth;
    }
  } else {
    if (height > maxHeight) {
      width = Math.round(width * (maxHeight / height));
      height = maxHeight;
    }
  }
  
  // Create canvas and resize
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Failed to get canvas context');
  
  ctx.drawImage(img, 0, 0, width, height);
  
  // Convert canvas to Blob and then to File
  return new Promise<File>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Canvas to Blob conversion failed'));
          return;
        }
        const newFile = new File([blob], file.name, {
          type: 'image/jpeg',
          lastModified: Date.now(),
        });
        resolve(newFile);
      },
      'image/jpeg',
      quality
    );
  });
};

// Check if the file is a valid image type
export const isValidImageType = (file: File): boolean => {
  const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
  return validTypes.includes(file.type);
};

// Check if the file size is within the limit (in MB)
export const isValidFileSize = (file: File, maxSizeMB: number = 5): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

// Create a placeholder image based on initials
export const createInitialsAvatar = (
  initials: string,
  size: number = 200,
  bgColor: string = '#3b82f6',
  textColor: string = '#ffffff'
): string => {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Failed to get canvas context');
  
  // Draw background
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, size, size);
  
  // Draw text
  ctx.fillStyle = textColor;
  ctx.font = `bold ${size / 2}px Inter, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(initials.toUpperCase(), size / 2, size / 2);
  
  return canvas.toDataURL('image/png');
};

// Generate a blurred placeholder from an image
export const generateBlurPlaceholder = async (
  file: File,
  width: number = 20,
  height: number = 20
): Promise<string> => {
  const dataUrl = await fileToDataUrl(file);
  const img = await loadImage(dataUrl);
  
  // Calculate aspect ratio
  const aspectRatio = img.width / img.height;
  
  // Adjust dimensions to maintain aspect ratio
  if (aspectRatio > 1) {
    height = Math.round(width / aspectRatio);
  } else {
    width = Math.round(height * aspectRatio);
  }
  
  // Create tiny canvas
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  
  // Draw tiny image
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Failed to get canvas context');
  
  ctx.drawImage(img, 0, 0, width, height);
  
  return canvas.toDataURL('image/jpeg', 0.1);
};
