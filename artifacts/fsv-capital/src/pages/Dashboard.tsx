import { useState, useEffect, useCallback } from "react";
import { api, type Application, type DashboardStats, type AiAnalysis } from "@/lib/api";

const STATUSES = ["Under Review", "Shortlisted", "Rejected", "Funded"];

const SECTOR_COLORS: Record<string, { bg: string; text: string }> = {
  "Fintech":    { bg: "rgba(99,102,241,0.15)",  text: "#818CF8" },
  "AI/ML":      { bg: "rgba(167,139,250,0.15)", text: "#A78BFA" },
  "Blockchain": { bg: "rgba(251,146,60,0.15)",  text: "#FB923C" },
  "DeepTech":   { bg: "rgba(34,211,238,0.15)",  text: "#22D3EE" },
  "SaaS":       { bg: "rgba(74,222,128,0.15)",  text: "#4ADE80" },
};

const STAGE_COLORS: Record<string, { bg: string; text: string }> = {
  "Idea":          { bg: "rgba(255,255,255,0.06)", text: "rgba(255,255,255,0.4)" },
  "MVP":           { bg: "rgba(59,130,246,0.15)",  text: "#60A5FA" },
  "Early Revenue": { bg: "rgba(74,222,128,0.15)",  text: "#4ADE80" },
  "Growth Stage":  { bg: "rgba(20,184,166,0.15)",  text: "#2DD4BF" },
  "Scaling":       { bg: "rgba(167,139,250,0.15)", text: "#C084FC" },
};

function ScoreRing({ score }: { score?: number }) {
  if (score === undefined) return <div style={{ width: 56, height: 56 }} />;
  const pct = score / 100;
  const r = 22;
  const circ = 2 * Math.PI * r;
  const dash = pct * circ;
  const color = score >= 65 ? "#4ADE80" : score >= 40 ? "#F59E0B" : "#F87171";
  const glowColor = score >= 65 ? "rgba(74,222,128,0.4)" : score >= 40 ? "rgba(245,158,11,0.4)" : "rgba(248,113,113,0.4)";

  return (
    <div style={{ position: "relative", width: 56, height: 56, flexShrink: 0 }}>
      <svg width="56" height="56" viewBox="0 0 56 56" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="28" cy="28" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
        <circle
          cx="28" cy="28" r={r} fill="none"
          stroke={color} strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circ - dash}`}
          style={{ filter: `drop-shadow(0 0 4px ${glowColor})`, transition: "stroke-dasharray 0.8s ease" }}
        />
      </svg>
      <div style={{
        position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'DM Mono'", fontSize: 12, fontWeight: 500, color,
      }}>
        {score}
      </div>
    </div>
  );
}

function Badge({ label, colors }: { label: string; colors?: { bg: string; text: string } }) {
  const c = colors || { bg: "rgba(255,255,255,0.07)", text: "rgba(255,255,255,0.45)" };
  return (
    <span style={{
      background: c.bg, color: c.text,
      borderRadius: 100, padding: "3px 10px", fontSize: 11, fontWeight: 500,
      border: `1px solid ${c.text}22`,
    }}>{label}</span>
  );
}

function StatusSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const colors: Record<string, string> = {
    "Under Review": "#60A5FA",
    "Shortlisted":  "#4ADE80",
    "Rejected":     "#F87171",
    "Funded":       "#C9A84C",
  };
  return (
    <select
      value={value}
      onChange={e => { e.stopPropagation(); onChange(e.target.value); }}
      onClick={e => e.stopPropagation()}
      style={{
        background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 8, padding: "5px 10px", fontSize: 12, cursor: "pointer",
        color: colors[value] || "rgba(255,255,255,0.6)", outline: "none",
        appearance: "auto",
      }}
    >
      {STATUSES.map(s => <option key={s} value={s} style={{ background: "#131318", color: "#F0E8D0" }}>{s}</option>)}
    </select>
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
    } catch {
      alert("AI analysis failed. Check that GEMINI_API_KEY is set.");
    } finally {
      setAnalyzing(false);
    }
  };

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div style={{ marginBottom: 20 }}>
      <div style={{
        fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase",
        color: "var(--gold)", opacity: 0.7, marginBottom: 10,
        borderBottom: "1px solid rgba(201,168,76,0.1)", paddingBottom: 6,
      }}>{title}</div>
      {children}
    </div>
  );

  const Row = ({ label, value }: { label: string; value?: unknown }) => (
    <div style={{ display: "flex", gap: 8, marginBottom: 6 }}>
      <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, minWidth: 120, flexShrink: 0 }}>{label}</span>
      <span style={{ color: "rgba(240,232,208,0.8)", fontSize: 12 }}>
        {value !== undefined && value !== null && value !== "" ? String(value) : "—"}
      </span>
    </div>
  );

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 50,
      display: "flex", alignItems: "flex-start", justifyContent: "center",
      padding: "32px 16px", overflowY: "auto", backdropFilter: "blur(4px)",
    }}>
      <div style={{
        background: "var(--surface-raised)", border: "1px solid var(--border-gold)",
        borderRadius: 20, width: "100%", maxWidth: 760,
        boxShadow: "0 0 60px rgba(201,168,76,0.1), 0 24px 80px rgba(0,0,0,0.6)",
      }}>
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "20px 24px", borderBottom: "1px solid var(--border-subtle)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <ScoreRing score={app.dealScore} />
            <div>
              <h3 style={{ fontFamily: "'DM Serif Display'", fontSize: 22, color: "#F0E8D0", margin: 0 }}>{app.startupName}</h3>
              <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
                <Badge label={app.sector} colors={SECTOR_COLORS[app.sector]} />
                <Badge label={app.stage} colors={STAGE_COLORS[app.stage]} />
                <span style={{ fontFamily: "'DM Mono'", fontSize: 11, color: "rgba(255,255,255,0.25)", alignSelf: "center" }}>{app.applicationId}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{
            background: "none", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)",
            width: 32, height: 32, borderRadius: 8, cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center",
          }}>×</button>
        </div>

        <div style={{ padding: "24px", overflowY: "auto", maxHeight: "70vh" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <div>
              <Section title="Basics">
                <Row label="Founders" value={app.founderNames} />
                <Row label="Email" value={app.contactEmail} />
                <Row label="HQ" value={app.headquarters} />
                <Row label="Website" value={app.websiteUrl} />
              </Section>
              <Section title="Business">
                <Row label="Model" value={app.businessModel} />
                <Row label="Problem" value={app.problemStatement?.slice(0, 140) + "..."} />
                <Row label="USP" value={app.usp?.slice(0, 120)} />
              </Section>
              <Section title="Market">
                <Row label="TAM" value={app.tam} />
                <Row label="SAM" value={app.sam} />
                <Row label="SOM" value={app.som} />
              </Section>
              <Section title="Traction">
                <Row label="Monthly Revenue" value={app.monthlyRevenue ? `$${app.monthlyRevenue.toLocaleString()}` : undefined} />
                <Row label="Growth Rate" value={app.growthRate ? `${app.growthRate}% MoM` : undefined} />
                <Row label="Customers" value={app.customerCount?.toLocaleString()} />
              </Section>
            </div>
            <div>
              <Section title="Funding Ask">
                <Row label="Amount" value={app.amountRaising ? `$${app.amountRaising.toLocaleString()} ${app.currency}` : undefined} />
                <Row label="Stage" value={app.fundingStage} />
                <Row label="Equity" value={app.equityOffered ? `${app.equityOffered}%` : undefined} />
                <Row label="Use of Funds" value={app.useOfFunds?.join(", ")} />
              </Section>
              <Section title="Team">
                <Row label="Size" value={app.teamSize} />
                <Row label="Experience" value={app.founderExperience?.slice(0, 140)} />
              </Section>

              {app.scoreBreakdown && (
                <Section title="Score Breakdown">
                  {[
                    { label: "Market Size",    val: app.scoreBreakdown.marketSize,    max: 25 },
                    { label: "Revenue Stage",  val: app.scoreBreakdown.revenueStage,  max: 25 },
                    { label: "Team Strength",  val: app.scoreBreakdown.teamStrength,  max: 20 },
                    { label: "Traction",       val: app.scoreBreakdown.traction,      max: 20 },
                    { label: "Innovation",     val: app.scoreBreakdown.innovation,    max: 10 },
                  ].map(item => {
                    const pct = (item.val / item.max) * 100;
                    const barColor = pct >= 70 ? "#4ADE80" : pct >= 40 ? "#F59E0B" : "#F87171";
                    return (
                      <div key={item.label} style={{ marginBottom: 8 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{item.label}</span>
                          <span style={{ fontFamily: "'DM Mono'", fontSize: 11, color: barColor }}>{item.val}/{item.max}</span>
                        </div>
                        <div style={{ height: 4, background: "rgba(255,255,255,0.05)", borderRadius: 2, overflow: "hidden" }}>
                          <div style={{
                            height: "100%", width: `${pct}%`, background: barColor,
                            borderRadius: 2, boxShadow: `0 0 6px ${barColor}88`,
                            transition: "width 0.6s ease",
                          }} />
                        </div>
                      </div>
                    );
                  })}
                </Section>
              )}

              <Section title="Status">
                <StatusSelect value={app.status} onChange={v => onStatusChange(app.id, v)} />
              </Section>

              {app.demoLink && (
                <Section title="Links">
                  <a href={app.demoLink} target="_blank" rel="noopener noreferrer"
                    style={{ color: "var(--gold)", fontSize: 13, textDecoration: "none" }}>
                    Demo →
                  </a>
                </Section>
              )}
            </div>
          </div>

          {/* AI Analysis */}
          <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--border-subtle)" }}>
            {!analysis ? (
              <button
                onClick={runAnalysis}
                disabled={analyzing}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.25)",
                  color: "#A78BFA", borderRadius: 10, padding: "10px 16px", fontSize: 13, fontWeight: 500,
                  cursor: analyzing ? "wait" : "pointer", transition: "all 0.2s",
                }}
              >
                <span>✦</span>
                {analyzing ? "Analyzing with Gemini AI..." : "Run Gemini AI Analysis"}
              </button>
            ) : (
              <div style={{ background: "rgba(167,139,250,0.06)", border: "1px solid rgba(167,139,250,0.2)", borderRadius: 12, padding: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <span style={{ color: "#A78BFA" }}>✦</span>
                  <span style={{ color: "#A78BFA", fontSize: 13, fontWeight: 600 }}>Gemini AI Analysis</span>
                </div>
                <p style={{ color: "rgba(240,232,208,0.75)", fontSize: 13, lineHeight: 1.7, marginBottom: 12 }}>{analysis.analysis}</p>
                {analysis.strengths.length > 0 && (
                  <div style={{ marginBottom: 10 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: "#4ADE80", marginBottom: 6, textTransform: "uppercase" }}>Strengths</div>
                    {analysis.strengths.map((s, i) => (
                      <div key={i} style={{ display: "flex", gap: 8, fontSize: 12, color: "rgba(240,232,208,0.65)", marginBottom: 4 }}>
                        <span style={{ color: "#4ADE80", flexShrink: 0 }}>✓</span>{s}
                      </div>
                    ))}
                  </div>
                )}
                {analysis.concerns.length > 0 && (
                  <div style={{ marginBottom: 10 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: "#F59E0B", marginBottom: 6, textTransform: "uppercase" }}>Concerns</div>
                    {analysis.concerns.map((c, i) => (
                      <div key={i} style={{ display: "flex", gap: 8, fontSize: 12, color: "rgba(240,232,208,0.65)", marginBottom: 4 }}>
                        <span style={{ color: "#F59E0B", flexShrink: 0 }}>!</span>{c}
                      </div>
                    ))}
                  </div>
                )}
                {analysis.recommendation && (
                  <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: "10px 12px", marginTop: 8 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: "#A78BFA", marginBottom: 4, textTransform: "uppercase" }}>Recommendation</div>
                    <div style={{ fontSize: 12, color: "rgba(240,232,208,0.7)" }}>{analysis.recommendation}</div>
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
        api.listApplications(Object.fromEntries(Object.entries(filters).filter(([, v]) => v))),
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
    } catch {
      alert("Failed to update status");
    }
  };

  const SECTORS = ["Fintech", "AI/ML", "Blockchain", "DeepTech", "SaaS", "HealthTech", "EdTech", "Other"];
  const STAGES  = ["Idea", "MVP", "Early Revenue", "Growth Stage", "Scaling"];

  const selectStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
    color: "rgba(240,232,208,0.7)", borderRadius: 8, padding: "8px 12px", fontSize: 13,
    outline: "none", cursor: "pointer",
  };

  const statItems = stats ? [
    { label: "Total Applications", value: stats.total,        mono: true },
    { label: "Average Score",      value: `${stats.averageScore}/100`, mono: true },
    { label: "Shortlisted",        value: stats.shortlisted,  mono: true },
    { label: "This Month",         value: stats.thisMonth,    mono: true },
  ] : [];

  return (
    <div style={{ minHeight: "100vh", background: "var(--surface)", position: "relative" }}>

      {/* Subtle top glow */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, height: 1,
        background: "linear-gradient(90deg, transparent, var(--gold), transparent)",
        opacity: 0.4, zIndex: 100,
      }} />

      {/* Header */}
      <header style={{
        background: "rgba(13,13,18,0.9)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--border-subtle)", padding: "14px 28px",
        position: "sticky", top: 0, zIndex: 40,
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 8,
              background: "linear-gradient(135deg, #C9A84C, #A87C2A)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 16px rgba(201,168,76,0.25)",
            }}>
              <span style={{ color: "#0D0D12", fontWeight: 800, fontSize: 13, fontFamily: "'DM Serif Display'" }}>F</span>
            </div>
            <div>
              <h1 style={{ fontFamily: "'DM Serif Display'", fontSize: 17, color: "#E8C76A", margin: 0, letterSpacing: "-0.01em" }}>
                FSV Capital
              </h1>
              <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 11, margin: 0 }}>Deal Pipeline · Investor View</p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <a href="/apply" style={{
              color: "var(--gold)", fontSize: 13, fontWeight: 500, textDecoration: "none",
              border: "1px solid var(--border-gold)", padding: "7px 14px", borderRadius: 8,
              background: "var(--gold-dim)",
            }}>+ New Application</a>
            <a href={api.exportCsvUrl()} download style={{
              color: "rgba(255,255,255,0.5)", fontSize: 13, textDecoration: "none",
              border: "1px solid rgba(255,255,255,0.08)", padding: "7px 14px", borderRadius: 8,
              background: "rgba(255,255,255,0.03)",
            }}>Export CSV</a>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "28px 28px" }}>

        {/* Stats */}
        {stats && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
            {statItems.map((s, i) => (
              <div key={i} style={{
                background: "var(--surface-raised)", border: "1px solid var(--border-subtle)",
                borderRadius: 14, padding: "20px 22px",
              }}>
                <div style={{
                  fontFamily: "'DM Mono'", fontSize: 30, fontWeight: 500,
                  color: i === 1 ? "var(--gold-light)" : "#F0E8D0",
                  lineHeight: 1, marginBottom: 6,
                }}>{s.value}</div>
                <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, letterSpacing: "0.04em", textTransform: "uppercase" }}>{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Filters */}
        <div style={{
          background: "var(--surface-raised)", border: "1px solid var(--border-subtle)",
          borderRadius: 12, padding: "14px 18px", marginBottom: 18,
          display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap",
        }}>
          <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", marginRight: 4 }}>Filter</span>
          <select value={filters.sector} onChange={e => setFilters(f => ({ ...f, sector: e.target.value }))} style={selectStyle}>
            <option value="">All Sectors</option>
            {SECTORS.map(s => <option key={s} value={s} style={{ background: "#131318" }}>{s}</option>)}
          </select>
          <select value={filters.stage} onChange={e => setFilters(f => ({ ...f, stage: e.target.value }))} style={selectStyle}>
            <option value="">All Stages</option>
            {STAGES.map(s => <option key={s} value={s} style={{ background: "#131318" }}>{s}</option>)}
          </select>
          <select value={filters.sortBy} onChange={e => setFilters(f => ({ ...f, sortBy: e.target.value }))} style={selectStyle}>
            <option value="score">Sort by Score</option>
            <option value="date">Sort by Date</option>
            <option value="funding">Sort by Funding Ask</option>
          </select>
          <span style={{ marginLeft: "auto", fontFamily: "'DM Mono'", fontSize: 12, color: "rgba(255,255,255,0.25)" }}>
            {apps.length} deal{apps.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Deal list */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "rgba(255,255,255,0.2)", fontFamily: "'DM Mono'", fontSize: 13 }}>
            Loading pipeline...
          </div>
        ) : apps.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.3 }}>◎</div>
            <div style={{ color: "rgba(255,255,255,0.4)", fontWeight: 500 }}>No applications yet</div>
            <a href="/apply" style={{ color: "var(--gold)", fontSize: 13, display: "block", marginTop: 8, textDecoration: "none" }}>Submit the first one →</a>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {apps.map((app) => (
              <div
                key={app.id}
                style={{
                  background: "var(--surface-raised)", border: "1px solid var(--border-subtle)",
                  borderRadius: 14, padding: "16px 20px", cursor: "pointer",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = "var(--border-gold)";
                  e.currentTarget.style.boxShadow = "0 0 20px rgba(201,168,76,0.06)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = "var(--border-subtle)";
                  e.currentTarget.style.boxShadow = "none";
                }}
                onClick={() => setSelected(app)}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <ScoreRing score={app.dealScore} />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5, flexWrap: "wrap" }}>
                      <h3 style={{ fontFamily: "'DM Serif Display'", fontSize: 17, color: "#F0E8D0", margin: 0 }}>{app.startupName}</h3>
                      <Badge label={app.sector} colors={SECTOR_COLORS[app.sector]} />
                      <Badge label={app.stage} colors={STAGE_COLORS[app.stage]} />
                    </div>
                    <div style={{ fontFamily: "'DM Mono'", fontSize: 11, color: "rgba(255,255,255,0.25)" }}>
                      {app.founderNames} · {app.contactEmail} · {new Date(app.submittedAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontFamily: "'DM Mono'", fontWeight: 500, color: "var(--gold-light)", fontSize: 15 }}>
                      {app.amountRaising ? `$${(app.amountRaising / 1000).toFixed(0)}K` : "—"}
                    </div>
                    <div style={{ color: "rgba(255,255,255,0.25)", fontSize: 11, marginTop: 2 }}>{app.fundingStage || "—"}</div>
                  </div>

                  <div onClick={e => e.stopPropagation()}>
                    <StatusSelect value={app.status} onChange={v => handleStatusChange(app.id, v)} />
                  </div>

                  <button
                    onClick={e => { e.stopPropagation(); setSelected(app); }}
                    style={{
                      background: "var(--gold-dim)", border: "1px solid var(--border-gold)",
                      color: "var(--gold)", borderRadius: 8, padding: "7px 14px",
                      fontSize: 12, fontWeight: 500, cursor: "pointer", flexShrink: 0,
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = "rgba(201,168,76,0.25)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "var(--gold-dim)")}
                  >
                    View →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {selected && (
        <DetailModal app={selected} onClose={() => setSelected(null)} onStatusChange={handleStatusChange} />
      )}
    </div>
  );
}
