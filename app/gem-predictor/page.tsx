"use client";

import React, { useState, useRef } from "react";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { getCroppedImg } from "@/lib/cropImage";
import { createClient } from "@supabase/supabase-js";
import Tesseract from "tesseract.js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function GemPredictor() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>({ unit: "%", width: 50, height: 50, x: 25, y: 25 });
  const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null);
  const [playerName, setPlayerName] = useState("");
  const [cardName, setCardName] = useState("");
  const [showEdit, setShowEdit] = useState(false);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () => setSelectedImage(reader.result as string));
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    imageRef.current = e.currentTarget;
  };

  const runOCR = async (image: string): Promise<string> => {
    const result = await Tesseract.recognize(image, 'eng', {
      logger: (m) => console.log(m),
    });
    return result.data.text;
  };

  const savePSAImageMetadata = async (imageUrl: string, cardName: string, playerName: string) => {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) {
      alert("User not authenticated");
      return;
    }
    const { error } = await supabase.from("psa_images").insert([
      {
        user_id: user.id,
        image_url: imageUrl,
        card_name: cardName,
        player_name: playerName,
      },
    ]);
    if (error) console.error("Error saving metadata:", error);
  };

  const handleCrop = async () => {
    if (!selectedImage || !imageRef.current) return;

    const pixelCrop: PixelCrop = {
      unit: "px",
      x: crop.x || 0,
      y: crop.y || 0,
      width: crop.width || 0,
      height: crop.height || 0,
    };

    try {
      const croppedUrl = await getCroppedImg(selectedImage, pixelCrop, imageRef.current);
      setCroppedImageUrl(croppedUrl);

      const ocrText = await runOCR(selectedImage);
      console.log("OCR Text:", ocrText);

      const match = ocrText.match(/\d{4}.*?(.*?) Optic.*? (.*?)\s*$/i);
      setPlayerName(match?.[1]?.trim() || "Unknown Player");
      setCardName(match?.[2]?.trim() || "Unknown Card");

      setShowEdit(true);
    } catch (error) {
      console.error("Cropping or OCR failed:", error);
    }
  };

  const handleSave = async () => {
    if (!croppedImageUrl || !playerName || !cardName) {
      alert("Missing info");
      return;
    }
    await savePSAImageMetadata(croppedImageUrl, cardName, playerName);
    alert("Saved successfully!");
    setShowEdit(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gem Predictor</h1>
      <input type="file" accept="image/*" onChange={onSelectFile} className="mb-4" />

      {selectedImage && (
        <div className="flex flex-col md:flex-row gap-4">
          <ReactCrop
            crop={crop}
            onChange={(newCrop) => setCrop(newCrop)}
            keepSelection
            style={{ maxWidth: "100%" }}
          >
            <img
              src={selectedImage}
              alt="PSA 10 Card"
              onLoad={onImageLoad}
              className="max-w-full max-h-[80vh]"
              ref={(el) => {
                imageRef.current = el;
                
              }}
            />
          </ReactCrop>

          {croppedImageUrl && (
            <div>
              <h2 className="text-lg font-semibold mb-2">Cropped Image</h2>
              <img src={croppedImageUrl} alt="Cropped" className="border rounded shadow-md mb-2" />

              {showEdit && (
                <div className="space-y-2">
                  <div>
                    <label className="block text-sm font-medium">Player Name</label>
                    <input
                      type="text"
                      value={playerName}
                      onChange={(e) => setPlayerName(e.target.value)}
                      className="w-full border px-2 py-1 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Card Name</label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="w-full border px-2 py-1 rounded"
                    />
                  </div>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Save Metadata
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <button
        onClick={handleCrop}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Crop and Extract Text
      </button>
    </div>
  );
}
