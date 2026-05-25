import { Field, Textarea, RadioGroup } from "@/components/FormField";

interface Props { data: Record<string, unknown>; update: (k: string, v: unknown) => void; errors: Record<string, string>; }

export default function Step9({ data, update, errors }: Props) {
  const g = (k: string) => (data[k] as string) || "";
  return (
    <div className="flex flex-col gap-4">
      <Field label="Why FSV Capital?" required error={errors.whyFSV}>
        <Textarea value={g("whyFSV")} onChange={e => update("whyFSV", e.target.value)} placeholder="Why are you specifically reaching out to FSV Capital? (min 100 characters)" error={!!errors.whyFSV} rows={4} />
        <span className="text-xs text-gray-400">{g("whyFSV").length} chars (min 100)</span>
      </Field>
      <Field label="How can FSV Capital add value beyond funding?">
        <Textarea value={g("fsvValueAdd")} onChange={e => update("fsvValueAdd", e.target.value)} placeholder="Network, expertise, partnerships..." rows={3} />
      </Field>
      <Field label="Open to mentorship / cohort programs?">
        <RadioGroup
          name="openToMentorship"
          options={[{value:"true",label:"Yes"},{value:"false",label:"No"}]}
          value={data.openToMentorship === true ? "true" : data.openToMentorship === false ? "false" : ""}
          onChange={v => update("openToMentorship", v === "true")}
        />
      </Field>
    </div>
  );
}
