// lib/fetchSoldGradedData.ts

export type GradedData = {
  name: string;
  psa10Avg: number;
  psa9Avg: number;
  psa10Count: number;
  psa9Count: number;
  salesPerWeek: number;
  gemRate: number;
};

export const fetchSoldGradedData = async (query: string): Promise<GradedData[]> => {
  return [
    {
      name: "Jayden Daniels 2024 Donruss Optic Preview Pink",
      psa10Avg: 120,
      psa9Avg: 70,
      psa10Count: 14,
      psa9Count: 11,
      salesPerWeek: 4.5,
      gemRate: 0.58,
    },
    {
      name: "Cade Cunningham 2021 Prizm Silver",
      psa10Avg: 150,
      psa9Avg: 90,
      psa10Count: 18,
      psa9Count: 13,
      salesPerWeek: 5.2,
      gemRate: 0.61,
    },
    {
      name: "Anthony Richardson 2023 Select Concourse Silver",
      psa10Avg: 95,
      psa9Avg: 60,
      psa10Count: 12,
      psa9Count: 10,
      salesPerWeek: 3.7,
      gemRate: 0.53,
    },
    // Add more mock entries as needed
  ];
};
