import { useLocation } from "wouter";

export default function LandingPage() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: "var(--surface)" }}>

      {/* Background radial glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div style={{
          position: "absolute", top: "-20%", left: "50%", transform: "translateX(-50%)",
          width: "800px", height: "500px",
          background: "radial-gradient(ellipse at center, rgba(201,168,76,0.08) 0%, transparent 70%)",
        }} />
        <div style={{
          position: "absolute", bottom: "10%", right: "-10%",
          width: "400px", height: "400px",
          background: "radial-gradient(ellipse at center, rgba(201,168,76,0.04) 0%, transparent 70%)",
        }} />
        {/* Grid lines */}
        <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: 0.04 }}>
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#C9A84C" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Header */}
      <header className="relative z-10 px-8 py-5 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            background: "linear-gradient(135deg, #C9A84C, #A87C2A)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 20px rgba(201,168,76,0.3)",
          }}>
            <span style={{ color: "#0D0D12", fontWeight: 800, fontSize: 14, fontFamily: "DM Serif Display" }}>F</span>
          </div>
          <div>
            <span style={{ fontFamily: "'DM Serif Display'", fontSize: 18, color: "#E8C76A", letterSpacing: "-0.02em" }}>
              FSV Capital
            </span>
          </div>
        </div>

        <nav className="flex items-center gap-6">
          <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>
            <span className="glow-dot" style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "#4ADE80", marginRight: 6 }} />
            Open — 2026 Cohort
          </span>
          <button
            onClick={() => navigate("/dashboard")}
            style={{
              color: "var(--gold)", fontSize: 13, fontWeight: 500,
              border: "1px solid var(--border-gold)", padding: "6px 16px", borderRadius: 8,
              background: "var(--gold-dim)", cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(201,168,76,0.25)")}
            onMouseLeave={e => (e.currentTarget.style.background = "var(--gold-dim)")}
          >
            Investor Portal →
          </button>
        </nav>
      </header>

      {/* Hero */}
      <main className="relative z-10 max-w-5xl mx-auto px-8 pt-16 pb-20 text-center">

        {/* Pill */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)",
          borderRadius: 100, padding: "5px 14px", marginBottom: 32,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--gold)", display: "inline-block" }} className="glow-dot" />
          <span style={{ color: "var(--gold)", fontSize: 12, fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase" }}>
            Now Accepting Applications — 2026 Cohort
          </span>
        </div>

        <h1 style={{
          fontFamily: "'DM Serif Display'",
          fontSize: "clamp(42px, 7vw, 80px)",
          lineHeight: 1.08,
          marginBottom: 24,
          letterSpacing: "-0.03em",
        }}>
          <span style={{ color: "#F0E8D0" }}>Where Capital Meets</span>
          <br />
          <span style={{
            background: "linear-gradient(135deg, #E8C76A 0%, #C9A84C 60%, #A87C2A 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          }}>Conviction.</span>
        </h1>

        <p style={{ color: "rgba(240,232,208,0.55)", fontSize: 18, lineHeight: 1.7, maxWidth: 560, margin: "0 auto 48px", fontWeight: 300 }}>
          FSV Capital backs DeepTech, Fintech &amp; frontier innovation founders
          through a structured, data-driven review process — not gut feel.
        </p>

        {/* Stats bar */}
        <div style={{
          display: "flex", justifyContent: "center", gap: 48, marginBottom: 56,
        }}>
          {[
            { value: "$120M+", label: "AUM" },
            { value: "47", label: "Portfolio Companies" },
            { value: "3.2×", label: "Avg. Return Multiple" },
          ].map(s => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'DM Mono'", fontSize: 26, fontWeight: 500, color: "var(--gold-light)", lineHeight: 1 }}>{s.value}</div>
              <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, marginTop: 4, letterSpacing: "0.04em", textTransform: "uppercase" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <button
            onClick={() => navigate("/apply")}
            style={{
              background: "linear-gradient(135deg, #C9A84C, #A87C2A)",
              color: "#0D0D12", fontWeight: 700, fontSize: 15,
              padding: "16px 40px", borderRadius: 12, border: "none",
              cursor: "pointer", letterSpacing: "0.02em",
              boxShadow: "0 0 40px rgba(201,168,76,0.3), 0 4px 20px rgba(0,0,0,0.4)",
              transition: "all 0.25s",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 0 60px rgba(201,168,76,0.4), 0 8px 30px rgba(0,0,0,0.5)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 0 40px rgba(201,168,76,0.3), 0 4px 20px rgba(0,0,0,0.4)"; }}
          >
            Apply for Funding →
          </button>
          <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 12 }}>~10 minutes · Auto-saved · No login required</span>
        </div>
      </main>

      {/* Benefits */}
      <section className="relative z-10" style={{ borderTop: "1px solid var(--border-subtle)", padding: "60px 32px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>Why FSV</p>
            <h2 style={{ fontFamily: "'DM Serif Display'", fontSize: 32, color: "#F0E8D0", letterSpacing: "-0.02em" }}>Built for serious founders</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {[
              { icon: "◈", title: "Structured Review", desc: "11-dimension evaluation framework. Every application scored, ranked, and reviewed on identical criteria." },
              { icon: "◎", title: "Fast Turnaround", desc: "5–7 business days to a decision. No ghosting — every application receives a response." },
              { icon: "◉", title: "Active Partnership", desc: "Capital plus network. Board-level support, advisor access, and portfolio synergies from day one." },
            ].map(b => (
              <div key={b.title} style={{
                background: "var(--surface-raised)", border: "1px solid var(--border-subtle)",
                borderRadius: 16, padding: "28px 24px",
                transition: "border-color 0.2s",
              }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--border-gold)")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--border-subtle)")}
              >
                <div style={{ fontSize: 22, color: "var(--gold)", marginBottom: 12 }}>{b.icon}</div>
                <div style={{ color: "#F0E8D0", fontWeight: 600, marginBottom: 8, fontSize: 15 }}>{b.title}</div>
                <div style={{ color: "rgba(240,232,208,0.4)", fontSize: 13, lineHeight: 1.6 }}>{b.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What to prepare */}
      <section className="relative z-10" style={{ padding: "60px 32px", borderTop: "1px solid var(--border-subtle)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>Checklist</p>
            <h2 style={{ fontFamily: "'DM Serif Display'", fontSize: 32, color: "#F0E8D0", letterSpacing: "-0.02em" }}>What to prepare</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {[
              { num: "01", label: "Pitch Deck PDF", sub: "Max 10MB, 10–15 slides" },
              { num: "02", label: "Financial Model", sub: "3-year projection" },
              { num: "03", label: "Team Profiles", sub: "Founders + advisors" },
            ].map(item => (
              <div key={item.num} style={{
                background: "var(--surface-overlay)", border: "1px solid var(--border-subtle)",
                borderRadius: 12, padding: "20px 22px", display: "flex", gap: 16, alignItems: "flex-start",
              }}>
                <span style={{ fontFamily: "'DM Mono'", fontSize: 11, color: "var(--gold)", opacity: 0.7, marginTop: 3 }}>{item.num}</span>
                <div>
                  <div style={{ color: "#F0E8D0", fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{item.label}</div>
                  <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}>{item.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sectors */}
      <section className="relative z-10" style={{ padding: "48px 32px 60px", borderTop: "1px solid var(--border-subtle)" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 20 }}>Investment Focus</p>
          <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
            {["Fintech", "AI/ML", "Blockchain", "DeepTech", "SaaS"].map(s => (
              <span key={s} style={{
                background: "var(--gold-dim)", border: "1px solid var(--border-gold)",
                color: "var(--gold-light)", borderRadius: 100,
                padding: "6px 18px", fontSize: 13, fontWeight: 500,
              }}>{s}</span>
            ))}
          </div>
          <p style={{ color: "rgba(255,255,255,0.2)", fontSize: 12, marginTop: 16 }}>
            Funding range $50K – $10M · Seed to Series A
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: "1px solid var(--border-subtle)", padding: "24px 32px",
        textAlign: "center", color: "rgba(255,255,255,0.2)", fontSize: 12,
        position: "relative", zIndex: 10,
      }}>
        © 2026 FSV Capital · contact@fsvcapital.com ·{" "}
        <a href="#" style={{ color: "rgba(255,255,255,0.3)", textDecoration: "underline" }}>Privacy Policy</a>
      </footer>
    </div>
  );
}
