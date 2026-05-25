import { Field, Textarea, Select, RadioGroup } from "@/components/FormField";

const SECTORS = ["Fintech","AI/ML","Blockchain","DeepTech","SaaS","HealthTech","EdTech","Other"].map(v => ({ value: v, label: v }));
const MODELS = ["B2B","B2C","B2B2C","Marketplace","SaaS","Other"].map(v => ({ value: v, label: v }));
const STAGES = ["Idea","MVP","Early Revenue","Growth Stage","Scaling"].map(v => ({ value: v, label: v }));

interface Props { data: Record<string, unknown>; update: (k: string, v: unknown) => void; errors: Record<string, string>; }

export default function Step2({ data, update, errors }: Props) {
  const g = (k: string) => (data[k] as string) || "";
  return (
    <div className="flex flex-col gap-4">
      <Field label="Problem Statement" required error={errors.problemStatement}>
        <Textarea value={g("problemStatement")} onChange={e => update("problemStatement", e.target.value)} placeholder="What critical problem are you solving? (min 50 characters)" error={!!errors.problemStatement} rows={4} />
        <span className="text-xs text-gray-400">{g("problemStatement").length} chars (min 50)</span>
      </Field>
      <Field label="Solution Overview" required error={errors.solutionOverview}>
        <Textarea value={g("solutionOverview")} onChange={e => update("solutionOverview", e.target.value)} placeholder="How does your solution work? (min 50 characters)" error={!!errors.solutionOverview} rows={4} />
        <span className="text-xs text-gray-400">{g("solutionOverview").length} chars (min 50)</span>
      </Field>
      <Field label="Industry / Sector" required error={errors.sector}>
        <Select options={SECTORS} value={g("sector")} onChange={e => update("sector", e.target.value)} error={!!errors.sector} />
      </Field>
      <Field label="Business Model" required error={errors.businessModel}>
        <Select options={MODELS} value={g("businessModel")} onChange={e => update("businessModel", e.target.value)} error={!!errors.businessModel} />
      </Field>
      <Field label="Current Stage" required error={errors.stage}>
        <RadioGroup name="stage" options={STAGES} value={g("stage")} onChange={v => update("stage", v)} />
        {errors.stage && <p className="text-xs text-red-500">{errors.stage}</p>}
      </Field>
    </div>
  );
}
