import { useState, useEffect, useRef } from "react";
import Step1 from "./form/Step1";
import Step2 from "./form/Step2";
import Step3 from "./form/Step3";
import Step4 from "./form/Step4";
import Step5 from "./form/Step5";
import Step6 from "./form/Step6";
import Step7 from "./form/Step7";
import Step8 from "./form/Step8";
import Step9 from "./form/Step9";
import Step10 from "./form/Step10";
import Step11 from "./form/Step11";
import ReviewScreen from "./ReviewScreen";
import { saveFormData, loadFormData, clearFormData } from "@/lib/storage";
import { screenApplication } from "@/lib/screening";
import { api } from "@/lib/api";
import SuccessPage from "./SuccessPage";
import RejectedPage from "./RejectedPage";

const STEPS = [
  { title: "Basic Information",    desc: "Company name, founders & contact",   component: Step1,  group: "Foundation" },
  { title: "Startup Overview",     desc: "Problem, solution, sector & stage",   component: Step2,  group: "Foundation" },
  { title: "Product & Technology", desc: "Core product, tech stack & USP",      component: Step3,  group: "Foundation" },
  { title: "Market Opportunity",   desc: "TAM, SAM, SOM & competition",         component: Step4,  group: "Market" },
  { title: "Traction & Metrics",   desc: "Revenue, customers & growth rate",    component: Step5,  group: "Market" },
  { title: "Financials",           desc: "Revenue, burn rate & runway",         component: Step6,  group: "Market" },
  { title: "Funding Requirement",  desc: "Amount, equity & use of funds",       component: Step7,  group: "Funding & Team" },
  { title: "Team",                 desc: "Founders, core team & advisors",      component: Step8,  group: "Funding & Team" },
  { title: "Strategic Fit",        desc: "Why FSV & the value you need",        component: Step9,  group: "Funding & Team" },
  { title: "Documents",            desc: "Pitch deck & supporting materials",   component: Step10, group: "Final" },
  { title: "Compliance",           desc: "Legal status & consent declaration",  component: Step11, group: "Final" },
];

const GROUPS = ["Foundation", "Market", "Funding & Team", "Final"];
const GROUP_RANGE: Record<string, [number, number]> = {
  "Foundation":    [1, 3],
  "Market":        [4, 6],
  "Funding & Team":[7, 9],
  "Final":         [10, 11],
};

type PageState = "form" | "review" | "success" | "rejected";

function validate(step: number, data: Record<string, unknown>): Record<string, string> {
  const errors: Record<string, string> = {};
  const g = (k: string) => String(data[k] || "");
  if (step === 1) {
    if (!g("startupName").trim())  errors.startupName  = "Required";
    if (!g("founderNames").trim()) errors.founderNames = "Required";
    if (!g("contactEmail").trim()) errors.contactEmail = "Required";
    else if (!/\S+@\S+\.\S+/.test(g("contactEmail"))) errors.contactEmail = "Invalid email";
  }
  if (step === 2) {
    if (g("problemStatement").length < 50) errors.problemStatement = "Minimum 50 characters";
    if (g("solutionOverview").length  < 50) errors.solutionOverview  = "Minimum 50 characters";
    if (!g("sector"))        errors.sector        = "Please select a sector";
    if (!g("businessModel")) errors.businessModel = "Please select a model";
    if (!g("stage"))         errors.stage         = "Please select a stage";
  }
  if (step === 3)  { if (!g("usp").trim()) errors.usp = "Required"; }
  if (step === 7)  { if (!data.amountRaising) errors.amountRaising = "Required"; }
  if (step === 9)  { if (g("whyFSV").length < 100) errors.whyFSV = "Minimum 100 characters"; }
  if (step === 11) { if (!data.consentGiven) errors.consentGiven = "You must consent to proceed"; }
  return errors;
}

function loadMaxReached(): number {
  try { return parseInt(localStorage.getItem("fsv_max_step") || "1", 10) || 1; } catch { return 1; }
}

export default function ApplicationForm() {
  const [step, setStep]             = useState(1);
  const [maxReached, setMaxReached] = useState<number>(loadMaxReached);
  const [data, setData]             = useState<Record<string, unknown>>(loadFormData);
  const [errors, setErrors]         = useState<Record<string, string>>({});
  const [page, setPage]             = useState<PageState>("form");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [result, setResult]         = useState<{ applicationId: string; score: number } | null>(null);
  const [rejectedReason, setRejectedReason] = useState("");

  // Animation state
  const [animDir, setAnimDir]       = useState<"forward" | "back">("forward");
  const [animKey, setAnimKey]       = useState(0);
  const [sweepKey, setSweepKey]     = useState(0);

  // Locked-step shake
  const [shakingStep, setShakingStep] = useState<number | null>(null);

  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => { saveFormData(data); }, [data]);
  useEffect(() => { localStorage.setItem("fsv_max_step", String(maxReached)); }, [maxReached]);

  const update = (key: string, value: unknown) => {
    setData(prev => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors(e => { const n = { ...e }; delete n[key]; return n; });
  };

  const navigateTo = (newStep: number, dir: "forward" | "back") => {
    setAnimDir(dir);
    setAnimKey(k => k + 1);
    setSweepKey(k => k + 1);
    setStep(newStep);
    contentRef.current?.scrollTo(0, 0);
  };

  const goNext = () => {
    const errs = validate(step, data);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    if (step < STEPS.length) {
      const next = step + 1;
      setMaxReached(prev => Math.max(prev, next));
      navigateTo(next, "forward");
    } else {
      setPage("review");
    }
  };

  const goBack = () => {
    if (step > 1) { setErrors({}); navigateTo(step - 1, "back"); }
  };

  const handleSidebarClick = (n: number) => {
    if (n === step) return;
    if (n > maxReached) {
      // Locked — shake it
      setShakingStep(n);
      setTimeout(() => setShakingStep(null), 350);
      return;
    }
    navigateTo(n, n < step ? "back" : "forward");
  };

  const editSection = (s: number) => { setStep(s); setPage("form"); };

  const handleSubmit = async () => {
    const screen = screenApplication(data);
    if (!screen.passed) {
      setRejectedReason(screen.reason || "Application did not meet our criteria.");
      setPage("rejected");
      return;
    }
    setSubmitting(true);
    setSubmitError("");
    try {
      const payload = { ...data, headquarters: `${data.headquartersCity || ""} ${data.headquartersCountry || ""}`.trim() };
      const res = await api.submitApplication(payload);
      setResult({ applicationId: res.applicationId, score: res.score });
      clearFormData();
      localStorage.removeItem("fsv_max_step");
      setPage("success");
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setData({}); setStep(1); setMaxReached(1); setPage("form"); setResult(null); setErrors({});
    localStorage.removeItem("fsv_max_step");
  };

  if (page === "success" && result) return <SuccessPage applicationId={result.applicationId} score={result.score} onReset={handleReset} />;
  if (page === "rejected") return <RejectedPage reason={rejectedReason} onBack={() => setPage("review")} />;
  if (page === "review") return <ReviewScreen data={data} onEdit={editSection} onSubmit={handleSubmit} submitting={submitting} error={submitError} />;

  const StepComponent = STEPS[step - 1].component;
  const overallPct = Math.round((step / STEPS.length) * 100);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--surface)", fontFamily: "Inter, sans-serif", position: "relative" }}>

      {/* ── Left Sidebar ── */}
      <aside style={{
        width: 260, flexShrink: 0,
        background: "var(--surface-raised)",
        borderRight: "1px solid var(--border-subtle)",
        display: "flex", flexDirection: "column",
        position: "sticky", top: 0, height: "100vh", overflowY: "auto",
      }}>
        {/* Logo */}
        <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid var(--border-subtle)" }}>
          <a href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 9 }}>
            <div style={{
              width: 30, height: 30, borderRadius: 7,
              background: "linear-gradient(135deg, #C9A84C, #A87C2A)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 12px rgba(201,168,76,0.2)",
            }}>
              <span style={{ color: "#0D0D12", fontWeight: 800, fontSize: 11, fontFamily: "'DM Serif Display'" }}>F</span>
            </div>
            <span style={{ fontFamily: "'DM Serif Display'", fontSize: 15, color: "#E8C76A" }}>FSV Capital</span>
          </a>
          {/* Overall progress */}
          <div style={{ marginTop: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Progress</span>
              <span style={{ fontFamily: "'DM Mono'", fontSize: 10, color: "var(--gold)" }}>{overallPct}%</span>
            </div>
            <div style={{ height: 3, background: "rgba(255,255,255,0.05)", borderRadius: 2 }}>
              <div style={{
                height: "100%", borderRadius: 2,
                width: `${overallPct}%`,
                background: "linear-gradient(90deg, #A87C2A, #E8C76A)",
                boxShadow: "0 0 6px rgba(201,168,76,0.4)",
                transition: "width 0.4s ease",
              }} />
            </div>
          </div>
        </div>

        {/* Step groups */}
        <div style={{ padding: "12px 0 20px", flex: 1 }}>
          {GROUPS.map(group => {
            const [lo, hi] = GROUP_RANGE[group];
            const groupSteps = STEPS.slice(lo - 1, hi);
            const groupDone  = groupSteps.every((_, i) => lo + i <= maxReached);
            const groupActive = step >= lo && step <= hi;

            return (
              <div key={group} style={{ marginBottom: 4 }}>
                {/* Group label */}
                <div style={{
                  padding: "8px 20px 4px",
                  display: "flex", alignItems: "center", gap: 6,
                }}>
                  <div style={{
                    height: 1, flex: 1,
                    background: groupActive ? "linear-gradient(90deg, var(--gold), transparent)" : "rgba(255,255,255,0.04)",
                  }} />
                  <span style={{
                    fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                    color: groupDone ? "#4ADE80" : groupActive ? "var(--gold)" : "rgba(255,255,255,0.2)",
                    flexShrink: 0,
                  }}>{group}</span>
                  <div style={{
                    height: 1, flex: 1,
                    background: "rgba(255,255,255,0.04)",
                  }} />
                </div>

                {/* Steps in this group */}
                <div style={{ position: "relative" }}>
                  {/* Vertical connector line */}
                  <div style={{
                    position: "absolute", left: 31, top: 8, bottom: 8,
                    width: 1,
                    background: "rgba(255,255,255,0.05)",
                    zIndex: 0,
                  }} />

                  {groupSteps.map((s, i) => {
                    const n = lo + i;
                    const isCurrent   = n === step;
                    const isCompleted = n < step;
                    const isLocked    = n > maxReached;
                    const isShaking   = n === shakingStep;

                    return (
                      <button
                        key={n}
                        onClick={() => handleSidebarClick(n)}
                        className={isShaking ? "shake" : ""}
                        style={{
                          display: "flex", alignItems: "flex-start", gap: 10,
                          width: "100%", padding: "8px 20px 8px 20px",
                          background: isCurrent ? "rgba(201,168,76,0.07)" : "none",
                          border: "none",
                          borderLeft: isCurrent ? "2px solid var(--gold)" : "2px solid transparent",
                          cursor: isLocked ? "not-allowed" : "pointer",
                          transition: "background 0.2s",
                          position: "relative", zIndex: 1,
                          textAlign: "left",
                        }}
                      >
                        {/* Circle */}
                        <div style={{
                          width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 9, fontWeight: 700, fontFamily: "'DM Mono'",
                          marginTop: 1,
                          background: isCompleted
                            ? "rgba(74,222,128,0.15)"
                            : isCurrent
                              ? "rgba(201,168,76,0.2)"
                              : "rgba(255,255,255,0.04)",
                          border: `1.5px solid ${
                            isCompleted ? "#4ADE80"
                            : isCurrent ? "var(--gold)"
                            : "rgba(255,255,255,0.08)"
                          }`,
                          color: isCompleted ? "#4ADE80" : isCurrent ? "var(--gold)" : "rgba(255,255,255,0.2)",
                          boxShadow: isCurrent ? "0 0 8px rgba(201,168,76,0.3)" : "none",
                          transition: "all 0.3s",
                        }}>
                          {isCompleted ? "✓" : isLocked ? "🔒".slice(0, 1) : n}
                        </div>

                        {/* Text */}
                        <div style={{ minWidth: 0 }}>
                          <div style={{
                            fontSize: 12, fontWeight: isCurrent ? 600 : 400,
                            color: isCompleted
                              ? "rgba(74,222,128,0.8)"
                              : isCurrent
                                ? "#E8C76A"
                                : isLocked
                                  ? "rgba(255,255,255,0.15)"
                                  : "rgba(255,255,255,0.45)",
                            lineHeight: 1.3,
                            transition: "color 0.3s",
                          }}>
                            {s.title}
                          </div>
                          <div style={{
                            fontSize: 10, color: isLocked ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.2)",
                            marginTop: 2, lineHeight: 1.4,
                          }}>
                            {s.desc}
                          </div>
                        </div>

                        {/* Lock icon for locked steps */}
                        {isLocked && (
                          <div style={{ marginLeft: "auto", flexShrink: 0, fontSize: 9, color: "rgba(255,255,255,0.12)" }}>⚿</div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{ padding: "12px 20px", borderTop: "1px solid var(--border-subtle)" }}>
          <p style={{ fontFamily: "'DM Mono'", fontSize: 9, color: "rgba(255,255,255,0.15)", margin: 0, lineHeight: 1.6 }}>
            Auto-saved · Step {step} of {STEPS.length}<br />
            Refresh-safe
          </p>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh", overflow: "hidden" }}>

        {/* Top bar */}
        <div style={{
          padding: "14px 36px", display: "flex", alignItems: "center", justifyContent: "space-between",
          borderBottom: "1px solid var(--border-subtle)",
          background: "rgba(11,11,15,0.6)", backdropFilter: "blur(12px)",
          position: "sticky", top: 0, zIndex: 30,
        }}>
          {/* Step breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 12 }}>
              {STEPS[step - 1].group}
            </span>
            <span style={{ color: "rgba(255,255,255,0.15)", fontSize: 12 }}>›</span>
            <span style={{ color: "var(--gold)", fontSize: 12, fontWeight: 500 }}>
              {STEPS[step - 1].title}
            </span>
          </div>
          <a href="/" style={{ color: "rgba(255,255,255,0.25)", fontSize: 12, textDecoration: "none" }}>← Home</a>
        </div>

        {/* Gold sweep line — plays on each step change */}
        <div key={`sweep-${sweepKey}`} style={{ height: 2, position: "relative", overflow: "hidden" }}>
          <div
            className="gold-sweep"
            style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(90deg, transparent, var(--gold), var(--gold-light), var(--gold), transparent)",
            }}
          />
        </div>

        {/* Content scroll area */}
        <div ref={contentRef} style={{ flex: 1, overflowY: "auto", padding: "40px 48px 60px" }}>
          <div
            key={animKey}
            className={animDir === "forward" ? "step-enter-forward" : "step-enter-back"}
          >
            {/* Step header */}
            <div style={{ marginBottom: 32 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                {/* Large step number */}
                <div style={{
                  width: 44, height: 44, borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: "rgba(201,168,76,0.1)", border: "1.5px solid var(--border-gold)",
                  fontFamily: "'DM Mono'", fontSize: 16, fontWeight: 500, color: "var(--gold)",
                  boxShadow: "0 0 16px rgba(201,168,76,0.15)",
                }}>
                  {step}
                </div>
                <div>
                  <h2 style={{
                    fontFamily: "'DM Serif Display'", fontSize: 28, color: "#F0E8D0",
                    margin: 0, letterSpacing: "-0.02em", lineHeight: 1.1,
                  }}>
                    {STEPS[step - 1].title}
                  </h2>
                  <p style={{ color: "rgba(240,232,208,0.35)", fontSize: 13, margin: "4px 0 0" }}>
                    {STEPS[step - 1].desc}
                  </p>
                </div>
              </div>

              {/* Mini step trail */}
              <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 16 }}>
                {STEPS.map((_, i) => {
                  const n = i + 1;
                  const done = n < step;
                  const curr = n === step;
                  return (
                    <div key={n} style={{
                      height: 3, flex: curr ? 2 : 1,
                      borderRadius: 2,
                      background: done
                        ? "#4ADE80"
                        : curr
                          ? "linear-gradient(90deg, #C9A84C, #E8C76A)"
                          : "rgba(255,255,255,0.06)",
                      boxShadow: curr ? "0 0 6px rgba(201,168,76,0.5)" : done ? "0 0 4px rgba(74,222,128,0.3)" : "none",
                      transition: "all 0.4s ease",
                    }} />
                  );
                })}
              </div>
            </div>

            {/* Form step */}
            <StepComponent data={data} update={update} errors={errors} />

            {/* Navigation */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              marginTop: 40, paddingTop: 24, borderTop: "1px solid var(--border-subtle)",
            }}>
              <button
                onClick={goBack}
                disabled={step === 1}
                style={{
                  background: "none",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: step === 1 ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.45)",
                  borderRadius: 10, padding: "11px 22px",
                  fontSize: 13, fontWeight: 500,
                  cursor: step === 1 ? "not-allowed" : "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={e => { if (step > 1) e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
              >
                ← Back
              </button>

              {/* Step indicator in middle */}
              <span style={{ fontFamily: "'DM Mono'", fontSize: 11, color: "rgba(255,255,255,0.2)" }}>
                {step} / {STEPS.length}
              </span>

              <button
                onClick={goNext}
                style={{
                  background: "linear-gradient(135deg, #C9A84C, #A87C2A)",
                  color: "#0D0D12", border: "none", borderRadius: 10, padding: "11px 28px",
                  fontSize: 13, fontWeight: 700, cursor: "pointer",
                  boxShadow: "0 0 20px rgba(201,168,76,0.22)",
                  transition: "all 0.22s",
                  letterSpacing: "0.01em",
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 0 30px rgba(201,168,76,0.35)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 0 20px rgba(201,168,76,0.22)"; }}
              >
                {step === STEPS.length ? "Review Application →" : "Next →"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
