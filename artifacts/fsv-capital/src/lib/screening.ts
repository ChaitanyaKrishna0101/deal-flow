// Frontend screening — runs before submitting to backend

export interface ScreenResult { passed: boolean; reason?: string; }

export function screenApplication(data: Record<string, unknown>): ScreenResult {
  const allowed = ["Fintech", "AI/ML", "Blockchain", "DeepTech", "SaaS"];
  if (!allowed.includes(data.sector as string)) {
    return { passed: false, reason: "We currently focus on Fintech, AI, Blockchain, DeepTech, and SaaS." };
  }
  if (data.stage === "Idea" && Number(data.monthlyRevenue) > 0) {
    return { passed: false, reason: "Stage and revenue data appears inconsistent." };
  }
  const amt = Number(data.amountRaising);
  if (amt > 0 && (amt < 50000 || amt > 10000000)) {
    return { passed: false, reason: "Funding ask is outside our current investment range ($50K–$10M)." };
  }
  return { passed: true };
}
