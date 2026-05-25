// Landing page — premium hero for FSV Capital funding portal

import { useLocation } from "wouter";

export default function LandingPage() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100 px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">F</span>
          </div>
          <span className="font-semibold text-gray-900 text-lg">FSV Capital</span>
        </div>
        <button
          onClick={() => navigate("/dashboard")}
          className="text-sm text-gray-500 hover:text-indigo-600 transition-colors"
        >
          Investor Login →
        </button>
      </header>

      {/* Hero */}
      <main className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 text-xs font-medium px-3 py-1 rounded-full mb-6">
          <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></span>
          Now accepting applications — 2026 cohort
        </div>

        <h1 className="text-5xl font-serif text-gray-900 leading-tight mb-4">
          Capital Startup Funding<br />Application
        </h1>
        <p className="text-xl text-gray-500 mb-12 max-w-2xl mx-auto">
          Fueling DeepTech, Fintech &amp; Future Innovation. Apply for funding from FSV Capital — structured review, fast screening, expert mentorship.
        </p>

        {/* Benefits */}
        <div className="grid grid-cols-3 gap-6 mb-14 max-w-2xl mx-auto">
          {[
            { icon: "📋", title: "Structured Review", desc: "Thorough 11-point evaluation process" },
            { icon: "⚡", title: "Fast Screening", desc: "Response within 5–7 business days" },
            { icon: "🎯", title: "Expert Mentorship", desc: "Access to our advisor network" },
          ].map((b) => (
            <div key={b.title} className="text-center">
              <div className="text-3xl mb-2">{b.icon}</div>
              <div className="font-semibold text-gray-800 text-sm mb-1">{b.title}</div>
              <div className="text-xs text-gray-500">{b.desc}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={() => navigate("/apply")}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-base font-semibold px-8 py-4 rounded-lg transition-colors shadow-lg shadow-indigo-200"
        >
          Apply for Funding →
        </button>

        <p className="text-xs text-gray-400 mt-4">Estimated time: ~10 minutes</p>
      </main>

      {/* What to prepare */}
      <section className="bg-gray-50 border-t border-gray-100 py-14">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-center text-lg font-semibold text-gray-800 mb-8">What to prepare</h2>
          <div className="grid grid-cols-3 gap-6">
            {[
              { icon: "📄", label: "Pitch Deck PDF", sub: "Max 10MB" },
              { icon: "📊", label: "Financial Projections", sub: "3-year model" },
              { icon: "👥", label: "Team Information", sub: "Founders & advisors" },
            ].map((item) => (
              <div key={item.label} className="bg-white rounded-xl p-5 border border-gray-100 text-center">
                <div className="text-2xl mb-2">{item.icon}</div>
                <div className="font-medium text-gray-800 text-sm">{item.label}</div>
                <div className="text-xs text-gray-400 mt-1">{item.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Focus areas */}
      <section className="py-14">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Focus sectors</h2>
          <p className="text-sm text-gray-500 mb-6">We invest in high-conviction bets across emerging tech</p>
          <div className="flex flex-wrap justify-center gap-2">
            {["Fintech", "AI/ML", "Blockchain", "DeepTech", "SaaS"].map((s) => (
              <span key={s} className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium">
                {s}
              </span>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-100 py-8 text-center text-xs text-gray-400">
        © 2026 FSV Capital · contact@fsvcapital.com ·{" "}
        <a href="#" className="underline">Privacy Policy</a>
      </footer>
    </div>
  );
}
