// Shown when application fails the screening filter

import { useLocation } from "wouter";

interface Props {
  reason: string;
  onBack: () => void;
}

export default function RejectedPage({ reason, onBack }: Props) {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 max-w-lg w-full text-center">
        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Application Not Eligible</h1>
        <p className="text-gray-500 text-sm mb-6">Thank you for your interest in FSV Capital.</p>

        <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 mb-8 text-left">
          <div className="text-xs font-semibold text-amber-700 mb-1">Reason</div>
          <div className="text-sm text-amber-800">{reason}</div>
        </div>

        <p className="text-sm text-gray-500 mb-6">
          We encourage you to revisit your application details or reach out to us at{" "}
          <a href="mailto:contact@fsvcapital.com" className="text-indigo-600">contact@fsvcapital.com</a>{" "}
          if you believe this is an error.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onBack}
            className="flex-1 border border-gray-200 text-gray-600 rounded-lg py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            ← Edit Application
          </button>
          <button
            onClick={() => navigate("/")}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg py-2.5 text-sm font-medium transition-colors"
          >
            Return to Home
          </button>
        </div>
      </div>
    </div>
  );
}
