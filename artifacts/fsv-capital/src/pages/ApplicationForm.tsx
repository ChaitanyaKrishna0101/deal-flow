import { useState, useEffect } from "react";
import ProgressBar from "@/components/ProgressBar";
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
  { title: "Basic Information",    component: Step1 },
  { title: "Startup Overview",     component: Step2 },
  { title: "Product & Technology", component: Step3 },
  { title: "Market Opportunity",   component: Step4 },
  { title: "Traction & Metrics",   component: Step5 },
  { title: "Financials",           component: Step6 },
  { title: "Funding Requirement",  component: Step7 },
  { title: "Team",                 component: Step8 },
  { title: "Strategic Fit",        component: Step9 },
  { title: "Documents",            component: Step10 },
  { title: "Compliance",           component: Step11 },
];

type PageState = "form" | "review" | "success" | "rejected";

function validate(step: number, data: Record<string, unknown>): Record<string, string> {
  const errors: Record<string, string> = {};
  const g = (k: string) => String(data[k] || "");
  if (step === 1) {
    if (!g("startupName").trim()) errors.startupName = "Required";
    if (!g("founderNames").trim()) errors.founderNames = "Required";
    if (!g("contactEmail").trim()) errors.contactEmail = "Required";
    else if (!/\S+@\S+\.\S+/.test(g("contactEmail"))) errors.contactEmail = "Invalid email";
  }
  if (step === 2) {
    if (g("problemStatement").length < 50) errors.problemStatement = "Minimum 50 characters";
    if (g("solutionOverview").length < 50) errors.solutionOverview = "Minimum 50 characters";
    if (!g("sector")) errors.sector = "Please select a sector";
    if (!g("businessModel")) errors.businessModel = "Please select a business model";
    if (!g("stage")) errors.stage = "Please select a stage";
  }
  if (step === 3) {
    if (!g("usp").trim()) errors.usp = "Required";
  }
  if (step === 7) {
    if (!data.amountRaising) errors.amountRaising = "Required";
  }
  if (step === 9) {
    if (g("whyFSV").length < 100) errors.whyFSV = "Minimum 100 characters";
  }
  if (step === 11) {
    if (!data.consentGiven) errors.consentGiven = "You must consent to proceed";
  }
  return errors;
}

export default function ApplicationForm() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<Record<string, unknown>>(loadFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [page, setPage] = useState<PageState>("form");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [result, setResult] = useState<{ applicationId: string; score: number } | null>(null);
  const [rejectedReason, setRejectedReason] = useState("");

  useEffect(() => { saveFormData(data); }, [data]);

  const update = (key: string, value: unknown) => {
    setData(prev => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors(e => { const n = { ...e }; delete n[key]; return n; });
  };

  const goNext = () => {
    const errs = validate(step, data);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    if (step < STEPS.length) setStep(step + 1);
    else setPage("review");
    window.scrollTo(0, 0);
  };

  const goBack = () => {
    if (step > 1) { setStep(step - 1); setErrors({}); }
    window.scrollTo(0, 0);
  };

  const editSection = (s: number) => { setStep(s); setPage("form"); window.scrollTo(0, 0); };

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
      const payload = {
        ...data,
        headquarters: `${data.headquartersCity || ""} ${data.headquartersCountry || ""}`.trim(),
      };
      const res = await api.submitApplication(payload);
      setResult({ applicationId: res.applicationId, score: res.score });
      clearFormData();
      setPage("success");
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => { setData({}); setStep(1); setPage("form"); setResult(null); setErrors({}); };

  if (page === "success" && result) return <SuccessPage applicationId={result.applicationId} score={result.score} onReset={handleReset} />;
  if (page === "rejected") return <RejectedPage reason={rejectedReason} onBack={() => setPage("review")} />;
  if (page === "review") return <ReviewScreen data={data} onEdit={editSection} onSubmit={handleSubmit} submitting={submitting} error={submitError} />;

  const StepComponent = STEPS[step - 1].component;

  return (
    <div style={{ minHeight: "100vh", background: "var(--surface)", padding: "32px 16px", position: "relative" }}>
      {/* Top gold line */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, var(--gold), transparent)", opacity: 0.5, zIndex: 100 }} />

      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: "linear-gradient(135deg, #C9A84C, #A87C2A)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 12px rgba(201,168,76,0.25)",
            }}>
              <span style={{ color: "#0D0D12", fontWeight: 800, fontSize: 12, fontFamily: "'DM Serif Display'" }}>F</span>
            </div>
            <span style={{ fontFamily: "'DM Serif Display'", fontSize: 16, color: "#E8C76A" }}>FSV Capital</span>
          </div>
          <a href="/" style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, textDecoration: "none" }}>← Back to Home</a>
        </div>

        {/* Card */}
        <div style={{
          background: "var(--surface-raised)", border: "1px solid var(--border-subtle)",
          borderRadius: 20, padding: "32px",
          boxShadow: "0 24px 60px rgba(0,0,0,0.4)",
        }}>
          <ProgressBar current={step} total={STEPS.length} title={STEPS[step - 1].title} />

          <h2 style={{
            fontFamily: "'DM Serif Display'", fontSize: 24, color: "#F0E8D0",
            margin: "0 0 20px", letterSpacing: "-0.02em",
          }}>{STEPS[step - 1].title}</h2>

          <StepComponent data={data} update={update} errors={errors} />

          {/* Navigation */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            marginTop: 32, paddingTop: 24, borderTop: "1px solid var(--border-subtle)",
          }}>
            <button
              onClick={goBack}
              disabled={step === 1}
              style={{
                background: "none", border: "1px solid rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.4)", borderRadius: 10, padding: "10px 20px",
                fontSize: 13, fontWeight: 500, cursor: step === 1 ? "not-allowed" : "pointer",
                opacity: step === 1 ? 0.3 : 1, transition: "all 0.2s",
              }}
            >← Back</button>
            <button
              onClick={goNext}
              style={{
                background: "linear-gradient(135deg, #C9A84C, #A87C2A)",
                color: "#0D0D12", border: "none", borderRadius: 10, padding: "10px 24px",
                fontSize: 13, fontWeight: 700, cursor: "pointer",
                boxShadow: "0 0 20px rgba(201,168,76,0.25)",
                transition: "all 0.25s",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 0 30px rgba(201,168,76,0.35)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 0 20px rgba(201,168,76,0.25)"; }}
            >
              {step === STEPS.length ? "Review Application →" : "Next →"}
            </button>
          </div>
        </div>

        <p style={{ textAlign: "center", color: "rgba(255,255,255,0.2)", fontSize: 11, marginTop: 12, fontFamily: "'DM Mono'" }}>
          Auto-saved · Refresh-safe · Step {step}/{STEPS.length}
        </p>
      </div>
    </div>
  );
}
