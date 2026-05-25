// Step 10 — Document upload (simulated for prototype)

interface Props { data: Record<string, unknown>; update: (k: string, v: unknown) => void; errors: Record<string, string>; }

function FileUploadArea({ label, accept, hint, required, value, onChange }: {
  label: string; accept: string; hint: string; required?: boolean;
  value: string; onChange: (name: string) => void;
}) {
  return (
    <div className="border border-dashed border-gray-200 rounded-lg p-5 bg-gray-50 hover:bg-indigo-50 hover:border-indigo-200 transition-colors">
      <label className="block cursor-pointer">
        <input
          type="file"
          accept={accept}
          className="hidden"
          onChange={e => onChange(e.target.files?.[0]?.name || "")}
        />
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="text-2xl">
            {value ? "✅" : "📄"}
          </div>
          <div className="text-sm font-medium text-gray-700">
            {value ? value : label}
            {required && !value && <span className="text-red-500 ml-1">*</span>}
          </div>
          <div className="text-xs text-gray-400">{hint}</div>
          {!value && (
            <div className="mt-1 px-3 py-1.5 bg-white border border-gray-200 rounded-md text-xs text-gray-600 font-medium">
              Choose file
            </div>
          )}
          {value && (
            <div className="mt-1 px-3 py-1.5 bg-indigo-50 border border-indigo-200 rounded-md text-xs text-indigo-600 font-medium">
              Change file
            </div>
          )}
        </div>
      </label>
    </div>
  );
}

export default function Step10({ data, update, errors }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 text-xs text-amber-700 mb-2">
        <strong>Prototype note:</strong> File uploads are simulated in this demo. File names will be saved but no actual upload occurs.
      </div>
      <FileUploadArea
        label="Pitch Deck PDF"
        accept=".pdf"
        hint="PDF only · Max 10MB · Required"
        required
        value={(data.pitchDeckName as string) || ""}
        onChange={name => update("pitchDeckName", name)}
      />
      {errors.pitchDeckName && <p className="text-xs text-red-500">{errors.pitchDeckName}</p>}
      <FileUploadArea
        label="Financial Model"
        accept=".pdf,.xlsx,.xls"
        hint="PDF or Excel · Optional"
        value={(data.financialModelName as string) || ""}
        onChange={name => update("financialModelName", name)}
      />
      <FileUploadArea
        label="Product Screenshots"
        accept=".png,.jpg,.jpeg,.webp"
        hint="Images · Up to 3 · Optional"
        value={(data.screenshotNames as string) || ""}
        onChange={name => update("screenshotNames", name)}
      />
      <FileUploadArea
        label="Additional Documents"
        accept="*"
        hint="Any format · Optional"
        value={(data.additionalDocsName as string) || ""}
        onChange={name => update("additionalDocsName", name)}
      />
    </div>
  );
}
