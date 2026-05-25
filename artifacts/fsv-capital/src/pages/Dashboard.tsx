// Investor Dashboard — deal pipeline with filters, AI analysis, status updates

import { useState, useEffect, useCallback } from "react";
import { api, type Application, type DashboardStats, type AiAnalysis } from "@/lib/api";

const STATUSES = ["Under Review", "Shortlisted", "Rejected", "Funded"];

function ScoreBadge({ score }: { score?: number }) {
  if (score === undefined) return <span className="text-gray-400 text-xs">N/A</span>;
  const color = score >= 65 ? "bg-emerald-100 text-emerald-700" : score >= 40 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700";
  return (
    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold ${color}`}>
      {score}
    </div>
  );
}

function StageBadge({ stage }: { stage: string }) {
  const colors: Record<string, string> = {
    "Idea": "bg-gray-100 text-gray-600",
    "MVP": "bg-blue-100 text-blue-700",
    "Early Revenue": "bg-green-100 text-green-700",
    "Growth Stage": "bg-teal-100 text-teal-700",
    "Scaling": "bg-purple-100 text-purple-700",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[stage] || "bg-gray-100 text-gray-600"}`}>
      {stage}
    </span>
  );
}

function SectorBadge({ sector }: { sector: string }) {
  const colors: Record<string, string> = {
    "Fintech": "bg-indigo-100 text-indigo-700",
    "AI/ML": "bg-violet-100 text-violet-700",
    "Blockchain": "bg-orange-100 text-orange-700",
    "DeepTech": "bg-cyan-100 text-cyan-700",
    "SaaS": "bg-sky-100 text-sky-700",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[sector] || "bg-gray-100 text-gray-600"}`}>
      {sector}
    </span>
  );
}

function DetailModal({ app, onClose, onStatusChange }: {
  app: Application;
  onClose: () => void;
  onStatusChange: (id: string, status: string) => void;
}) {
  const [analysis, setAnalysis] = useState<AiAnalysis | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const runAnalysis = async () => {
    setAnalyzing(true);
    try {
      const res = await api.analyzeApplication(app.id);
      setAnalysis(res);
    } catch (err) {
      alert("AI analysis failed. Check that GEMINI_API_KEY is set.");
    } finally {
      setAnalyzing(false);
    }
  };

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="mb-4">
      <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">{title}</h4>
      {children}
    </div>
  );

  const Row = ({ label, value }: { label: string; value?: unknown }) => (
    <div className="flex gap-2 text-sm mb-1">
      <span className="text-gray-400 min-w-[120px] flex-shrink-0">{label}</span>
      <span className="text-gray-800">{value !== undefined && value !== null && value !== "" ? String(value) : "—"}</span>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center p-4 pt-10 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-3xl shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{app.startupName}</h3>
            <div className="flex items-center gap-2 mt-1">
              <SectorBadge sector={app.sector} />
              <StageBadge stage={app.stage} />
              <span className="text-xs text-gray-400">{app.applicationId}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ScoreBadge score={app.dealScore} />
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl font-light">×</button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[70vh]">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Section title="Basics">
                <Row label="Founders" value={app.founderNames} />
                <Row label="Email" value={app.contactEmail} />
                <Row label="HQ" value={app.headquarters} />
                <Row label="Website" value={app.websiteUrl} />
              </Section>
              <Section title="Business">
                <Row label="Model" value={app.businessModel} />
                <Row label="Problem" value={app.problemStatement?.slice(0, 120) + (app.problemStatement && app.problemStatement.length > 120 ? "..." : "")} />
                <Row label="USP" value={app.usp?.slice(0, 120)} />
              </Section>
              <Section title="Market">
                <Row label="TAM" value={app.tam} />
                <Row label="SAM" value={app.sam} />
                <Row label="SOM" value={app.som} />
              </Section>
              <Section title="Traction">
                <Row label="Monthly Revenue" value={app.monthlyRevenue ? `$${app.monthlyRevenue.toLocaleString()}` : undefined} />
                <Row label="Annual Revenue" value={app.annualRevenue ? `$${app.annualRevenue.toLocaleString()}` : undefined} />
                <Row label="Growth Rate" value={app.growthRate ? `${app.growthRate}%` : undefined} />
                <Row label="Customers" value={app.customerCount?.toLocaleString()} />
              </Section>
            </div>

            <div>
              <Section title="Funding Ask">
                <Row label="Amount" value={app.amountRaising ? `$${app.amountRaising.toLocaleString()} ${app.currency}` : undefined} />
                <Row label="Funding Stage" value={app.fundingStage} />
                <Row label="Equity Offered" value={app.equityOffered ? `${app.equityOffered}%` : undefined} />
                <Row label="Use of Funds" value={app.useOfFunds?.join(", ")} />
              </Section>
              <Section title="Team">
                <Row label="Team Size" value={app.teamSize} />
                <Row label="Experience" value={app.founderExperience?.slice(0, 120)} />
              </Section>

              {/* Score breakdown */}
              {app.scoreBreakdown && (
                <Section title="Score Breakdown">
                  {[
                    { label: "Market Size", val: app.scoreBreakdown.marketSize, max: 25 },
                    { label: "Revenue Stage", val: app.scoreBreakdown.revenueStage, max: 25 },
                    { label: "Team Strength", val: app.scoreBreakdown.teamStrength, max: 20 },
                    { label: "Traction", val: app.scoreBreakdown.traction, max: 20 },
                    { label: "Innovation", val: app.scoreBreakdown.innovation, max: 10 },
                  ].map((item) => (
                    <div key={item.label} className="mb-2">
                      <div className="flex justify-between text-xs mb-0.5">
                        <span className="text-gray-500">{item.label}</span>
                        <span className="font-medium text-gray-700">{item.val}/{item.max}</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-500 rounded-full"
                          style={{ width: `${(item.val / item.max) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </Section>
              )}

              {/* Status */}
              <Section title="Status">
                <select
                  value={app.status}
                  onChange={e => onStatusChange(app.id, e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  {STATUSES.map(s => <option key={s}>{s}</option>)}
                </select>
              </Section>

              {/* Links */}
              {app.demoLink && (
                <Section title="Links">
                  <a href={app.demoLink} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-600 hover:underline">
                    Demo →
                  </a>
                </Section>
              )}
            </div>
          </div>

          {/* AI Analysis */}
          <div className="mt-4 border-t border-gray-100 pt-4">
            {!analysis ? (
              <button
                onClick={runAnalysis}
                disabled={analyzing}
                className="flex items-center gap-2 px-4 py-2 bg-violet-50 hover:bg-violet-100 text-violet-700 rounded-lg text-sm font-medium transition-colors"
              >
                <span>✨</span>
                {analyzing ? "Analyzing with Gemini AI..." : "Run AI Analysis"}
              </button>
            ) : (
              <div className="bg-violet-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span>✨</span>
                  <span className="text-sm font-semibold text-violet-800">Gemini AI Analysis</span>
                </div>
                <p className="text-sm text-violet-900 mb-3">{analysis.analysis}</p>
                {analysis.strengths.length > 0 && (
                  <div className="mb-2">
                    <div className="text-xs font-semibold text-violet-700 mb-1">Strengths</div>
                    <ul className="space-y-0.5">
                      {analysis.strengths.map((s, i) => (
                        <li key={i} className="text-xs text-violet-800 flex gap-1.5"><span className="text-emerald-500">✓</span>{s}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {analysis.concerns.length > 0 && (
                  <div className="mb-2">
                    <div className="text-xs font-semibold text-violet-700 mb-1">Concerns</div>
                    <ul className="space-y-0.5">
                      {analysis.concerns.map((c, i) => (
                        <li key={i} className="text-xs text-violet-800 flex gap-1.5"><span className="text-amber-500">!</span>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {analysis.recommendation && (
                  <div className="mt-2 bg-white rounded-lg p-2.5">
                    <div className="text-xs font-semibold text-violet-700 mb-0.5">Recommendation</div>
                    <div className="text-xs text-gray-700">{analysis.recommendation}</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [apps, setApps] = useState<Application[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Application | null>(null);
  const [filters, setFilters] = useState({ sector: "", stage: "", sortBy: "score" });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [appsData, statsData] = await Promise.all([
        api.listApplications(Object.fromEntries(
          Object.entries(filters).filter(([, v]) => v)
        )),
        api.getDashboardStats(),
      ]);
      setApps(appsData);
      setStats(statsData);
    } catch (err) {
      console.error("Failed to load dashboard", err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { load(); }, [load]);

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await api.updateStatus(id, status);
      setApps(prev => prev.map(a => a.id === id ? { ...a, status } : a));
      if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : null);
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const SECTORS = ["Fintech", "AI/ML", "Blockchain", "DeepTech", "SaaS", "HealthTech", "EdTech", "Other"];
  const STAGES = ["Idea", "MVP", "Early Revenue", "Growth Stage", "Scaling"];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <div>
              <h1 className="font-semibold text-gray-900">FSV Capital — Deal Pipeline</h1>
              <p className="text-xs text-gray-400">Investor Dashboard · Login required in production</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a href="/apply" className="text-sm text-indigo-600 hover:underline font-medium">New Application</a>
            <a
              href={api.exportCsvUrl()}
              download
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
            >
              Export CSV
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6">
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[
              { label: "Total Applications", value: stats.total },
              { label: "Average Score", value: `${stats.averageScore}/100` },
              { label: "Shortlisted", value: stats.shortlisted },
              { label: "This Month", value: stats.thisMonth },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-5">
                <div className="text-2xl font-bold text-gray-900">{s.value}</div>
                <div className="text-xs text-gray-400 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 mb-5 flex items-center gap-4 flex-wrap">
          <select
            value={filters.sector}
            onChange={e => setFilters(f => ({ ...f, sector: e.target.value }))}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
          >
            <option value="">All Sectors</option>
            {SECTORS.map(s => <option key={s}>{s}</option>)}
          </select>
          <select
            value={filters.stage}
            onChange={e => setFilters(f => ({ ...f, stage: e.target.value }))}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
          >
            <option value="">All Stages</option>
            {STAGES.map(s => <option key={s}>{s}</option>)}
          </select>
          <select
            value={filters.sortBy}
            onChange={e => setFilters(f => ({ ...f, sortBy: e.target.value }))}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
          >
            <option value="score">Sort by Score</option>
            <option value="date">Sort by Date</option>
            <option value="funding">Sort by Funding Ask</option>
          </select>
          <span className="text-xs text-gray-400 ml-auto">{apps.length} deal{apps.length !== 1 ? "s" : ""}</span>
        </div>

        {/* Deal cards */}
        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading...</div>
        ) : apps.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-3">📭</div>
            <div className="text-gray-500 font-medium">No applications yet</div>
            <p className="text-sm text-gray-400 mt-1">
              <a href="/apply" className="text-indigo-600 hover:underline">Submit the first one →</a>
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {apps.map((app) => (
              <div key={app.id} className="bg-white rounded-xl border border-gray-100 hover:border-indigo-200 hover:shadow-sm transition-all p-5">
                <div className="flex items-center gap-4">
                  {/* Score */}
                  <div className="flex-shrink-0">
                    <ScoreBadge score={app.dealScore} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900 truncate">{app.startupName}</h3>
                      <SectorBadge sector={app.sector} />
                      <StageBadge stage={app.stage} />
                    </div>
                    <div className="text-xs text-gray-400">
                      {app.founderNames} · {app.contactEmail} · {new Date(app.submittedAt).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Funding ask */}
                  <div className="text-right flex-shrink-0 hidden sm:block">
                    <div className="font-semibold text-gray-800 text-sm">
                      {app.amountRaising ? `$${(app.amountRaising / 1000).toFixed(0)}K` : "—"}
                    </div>
                    <div className="text-xs text-gray-400">{app.fundingStage || "—"}</div>
                  </div>

                  {/* Status */}
                  <div className="flex-shrink-0">
                    <select
                      value={app.status}
                      onChange={e => { e.stopPropagation(); handleStatusChange(app.id, e.target.value); }}
                      onClick={e => e.stopPropagation()}
                      className="border border-gray-200 rounded-lg px-2 py-1 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                    >
                      {STATUSES.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => setSelected(app)}
                      className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-medium transition-colors"
                    >
                      View Details →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {selected && (
        <DetailModal
          app={selected}
          onClose={() => setSelected(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}
