// Multi-step form wrapper — orchestrates 11 steps + review + submission

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
  { title: "Basic Information", component: Step1 },
  { title: "Startup Overview", component: Step2 },
  { title: "Product & Technology", component: Step3 },
  { title: "Market Opportunity", component: Step4 },
  { title: "Traction & Metrics", component: Step5 },
  { title: "Financials", component: Step6 },
  { title: "Funding Requirement", component: Step7 },
  { title: "Team", component: Step8 },
  { title: "Strategic Fit", component: Step9 },
  { title: "Documents", component: Step10 },
  { title: "Compliance", component: Step11 },
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
    if (g("problemStatement").length < 50) errors.problemStatement = "Minimum 50 characters required";
    if (g("solutionOverview").length < 50) errors.solutionOverview = "Minimum 50 characters required";
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
    if (g("whyFSV").length < 100) errors.whyFSV = "Minimum 100 characters required";
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

  // Save to localStorage on every change
  useEffect(() => {
    saveFormData(data);
  }, [data]);

  const update = (key: string, value: unknown) => {
    setData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((e) => { const n = { ...e }; delete n[key]; return n; });
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

  const handleReset = () => {
    setData({});
    setStep(1);
    setPage("form");
    setResult(null);
    setErrors({});
  };

  if (page === "success" && result) {
    return <SuccessPage applicationId={result.applicationId} score={result.score} onReset={handleReset} />;
  }

  if (page === "rejected") {
    return <RejectedPage reason={rejectedReason} onBack={() => setPage("review")} />;
  }

  if (page === "review") {
    return (
      <ReviewScreen
        data={data}
        onEdit={editSection}
        onSubmit={handleSubmit}
        submitting={submitting}
        error={submitError}
      />
    );
  }

  const StepComponent = STEPS[step - 1].component;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
              <span className="text-white font-bold text-xs">F</span>
            </div>
            <span className="font-semibold text-gray-800">FSV Capital</span>
          </div>
          <a href="/" className="text-xs text-gray-400 hover:text-gray-600">← Back to Home</a>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <ProgressBar current={step} total={STEPS.length} title={STEPS[step - 1].title} />

          <h2 className="text-xl font-semibold text-gray-900 mb-5">{STEPS[step - 1].title}</h2>

          <StepComponent data={data} update={update} errors={errors} />

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
            <button
              onClick={goBack}
              disabled={step === 1}
              className="px-5 py-2.5 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              ← Back
            </button>
            <button
              onClick={goNext}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-colors"
            >
              {step === STEPS.length ? "Review Application →" : "Next →"}
            </button>
          </div>
        </div>

        {/* Auto-save notice */}
        <p className="text-center text-xs text-gray-400 mt-3">
          Progress auto-saved · Refresh-safe
        </p>
      </div>
    </div>
  );
}
