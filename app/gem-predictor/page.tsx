"use client";

import React, { useState, useRef } from "react";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Button } from "@/components/ui/button";
import { getCroppedImg } from "@/lib/cropImage";

export default function GemPredictorPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>({ unit: "%", x: 10, y: 10, width: 80, height: 80 });
  const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const onImageLoad = (img: HTMLImageElement) => {
    imageRef.current = img;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setCroppedImageUrl(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropSave = async () => {
    if (!selectedImage || !imageRef.current || !crop.width || !crop.height) return;
    try {
      const cropped = await getCroppedImg(selectedImage, crop as PixelCrop, imageRef.current);
      setCroppedImageUrl(cropped);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Gem Score Image Cropper</h1>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="mb-4"
      />
      <div className="flex flex-wrap gap-8">
        {selectedImage && (
          <div className="flex-1 min-w-[300px]">
            <ReactCrop
              crop={crop}
              onChange={(newCrop) => setCrop(newCrop)}
              keepSelection
            >
              <img
                src={selectedImage}
                onLoad={(e) => onImageLoad(e.currentTarget)}
                alt="Source"
                style={{ maxWidth: "100%", maxHeight: "600px" }}
              />
            </ReactCrop>
            <Button className="mt-4" onClick={handleCropSave}>
              Crop and Save
            </Button>
          </div>
        )}

        {croppedImageUrl && (
          <div className="flex-1 min-w-[300px]">
            <h2 className="text-xl font-semibold mb-2">Cropped Image</h2>
            <img
              src={croppedImageUrl}
              alt="Cropped"
              style={{ maxWidth: "100%", maxHeight: "600px" }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
