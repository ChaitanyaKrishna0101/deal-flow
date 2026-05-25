import { Field, Input, Select, Textarea, CheckboxGroup } from "@/components/FormField";

const CURRENCIES = [{ value: "USD", label: "USD ($)" }, { value: "INR", label: "INR (₹)" }];
const FUNDING_STAGES = ["Pre-seed","Seed","Series A","Series B","Growth"].map(v => ({ value: v, label: v }));
const FUND_USES = ["Product Development","Go-to-Market","Hiring","Expansion","R&D","Operations"];

interface Props { data: Record<string, unknown>; update: (k: string, v: unknown) => void; errors: Record<string, string>; }

export default function Step7({ data, update, errors }: Props) {
  const n = (k: string) => (data[k] as number) || "";
  const g = (k: string) => (data[k] as string) || "";
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Amount Raising" required error={errors.amountRaising}>
          <Input value={n("amountRaising")} onChange={e => update("amountRaising", Number(e.target.value))} placeholder="500000" type="number" min={0} error={!!errors.amountRaising} />
        </Field>
        <Field label="Currency">
          <Select options={CURRENCIES} value={g("currency") || "USD"} onChange={e => update("currency", e.target.value)} />
        </Field>
        <Field label="Funding Stage">
          <Select options={FUNDING_STAGES} value={g("fundingStage")} onChange={e => update("fundingStage", e.target.value)} />
        </Field>
        <Field label="Equity Offered (%)">
          <Input value={n("equityOffered")} onChange={e => update("equityOffered", Number(e.target.value))} placeholder="10" type="number" min={0} max={100} />
        </Field>
      </div>
      <Field label="Use of Funds">
        <CheckboxGroup options={FUND_USES} value={(data.useOfFunds as string[]) || []} onChange={v => update("useOfFunds", v)} />
      </Field>
      <Field label="Use of Funds — Detail">
        <Textarea value={g("useOfFundsDetail")} onChange={e => update("useOfFundsDetail", e.target.value)} placeholder="Describe how you'll deploy the capital..." rows={3} />
      </Field>
    </div>
  );
}
