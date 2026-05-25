import { Field, Input } from "@/components/FormField";

interface Props { data: Record<string, unknown>; update: (k: string, v: unknown) => void; errors: Record<string, string>; }

export default function Step1({ data, update, errors }: Props) {
  const g = (k: string) => (data[k] as string) || "";
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="col-span-2 sm:col-span-1">
        <Field label="Startup Name" required error={errors.startupName}>
          <Input value={g("startupName")} onChange={e => update("startupName", e.target.value)} placeholder="Acme AI" error={!!errors.startupName} />
        </Field>
      </div>
      <div className="col-span-2 sm:col-span-1">
        <Field label="Website URL">
          <Input value={g("websiteUrl")} onChange={e => update("websiteUrl", e.target.value)} placeholder="https://acme.ai" type="url" />
        </Field>
      </div>
      <div className="col-span-2">
        <Field label="Founder Name(s)" required error={errors.founderNames}>
          <Input value={g("founderNames")} onChange={e => update("founderNames", e.target.value)} placeholder="John Smith, Jane Doe" error={!!errors.founderNames} />
        </Field>
      </div>
      <div className="col-span-2 sm:col-span-1">
        <Field label="Contact Email" required error={errors.contactEmail}>
          <Input value={g("contactEmail")} onChange={e => update("contactEmail", e.target.value)} placeholder="founder@acme.ai" type="email" error={!!errors.contactEmail} />
        </Field>
      </div>
      <div className="col-span-2 sm:col-span-1">
        <Field label="Contact Number">
          <Input value={g("contactNumber")} onChange={e => update("contactNumber", e.target.value)} placeholder="+1 555 000 0000" type="tel" />
        </Field>
      </div>
      <div className="col-span-2 sm:col-span-1">
        <Field label="LinkedIn — Founder">
          <Input value={g("linkedinFounder")} onChange={e => update("linkedinFounder", e.target.value)} placeholder="linkedin.com/in/john" type="url" />
        </Field>
      </div>
      <div className="col-span-2 sm:col-span-1">
        <Field label="LinkedIn — Company">
          <Input value={g("linkedinCompany")} onChange={e => update("linkedinCompany", e.target.value)} placeholder="linkedin.com/company/acme" type="url" />
        </Field>
      </div>
      <div className="col-span-2 sm:col-span-1">
        <Field label="Headquarters City">
          <Input value={g("headquartersCity")} onChange={e => update("headquartersCity", e.target.value)} placeholder="San Francisco" />
        </Field>
      </div>
      <div className="col-span-2 sm:col-span-1">
        <Field label="Headquarters Country">
          <Input value={g("headquartersCountry")} onChange={e => update("headquartersCountry", e.target.value)} placeholder="USA" />
        </Field>
      </div>
      <div className="col-span-2 sm:col-span-1">
        <Field label="Year of Incorporation">
          <Input value={g("yearOfIncorporation")} onChange={e => update("yearOfIncorporation", e.target.value)} placeholder="2022" type="number" min={1900} max={2026} />
        </Field>
      </div>
    </div>
  );
}
