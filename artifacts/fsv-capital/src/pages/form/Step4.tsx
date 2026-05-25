import { Field, Input, Textarea } from "@/components/FormField";

interface Props { data: Record<string, unknown>; update: (k: string, v: unknown) => void; errors: Record<string, string>; }

export default function Step4({ data, update, errors }: Props) {
  const g = (k: string) => (data[k] as string) || "";
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-3">
        <Field label="TAM (Total Addressable Market)">
          <Input value={g("tam")} onChange={e => update("tam", e.target.value)} placeholder="$5 Billion" />
        </Field>
        <Field label="SAM (Serviceable)">
          <Input value={g("sam")} onChange={e => update("sam", e.target.value)} placeholder="$800 Million" />
        </Field>
        <Field label="SOM (Obtainable)">
          <Input value={g("som")} onChange={e => update("som", e.target.value)} placeholder="$50 Million" />
        </Field>
      </div>
      <Field label="Customer Segment">
        <Textarea value={g("customerSegment")} onChange={e => update("customerSegment", e.target.value)} placeholder="Who are your target customers?" rows={3} />
      </Field>
      <Field label="Key Competitors">
        <Textarea value={g("competitors")} onChange={e => update("competitors", e.target.value)} placeholder="List your main competitors..." rows={2} />
      </Field>
      <Field label="Competitive Advantage">
        <Textarea value={g("competitiveAdvantage")} onChange={e => update("competitiveAdvantage", e.target.value)} placeholder="Why will you win?" rows={3} />
      </Field>
    </div>
  );
}
