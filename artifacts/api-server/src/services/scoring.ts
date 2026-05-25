// Scoring engine — calculates a deal score (0-100) from application data

export interface ScoreBreakdown {
  marketSize: number;
  revenueStage: number;
  teamStrength: number;
  traction: number;
  innovation: number;
}

export interface ScoreResult {
  dealScore: number;
  scoreBreakdown: ScoreBreakdown;
}

export function calculateDealScore(data: Record<string, unknown>): ScoreResult {
  const breakdown: ScoreBreakdown = {
    marketSize: 0,
    revenueStage: 0,
    teamStrength: 0,
    traction: 0,
    innovation: 0,
  };

  // Market size (max 25)
  const tamStr = ((data.tam as string) || "").toLowerCase();
  if (tamStr.includes("billion") || tamStr.includes("$1b") || tamStr.includes("$2b")) {
    breakdown.marketSize = 25;
  } else if (tamStr.includes("million") && parseInt(tamStr) > 500) {
    breakdown.marketSize = 18;
  } else if (tamStr.includes("million")) {
    breakdown.marketSize = 10;
  } else {
    breakdown.marketSize = 5;
  }

  // Revenue stage (max 25)
  const stageMap: Record<string, number> = {
    Scaling: 25,
    "Growth Stage": 20,
    "Early Revenue": 15,
    MVP: 8,
    Idea: 2,
  };
  breakdown.revenueStage = stageMap[(data.stage as string) || ""] || 0;

  // Team strength (max 20)
  let teamScore = 0;
  const teamSize = (data.teamSize as number) || 0;
  if (teamSize >= 3) teamScore += 8;
  else if (teamSize >= 2) teamScore += 5;
  const advisors = (data.advisors as string) || "";
  if (advisors.length > 10) teamScore += 6;
  const founderExp = (data.founderExperience as string) || "";
  if (founderExp.length > 50) teamScore += 6;
  breakdown.teamStrength = Math.min(teamScore, 20);

  // Traction (max 20)
  let tractionScore = 0;
  const monthlyRevenue = (data.monthlyRevenue as number) || 0;
  if (monthlyRevenue > 50000) tractionScore += 10;
  else if (monthlyRevenue > 10000) tractionScore += 7;
  else if (monthlyRevenue > 0) tractionScore += 4;
  const customerCount = (data.customerCount as number) || 0;
  if (customerCount > 500) tractionScore += 5;
  else if (customerCount > 100) tractionScore += 3;
  const growthRate = (data.growthRate as number) || 0;
  if (growthRate > 30) tractionScore += 5;
  else if (growthRate > 15) tractionScore += 3;
  breakdown.traction = Math.min(tractionScore, 20);

  // Innovation (max 10)
  let innovScore = 0;
  if (data.hasPatents) innovScore += 5;
  const innovSectors = ["AI/ML", "Blockchain", "DeepTech"];
  if (innovSectors.includes((data.sector as string) || "")) innovScore += 5;
  breakdown.innovation = Math.min(innovScore, 10);

  const dealScore = Math.min(
    breakdown.marketSize + breakdown.revenueStage + breakdown.teamStrength + breakdown.traction + breakdown.innovation,
    100
  );

  return { dealScore, scoreBreakdown: breakdown };
}
