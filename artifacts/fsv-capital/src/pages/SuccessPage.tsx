// Success page shown after application submission

import { useLocation } from "wouter";

interface Props {
  applicationId: string;
  score: number;
  onReset: () => void;
}

export default function SuccessPage({ applicationId, score, onReset }: Props) {
  const [, navigate] = useLocation();

  const scoreColor =
    score >= 65 ? "text-emerald-600 bg-emerald-50" :
    score >= 40 ? "text-amber-600 bg-amber-50" :
    "text-red-600 bg-red-50";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 max-w-lg w-full text-center">
        {/* Check icon */}
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Application Submitted!</h1>
        <p className="text-gray-500 text-sm mb-6">We've received your application and will review it shortly.</p>

        {/* Application ID */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="text-xs text-gray-400 mb-1">Application ID</div>
          <div className="font-mono font-semibold text-gray-800 text-lg">{applicationId}</div>
          <div className="text-xs text-gray-400 mt-1">Save this for your records</div>
        </div>

        {/* Score */}
        <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold mb-8 ${scoreColor}`}>
          Deal Score: {score}/100
        </div>

        {/* Timeline */}
        <div className="text-left space-y-4 mb-8">
          <h3 className="font-semibold text-gray-800 text-sm mb-3">What happens next</h3>
          {[
            { step: "1", label: "Application Review", desc: "Our team reviews your application within 5–7 business days" },
            { step: "2", label: "Shortlisting", desc: "Shortlisted startups are contacted for an intro call" },
            { step: "3", label: "Due Diligence", desc: "Detailed review and potential investment decision" },
          ].map((t) => (
            <div key={t.step} className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                {t.step}
              </div>
              <div>
                <div className="font-medium text-gray-800 text-sm">{t.label}</div>
                <div className="text-xs text-gray-500">{t.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-gray-400 mb-6">Questions? contact@fsvcapital.com</p>

        <div className="flex gap-3">
          <button
            onClick={() => { onReset(); navigate("/"); }}
            className="flex-1 border border-gray-200 text-gray-600 rounded-lg py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Return to Home
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg py-2.5 text-sm font-medium transition-colors"
          >
            View Dashboard →
          </button>
        </div>
      </div>
    </div>
  );
}
