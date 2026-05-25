// Review screen — shown before final submit, lets users review & edit

interface Props {
  data: Record<string, unknown>;
  onEdit: (step: number) => void;
  onSubmit: () => void;
  submitting: boolean;
  error?: string;
}

interface Section {
  title: string;
  step: number;
  fields: { label: string; key: string; format?: (v: unknown) => string }[];
}

const fmt = (v: unknown): string => {
  if (v === null || v === undefined || v === "") return "—";
  if (typeof v === "boolean") return v ? "Yes" : "No";
  if (Array.isArray(v)) return v.length ? v.join(", ") : "—";
  if (typeof v === "number") return v.toLocaleString();
  return String(v);
};

const SECTIONS: Section[] = [
  {
    title: "Basic Information", step: 1,
    fields: [
      { label: "Startup Name", key: "startupName" },
      { label: "Website", key: "websiteUrl" },
      { label: "Founder(s)", key: "founderNames" },
      { label: "Email", key: "contactEmail" },
      { label: "Phone", key: "contactNumber" },
      { label: "HQ City", key: "headquartersCity" },
      { label: "HQ Country", key: "headquartersCountry" },
    ]
  },
  {
    title: "Startup Overview", step: 2,
    fields: [
      { label: "Sector", key: "sector" },
      { label: "Business Model", key: "businessModel" },
      { label: "Stage", key: "stage" },
      { label: "Problem Statement", key: "problemStatement" },
      { label: "Solution Overview", key: "solutionOverview" },
    ]
  },
  {
    title: "Product & Technology", step: 3,
    fields: [
      { label: "Core Product", key: "coreProduct" },
      { label: "Tech Stack", key: "techStack" },
      { label: "USP", key: "usp" },
      { label: "Has Patents", key: "hasPatents" },
      { label: "Demo Link", key: "demoLink" },
    ]
  },
  {
    title: "Market Opportunity", step: 4,
    fields: [
      { label: "TAM", key: "tam" },
      { label: "SAM", key: "sam" },
      { label: "SOM", key: "som" },
      { label: "Competitive Advantage", key: "competitiveAdvantage" },
    ]
  },
  {
    title: "Traction & Metrics", step: 5,
    fields: [
      { label: "Monthly Revenue", key: "monthlyRevenue", format: (v) => v ? `$${Number(v).toLocaleString()}` : "—" },
      { label: "Annual Revenue", key: "annualRevenue", format: (v) => v ? `$${Number(v).toLocaleString()}` : "—" },
      { label: "Growth Rate", key: "growthRate", format: (v) => v ? `${v}%` : "—" },
      { label: "Customers", key: "customerCount" },
    ]
  },
  {
    title: "Financials", step: 6,
    fields: [
      { label: "Funding Raised", key: "fundingRaised", format: (v) => v ? `$${Number(v).toLocaleString()}` : "—" },
      { label: "Burn Rate/mo", key: "burnRate", format: (v) => v ? `$${Number(v).toLocaleString()}` : "—" },
      { label: "Runway", key: "runway", format: (v) => v ? `${v} months` : "—" },
    ]
  },
  {
    title: "Funding Requirement", step: 7,
    fields: [
      { label: "Amount Raising", key: "amountRaising", format: (v) => v ? `$${Number(v).toLocaleString()}` : "—" },
      { label: "Currency", key: "currency" },
      { label: "Funding Stage", key: "fundingStage" },
      { label: "Equity Offered", key: "equityOffered", format: (v) => v ? `${v}%` : "—" },
      { label: "Use of Funds", key: "useOfFunds" },
    ]
  },
  {
    title: "Team", step: 8,
    fields: [
      { label: "Team Size", key: "teamSize" },
      { label: "Founder Education", key: "founderEducation" },
      { label: "Founder Experience", key: "founderExperience" },
      { label: "Advisors", key: "advisors" },
    ]
  },
  {
    title: "Strategic Fit", step: 9,
    fields: [
      { label: "Why FSV Capital", key: "whyFSV" },
      { label: "Open to Mentorship", key: "openToMentorship" },
    ]
  },
  {
    title: "Documents", step: 10,
    fields: [
      { label: "Pitch Deck", key: "pitchDeckName" },
      { label: "Financial Model", key: "financialModelName" },
    ]
  },
];

export default function ReviewScreen({ data, onEdit, onSubmit, submitting, error }: Props) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-serif text-gray-900 mb-1">Review Your Application</h2>
        <p className="text-sm text-gray-500">Please review all sections before submitting.</p>
      </div>

      <div className="space-y-4 mb-8">
        {SECTIONS.map((sec) => (
          <div key={sec.title} className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800 text-sm">{sec.title}</h3>
              <button
                onClick={() => onEdit(sec.step)}
                className="text-xs text-indigo-600 hover:underline font-medium"
              >
                Edit
              </button>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
              {sec.fields.map((f) => (
                <div key={f.key} className="col-span-1">
                  <span className="text-xs text-gray-400">{f.label}: </span>
                  <span className="text-xs text-gray-700 font-medium">
                    {f.format ? f.format(data[f.key]) : fmt(data[f.key])}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5">
        <p className="text-sm text-indigo-800 mb-4">
          By clicking "Submit Application" you confirm all information is accurate and consent to our data processing terms.
        </p>
        <button
          onClick={onSubmit}
          disabled={submitting}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-semibold py-3 rounded-lg transition-colors text-sm"
        >
          {submitting ? "Submitting..." : "Submit Application →"}
        </button>
      </div>
    </div>
  );
}
