import { Field, Input, Textarea } from "@/components/FormField";

interface Props { data: Record<string, unknown>; update: (k: string, v: unknown) => void; errors: Record<string, string>; }

export default function Step6({ data, update, errors }: Props) {
  const n = (k: string) => (data[k] as number) || "";
  const g = (k: string) => (data[k] as string) || "";
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Total Funding Raised (USD)">
          <Input value={n("fundingRaised")} onChange={e => update("fundingRaised", Number(e.target.value))} placeholder="500000" type="number" min={0} />
        </Field>
        <Field label="Monthly Burn Rate (USD)">
          <Input value={n("burnRate")} onChange={e => update("burnRate", Number(e.target.value))} placeholder="80000" type="number" min={0} />
        </Field>
        <Field label="Runway (months)">
          <Input value={n("runway")} onChange={e => update("runway", Number(e.target.value))} placeholder="18" type="number" min={0} />
        </Field>
      </div>
      <Field label="Previous Investors">
        <Textarea value={g("previousInvestors")} onChange={e => update("previousInvestors", e.target.value)} placeholder="Angels, VCs who have invested before..." rows={2} />
      </Field>
      <div className="grid grid-cols-3 gap-3">
        <Field label="Revenue Projection Y1 (USD)">
          <Input value={n("projectionY1")} onChange={e => update("projectionY1", Number(e.target.value))} placeholder="1000000" type="number" min={0} />
        </Field>
        <Field label="Year 2 (USD)">
          <Input value={n("projectionY2")} onChange={e => update("projectionY2", Number(e.target.value))} placeholder="3000000" type="number" min={0} />
        </Field>
        <Field label="Year 3 (USD)">
          <Input value={n("projectionY3")} onChange={e => update("projectionY3", Number(e.target.value))} placeholder="10000000" type="number" min={0} />
        </Field>
      </div>
    </div>
  );
}
