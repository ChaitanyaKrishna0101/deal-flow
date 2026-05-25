interface Props {
  current: number;
  total: number;
  title: string;
}

export default function ProgressBar({ current, total, title }: Props) {
  const pct = Math.round((current / total) * 100);

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontFamily: "'DM Mono'", fontSize: 11, color: "rgba(255,255,255,0.25)" }}>
          {current} / {total}
        </span>
        <span style={{ fontSize: 11, fontWeight: 600, color: "var(--gold)", letterSpacing: "0.03em" }}>{title}</span>
      </div>
      {/* Track */}
      <div style={{ height: 3, background: "rgba(255,255,255,0.05)", borderRadius: 2, overflow: "hidden" }}>
        <div style={{
          height: "100%", width: `${pct}%`,
          background: "linear-gradient(90deg, #A87C2A, #E8C76A)",
          borderRadius: 2,
          boxShadow: "0 0 8px rgba(201,168,76,0.5)",
          transition: "width 0.5s ease",
        }} />
      </div>
      {/* Step dots */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} style={{
            width: 5, height: 5, borderRadius: "50%",
            background: i < current ? "var(--gold)" : "rgba(255,255,255,0.07)",
            boxShadow: i < current ? "0 0 4px rgba(201,168,76,0.5)" : "none",
            transition: "all 0.3s",
          }} />
        ))}
      </div>
    </div>
  );
}
