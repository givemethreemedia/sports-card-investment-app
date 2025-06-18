// lib/cropImage.ts
import { PixelCrop } from 'react-image-crop';

export const getCroppedImg = async (
  imageSrc: string,
  crop: PixelCrop,
  imageRef: HTMLImageElement
): Promise<string> => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) throw new Error('Could not get canvas context');

  const scaleX = imageRef.naturalWidth / imageRef.width;
  const scaleY = imageRef.naturalHeight / imageRef.height;

  const pixelCrop = {
    x: crop.x,
    y: crop.y,
    width: crop.width,
    height: crop.height,
  };

  if (!pixelCrop.width || !pixelCrop.height) {
    throw new Error('Invalid crop dimensions');
  }

  canvas.width = pixelCrop.width * scaleX;
  canvas.height = pixelCrop.height * scaleY;

  ctx.drawImage(
    imageRef,
    pixelCrop.x * scaleX,
    pixelCrop.y * scaleY,
    pixelCrop.width * scaleX,
    pixelCrop.height * scaleY,
    0,
    0,
    pixelCrop.width * scaleX,
    pixelCrop.height * scaleY
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Canvas is empty — please ensure the crop area is valid.'));
        return;
      }
      const fileUrl = URL.createObjectURL(blob);
      resolve(fileUrl);
    }, 'image/jpeg');
  });
};