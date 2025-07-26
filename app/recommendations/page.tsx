"use client";

import React, { useEffect, useState } from "react";

type CardRecommendation = {
  id: string;
  player: string;
  card: string;
  raw_price: number;
  psa10_price: number;
  psa9_price: number;
  gem_rate: number; // 0–1
  liquidity: number; // sales/week
  ebay_url: string;
  investment_score: number;
};

export default function RecommendationsPage() {
  const [cards, setCards] = useState<CardRecommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Temporary local data — replace with fetch from Supabase or API
    const mock: CardRecommendation[] = [
      {
        id: "1",
        player: "Jayden Daniels",
        card: "2024 Donruss Optic Preview Pink",
        raw_price: 12,
        psa10_price: 130,
        psa9_price: 40,
        gem_rate: 0.68,
        liquidity: 7,
        ebay_url: "https://www.ebay.com/itm/123456789",
        investment_score: 0.73,
      },
      {
        id: "2",
        player: "Caitlin Clark",
        card: "2024 Bowman U First Chrome",
        raw_price: 20,
        psa10_price: 100,
        psa9_price: 35,
        gem_rate: 0.60,
        liquidity: 9,
        ebay_url: "https://www.ebay.com/itm/987654321",
        investment_score: 0.69,
      },
    ];

    setCards(mock);
    setLoading(false);
  }, []);

  if (loading) return <p className="p-6 text-gray-600">Loading recommendations...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Top ROI Card Picks</h1>
      <div className="grid grid-cols-1 gap-4">
        {cards
          .sort((a, b) => b.investment_score - a.investment_score)
          .map((card) => (
            <div
              key={card.id}
              className="p-4 border rounded-lg shadow hover:shadow-md transition"
            >
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h2 className="text-lg font-semibold">{card.player}</h2>
                  <p className="text-sm text-gray-600">{card.card}</p>
                </div>
                <a
                  href={card.ebay_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline text-sm"
                >
                  View Listing
                </a>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-800">
                <div><strong>Raw Price:</strong> ${card.raw_price}</div>
                <div><strong>PSA 10:</strong> ${card.psa10_price}</div>
                <div><strong>Gem Rate:</strong> {(card.gem_rate * 100).toFixed(1)}%</div>
                <div><strong>Liquidity:</strong> {card.liquidity} / week</div>
              </div>
              <div className="mt-2 text-sm text-green-700">
                <strong>Investment Score:</strong> {(card.investment_score * 100).toFixed(1)}%
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
