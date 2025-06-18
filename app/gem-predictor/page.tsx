'use client';
// app/gem-predictor/page.tsx

import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { getCroppedImg } from '@/lib/cropImage';
import type { Area } from 'react-easy-crop';

const GemPredictorPage = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);

  const onCropComplete = useCallback(
    (_croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const showCroppedImage = useCallback(async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    try {
      const croppedImg = await getCroppedImg(imageSrc, croppedAreaPixels);
      setCroppedImage(croppedImg);
    } catch (e) {
      console.error(e);
    }
  }, [imageSrc, croppedAreaPixels]);

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const imageDataUrl = await readFile(file);
      setImageSrc(imageDataUrl);
      setCroppedImage(null);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gem Predictor</h1>
      <input type="file" accept="image/*" onChange={onFileChange} />
      {imageSrc && (
        <div className="relative w-full h-[400px] my-4">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={2.5 / 3.5}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>
      )}
      {imageSrc && (
        <div className="my-4">
          <p className="mb-2">Zoom</p>
          <Slider
            min={1}
            max={3}
            step={0.1}
            value={[zoom]}
            onValueChange={(val: number[]) => setZoom(val[0])}
          />
          <Button className="mt-4" onClick={showCroppedImage}>Crop and Save</Button>
        </div>
      )}
      {croppedImage && (
        <Card className="mt-6">
          <CardContent>
            <h2 className="text-lg font-semibold mb-2">Cropped Image Preview</h2>
            <img src={croppedImage} alt="Cropped Result" className="max-w-full h-auto rounded-xl" />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GemPredictorPage;

function readFile(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => resolve(reader.result as string), false);
    reader.readAsDataURL(file);
  });
}
