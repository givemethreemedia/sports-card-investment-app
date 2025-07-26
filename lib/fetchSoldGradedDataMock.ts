// lib/fetchSoldGradedDataMock.ts

export interface GradedCard {
  name: string;
  psa10Avg: number;
  psa9Avg: number;
  gemRate: number;
  salesPerWeek: number;
}

export async function fetchSoldGradedDataMock(): Promise<GradedCard[]> {
  return [
    {
      name: "2024 Donruss Jayden Daniels Optic Preview Pink",
      psa10Avg: 110,
      psa9Avg: 45,
      gemRate: 0.65,
      salesPerWeek: 22.3,
    },
    {
      name: "2023 Bowman Chrome Elly De La Cruz Auto",
      psa10Avg: 280,
      psa9Avg: 100,
      gemRate: 0.6,
      salesPerWeek: 12.1,
    },
    {
      name: "2020 Prizm Justin Herbert Rookie",
      psa10Avg: 150,
      psa9Avg: 65,
      gemRate: 0.55,
      salesPerWeek: 18.4,
    }
  ];
}
