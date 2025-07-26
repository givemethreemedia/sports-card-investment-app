// app/api/investments/route.ts
import { NextResponse } from 'next/server';
import { fetchSoldListingsMock } from '@/lib/fetchSoldListingsMock';
import { fetchSoldGradedDataMock } from '@/lib/fetchSoldGradedDataMock';

interface RawCard {
  name: string;
  avgPrice: number;
  image: string;
  sport: string;
  player: string;
  url: string;
}

interface GradedCard {
  name: string;
  psa10Avg: number;
  psa9Avg: number;
  gemRate: number;
  salesPerWeek: number;
}

export async function GET() {
  try {
    const rawListings: RawCard[] = await fetchSoldListingsMock();
    const gradedData: GradedCard[] = await fetchSoldGradedDataMock(); // removed "all" param

    const investments = rawListings.map((rawCard) => {
      const graded = gradedData.find(
        (g) => g.name.toLowerCase() === rawCard.name.toLowerCase()
      );

      if (!graded) return null;

      const rawPrice = rawCard.avgPrice;
      const gemRate = graded.gemRate;
      const psa10Avg = graded.psa10Avg;
      const psa9Avg = graded.psa9Avg;
      const liquidity = graded.salesPerWeek;

      const netPSA10 = psa10Avg * (1 - 0.1325);
      const netPSA9 = psa9Avg * (1 - 0.1325);

      const expectedRevenuePerCard =
        netPSA10 * gemRate + netPSA9 * (1 - gemRate);

      const costPerCard = rawPrice + 21 + 5;

      const dollarROI = expectedRevenuePerCard - costPerCard;
      const percentROI = (dollarROI / costPerCard) * 100;

      return {
        name: rawCard.name,
        image: rawCard.image,
        sport: rawCard.sport,
        player: rawCard.player,
        url: rawCard.url,
        psa10Avg,
        psa9Avg,
        rawAvg: rawPrice,
        gemRate,
        liquidity,
        expectedRevenuePerCard: expectedRevenuePerCard.toFixed(2),
        costPerCard: costPerCard.toFixed(2),
        dollarROI: dollarROI.toFixed(2),
        percentROI: percentROI.toFixed(1),
      };
    });

    const filtered = investments.filter(
      (card): card is NonNullable<typeof card> => card !== null
    );

    return NextResponse.json(
      filtered.sort(
        (a, b) => parseFloat(b.percentROI) - parseFloat(a.percentROI)
      )
    );
  } catch (error) {
    console.error('Error in GET /api/investments:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
