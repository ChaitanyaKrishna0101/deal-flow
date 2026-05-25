import { Field, Textarea, Input, RadioGroup, CheckboxGroup } from "@/components/FormField";

const TECH_OPTIONS = ["AI/ML","Blockchain","Cloud","APIs","Mobile","IoT","Other"];

interface Props { data: Record<string, unknown>; update: (k: string, v: unknown) => void; errors: Record<string, string>; }

export default function Step3({ data, update, errors }: Props) {
  const g = (k: string) => (data[k] as string) || "";
  return (
    <div className="flex flex-col gap-4">
      <Field label="Core Product Description">
        <Textarea value={g("coreProduct")} onChange={e => update("coreProduct", e.target.value)} placeholder="Describe your core product..." rows={3} />
      </Field>
      <Field label="Technology Stack">
        <CheckboxGroup options={TECH_OPTIONS} value={(data.techStack as string[]) || []} onChange={v => update("techStack", v)} />
      </Field>
      <Field label="Unique Value Proposition" required error={errors.usp}>
        <Textarea value={g("usp")} onChange={e => update("usp", e.target.value)} placeholder="What makes you uniquely better than alternatives?" error={!!errors.usp} rows={3} />
      </Field>
      <Field label="IP / Patents">
        <RadioGroup name="hasPatents" options={[{value:"true",label:"Yes"},{value:"false",label:"No"}]} value={data.hasPatents === true ? "true" : data.hasPatents === false ? "false" : ""} onChange={v => update("hasPatents", v === "true")} />
      </Field>
      {data.hasPatents === true && (
        <Field label="Patent Details">
          <Input value={g("patentDetails")} onChange={e => update("patentDetails", e.target.value)} placeholder="Describe your patents / IP..." />
        </Field>
      )}
      <Field label="Demo Link">
        <Input value={g("demoLink")} onChange={e => update("demoLink", e.target.value)} placeholder="https://demo.acme.ai" type="url" />
      </Field>
      <Field label="Product Video Link">
        <Input value={g("productVideoLink")} onChange={e => update("productVideoLink", e.target.value)} placeholder="https://youtube.com/..." type="url" />
      </Field>
    </div>
  );
}
