// Screening filter — runs before saving an application to check eligibility

export interface ScreeningResult {
  passed: boolean;
  reason?: string;
}

export function screenApplication(data: Record<string, unknown>): ScreeningResult {
  const allowedSectors = ["Fintech", "AI/ML", "Blockchain", "DeepTech", "SaaS"];
  const minFundingUSD = 50000;
  const maxFundingUSD = 10000000;

  const sector = (data.sector as string) || "";
  if (!allowedSectors.includes(sector)) {
    return {
      passed: false,
      reason: "We currently focus on Fintech, AI, Blockchain, DeepTech, and SaaS.",
    };
  }

  const stage = (data.stage as string) || "";
  const monthlyRevenue = (data.monthlyRevenue as number) || 0;
  if (stage === "Idea" && monthlyRevenue > 0) {
    return {
      passed: false,
      reason: "Stage and revenue data appears inconsistent.",
    };
  }

  const amountRaising = (data.amountRaising as number) || 0;
  if (amountRaising > 0 && (amountRaising < minFundingUSD || amountRaising > maxFundingUSD)) {
    return {
      passed: false,
      reason: "Funding ask is outside our current investment range ($50K–$10M).",
    };
  }

  return { passed: true };
}
