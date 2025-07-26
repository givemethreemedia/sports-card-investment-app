// lib/computeInvestmentScore.ts

export type CardData = {
  roi: number; // return on investment as decimal, e.g. 0.75 for 75%
  gemRate: number; // gem rate as decimal, e.g. 0.4 for 40%
  liquidity: number; // average number of sales per week
};

export function computeInvestmentScore({ roi, gemRate, liquidity }: CardData): number {
  // Normalize and cap inputs for scoring
  const normalizedROI = Math.min(Math.max(roi, -1), 5); // limit to -100% to 500%
  const normalizedGemRate = Math.min(Math.max(gemRate, 0), 1); // 0% to 100%
  const normalizedLiquidity = Math.min(Math.max(liquidity / 10, 0), 1); // normalize to 0-1 scale

  // Weights (can be tuned later)
  const weights = {
    roi: 0.45,
    gemRate: 0.35,
    liquidity: 0.2,
  };

  // Compute weighted score (out of 100)
  const score =
    normalizedROI * weights.roi * 100 +
    normalizedGemRate * weights.gemRate * 100 +
    normalizedLiquidity * weights.liquidity * 100;

  return Math.round(score);
}
