import { Field, Input, Textarea } from "@/components/FormField";

interface Props { data: Record<string, unknown>; update: (k: string, v: unknown) => void; errors: Record<string, string>; }

export default function Step5({ data, update, errors }: Props) {
  const n = (k: string) => (data[k] as number) || "";
  const g = (k: string) => (data[k] as string) || "";
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Monthly Revenue (USD)">
          <Input value={n("monthlyRevenue")} onChange={e => update("monthlyRevenue", Number(e.target.value))} placeholder="25000" type="number" min={0} />
        </Field>
        <Field label="Annual Revenue (USD)">
          <Input value={n("annualRevenue")} onChange={e => update("annualRevenue", Number(e.target.value))} placeholder="300000" type="number" min={0} />
        </Field>
        <Field label="Growth Rate (%)">
          <Input value={n("growthRate")} onChange={e => update("growthRate", Number(e.target.value))} placeholder="25" type="number" min={0} />
        </Field>
        <Field label="Number of Customers / Users">
          <Input value={n("customerCount")} onChange={e => update("customerCount", Number(e.target.value))} placeholder="500" type="number" min={0} />
        </Field>
      </div>
      <Field label="Key Partnerships">
        <Textarea value={g("partnerships")} onChange={e => update("partnerships", e.target.value)} placeholder="Strategic partnerships, integrations..." rows={2} />
      </Field>
      <Field label="Notable Achievements / Awards">
        <Textarea value={g("achievements")} onChange={e => update("achievements", e.target.value)} placeholder="YC W24, Forbes 30 Under 30, $1M ARR milestone..." rows={2} />
      </Field>
    </div>
  );
}
