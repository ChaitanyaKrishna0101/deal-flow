interface FieldProps {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}

export function Field({ label, required, error, children }: FieldProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 12, fontWeight: 500, color: "rgba(240,232,208,0.55)", letterSpacing: "0.02em" }}>
        {label}
        {required && <span style={{ color: "#C9A84C", marginLeft: 3 }}>*</span>}
      </label>
      {children}
      {error && <p style={{ fontSize: 11, color: "#F87171", margin: 0 }}>{error}</p>}
    </div>
  );
}

const baseInput: React.CSSProperties = {
  width: "100%", height: 44, padding: "0 14px",
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 10, fontSize: 14, color: "#F0E8D0",
  outline: "none", transition: "border-color 0.2s, box-shadow 0.2s",
  boxSizing: "border-box",
};
const errorInput: React.CSSProperties = {
  ...baseInput, borderColor: "rgba(248,113,113,0.4)", background: "rgba(248,113,113,0.04)",
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> { error?: boolean; }

export function Input({ error, style, onFocus, onBlur, ...props }: InputProps) {
  return (
    <input
      style={error ? { ...errorInput, ...style } : { ...baseInput, ...style }}
      onFocus={e => { e.currentTarget.style.borderColor = "rgba(201,168,76,0.4)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(201,168,76,0.07)"; onFocus?.(e); }}
      onBlur={e => { e.currentTarget.style.borderColor = error ? "rgba(248,113,113,0.4)" : "rgba(255,255,255,0.08)"; e.currentTarget.style.boxShadow = "none"; onBlur?.(e); }}
      {...props}
    />
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> { error?: boolean; }

export function Textarea({ error, style, onFocus, onBlur, ...props }: TextareaProps) {
  const base: React.CSSProperties = {
    width: "100%", padding: "12px 14px",
    background: "rgba(255,255,255,0.03)",
    border: `1px solid ${error ? "rgba(248,113,113,0.4)" : "rgba(255,255,255,0.08)"}`,
    borderRadius: 10, fontSize: 14, color: "#F0E8D0",
    outline: "none", resize: "none", lineHeight: 1.6,
    boxSizing: "border-box", transition: "border-color 0.2s, box-shadow 0.2s",
    ...style,
  };
  return (
    <textarea
      rows={4}
      style={base}
      onFocus={e => { e.currentTarget.style.borderColor = "rgba(201,168,76,0.4)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(201,168,76,0.07)"; onFocus?.(e); }}
      onBlur={e => { e.currentTarget.style.borderColor = error ? "rgba(248,113,113,0.4)" : "rgba(255,255,255,0.08)"; e.currentTarget.style.boxShadow = "none"; onBlur?.(e); }}
      {...props}
    />
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[];
  error?: boolean;
}

export function Select({ options, error, style, onFocus, onBlur, ...props }: SelectProps) {
  const base: React.CSSProperties = {
    width: "100%", height: 44, padding: "0 14px",
    background: "rgba(255,255,255,0.03)",
    border: `1px solid ${error ? "rgba(248,113,113,0.4)" : "rgba(255,255,255,0.08)"}`,
    borderRadius: 10, fontSize: 14, color: "#F0E8D0",
    outline: "none", cursor: "pointer", boxSizing: "border-box",
    transition: "border-color 0.2s",
    ...style,
  };
  return (
    <select
      style={base}
      onFocus={e => { e.currentTarget.style.borderColor = "rgba(201,168,76,0.4)"; onFocus?.(e as React.FocusEvent<HTMLSelectElement>); }}
      onBlur={e => { e.currentTarget.style.borderColor = error ? "rgba(248,113,113,0.4)" : "rgba(255,255,255,0.08)"; onBlur?.(e as React.FocusEvent<HTMLSelectElement>); }}
      {...props}
    >
      <option value="" style={{ background: "#131318" }}>Select...</option>
      {options.map(o => <option key={o.value} value={o.value} style={{ background: "#131318" }}>{o.label}</option>)}
    </select>
  );
}

interface RadioGroupProps {
  name: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}

export function RadioGroup({ name, options, value, onChange }: RadioGroupProps) {
  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      {options.map(o => (
        <label key={o.value} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
          <input
            type="radio" name={name} value={o.value}
            checked={value === o.value} onChange={() => onChange(o.value)}
            style={{ accentColor: "var(--gold)", width: 14, height: 14 }}
          />
          <span style={{ fontSize: 13, color: "rgba(240,232,208,0.7)" }}>{o.label}</span>
        </label>
      ))}
    </div>
  );
}

interface CheckboxGroupProps {
  options: string[];
  value: string[];
  onChange: (v: string[]) => void;
}

export function CheckboxGroup({ options, value, onChange }: CheckboxGroupProps) {
  const toggle = (opt: string) => {
    if (value.includes(opt)) onChange(value.filter(v => v !== opt));
    else onChange([...value, opt]);
  };
  return (
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
      {options.map(opt => (
        <label key={opt} style={{ display: "flex", alignItems: "center", gap: 7, cursor: "pointer" }}>
          <input
            type="checkbox" checked={value.includes(opt)} onChange={() => toggle(opt)}
            style={{ accentColor: "var(--gold)", width: 14, height: 14 }}
          />
          <span style={{ fontSize: 13, color: "rgba(240,232,208,0.7)" }}>{opt}</span>
        </label>
      ))}
    </div>
  );
}
