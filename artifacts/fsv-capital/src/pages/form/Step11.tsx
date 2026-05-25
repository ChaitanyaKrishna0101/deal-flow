import { Field, RadioGroup, Textarea } from "@/components/FormField";

interface Props { data: Record<string, unknown>; update: (k: string, v: unknown) => void; errors: Record<string, string>; }

export default function Step11({ data, update, errors }: Props) {
  const g = (k: string) => (data[k] as string) || "";
  return (
    <div className="flex flex-col gap-4">
      <Field label="Is your company registered?">
        <RadioGroup
          name="isRegistered"
          options={[{value:"true",label:"Yes"},{value:"false",label:"No"}]}
          value={data.isRegistered === true ? "true" : data.isRegistered === false ? "false" : ""}
          onChange={v => update("isRegistered", v === "true")}
        />
      </Field>
      <Field label="Any pending legal issues or disputes?">
        <RadioGroup
          name="hasLegalIssues"
          options={[{value:"true",label:"Yes"},{value:"false",label:"No"}]}
          value={data.hasLegalIssues === true ? "true" : data.hasLegalIssues === false ? "false" : ""}
          onChange={v => update("hasLegalIssues", v === "true")}
        />
      </Field>
      {data.hasLegalIssues === true && (
        <Field label="Please explain the legal matter">
          <Textarea value={g("legalExplanation")} onChange={e => update("legalExplanation", e.target.value)} placeholder="Provide context on the legal issue..." rows={3} />
        </Field>
      )}
      <div className="border border-gray-100 rounded-lg p-4 bg-gray-50">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={!!(data.consentGiven)}
            onChange={e => update("consentGiven", e.target.checked)}
            className="w-4 h-4 mt-0.5 text-indigo-600 rounded"
          />
          <span className="text-sm text-gray-700">
            I consent to share this application and associated data with FSV Capital and its authorized partners for the purpose of investment evaluation.
            I confirm the information provided is accurate to the best of my knowledge.
            <br />
            <a href="#" className="text-indigo-600 underline text-xs mt-1 inline-block">Privacy Policy</a>
          </span>
        </label>
        {errors.consentGiven && <p className="text-xs text-red-500 mt-2">{errors.consentGiven}</p>}
      </div>
    </div>
  );
}
