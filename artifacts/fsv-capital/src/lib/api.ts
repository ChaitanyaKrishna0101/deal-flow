// Central API client — all fetch calls go through here

const BASE = "/api";

async function req<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error((err as { error?: string }).error || res.statusText);
  }
  return res.json() as Promise<T>;
}

export interface ScoreBreakdown {
  marketSize: number;
  revenueStage: number;
  teamStrength: number;
  traction: number;
  innovation: number;
}

export interface CoreTeamMember { name: string; role: string; linkedin: string; }

export interface Application {
  id: string;
  applicationId: string;
  submittedAt: string;
  status: string;
  startupName: string;
  founderNames: string;
  contactEmail: string;
  sector: string;
  stage: string;
  amountRaising?: number;
  currency?: string;
  fundingStage?: string;
  equityOffered?: number;
  dealScore?: number;
  scoreBreakdown?: ScoreBreakdown;
  aiAnalysis?: string;
  websiteUrl?: string;
  contactNumber?: string;
  linkedinFounder?: string;
  linkedinCompany?: string;
  headquarters?: string;
  yearOfIncorporation?: number;
  problemStatement?: string;
  solutionOverview?: string;
  businessModel?: string;
  coreProduct?: string;
  techStack?: string[];
  usp?: string;
  hasPatents?: boolean;
  patentDetails?: string;
  demoLink?: string;
  tam?: string;
  sam?: string;
  som?: string;
  customerSegment?: string;
  competitors?: string;
  competitiveAdvantage?: string;
  monthlyRevenue?: number;
  annualRevenue?: number;
  growthRate?: number;
  customerCount?: number;
  partnerships?: string;
  achievements?: string;
  fundingRaised?: number;
  previousInvestors?: string;
  burnRate?: number;
  runway?: number;
  projectionY1?: number;
  projectionY2?: number;
  projectionY3?: number;
  useOfFunds?: string[];
  useOfFundsDetail?: string;
  founderEducation?: string;
  founderExperience?: string;
  teamSize?: number;
  coreTeam?: CoreTeamMember[];
  advisors?: string;
  whyFSV?: string;
  fsvValueAdd?: string;
  openToMentorship?: boolean;
  isRegistered?: boolean;
  hasLegalIssues?: boolean;
  legalExplanation?: string;
  consentGiven?: boolean;
}

export interface DashboardStats {
  total: number;
  averageScore: number;
  shortlisted: number;
  thisMonth: number;
  bySector: Record<string, number>;
  byStage: Record<string, number>;
  byStatus: Record<string, number>;
}

export interface SubmitResult {
  success: boolean;
  applicationId: string;
  score: number;
  scoreBreakdown: ScoreBreakdown;
}

export interface AiAnalysis {
  applicationId: string;
  analysis: string;
  strengths: string[];
  concerns: string[];
  recommendation: string;
}

export const api = {
  submitApplication: (data: Record<string, unknown>) =>
    req<SubmitResult>("/applications", { method: "POST", body: JSON.stringify(data) }),

  listApplications: (params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return req<Application[]>(`/applications${qs}`);
  },

  getApplication: (id: string) => req<Application>(`/applications/${id}`),

  updateStatus: (id: string, status: string) =>
    req<Application>(`/applications/${id}`, { method: "PATCH", body: JSON.stringify({ status }) }),

  analyzeApplication: (id: string) =>
    req<AiAnalysis>(`/applications/${id}/analyze`, { method: "POST" }),

  getDashboardStats: () => req<DashboardStats>("/dashboard/stats"),

  exportCsvUrl: () => "/api/export/csv",
};
