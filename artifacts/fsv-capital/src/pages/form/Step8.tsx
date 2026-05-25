import { useState } from "react";
import { Field, Input, Textarea } from "@/components/FormField";

interface CoreMember { name: string; role: string; linkedin: string; }
interface Props { data: Record<string, unknown>; update: (k: string, v: unknown) => void; errors: Record<string, string>; }

export default function Step8({ data, update, errors }: Props) {
  const g = (k: string) => (data[k] as string) || "";
  const n = (k: string) => (data[k] as number) || "";
  const coreTeam: CoreMember[] = (data.coreTeam as CoreMember[]) || [];

  const updateMember = (idx: number, field: keyof CoreMember, val: string) => {
    const updated = [...coreTeam];
    updated[idx] = { ...updated[idx], [field]: val };
    update("coreTeam", updated);
  };

  const addMember = () => {
    if (coreTeam.length < 5) update("coreTeam", [...coreTeam, { name: "", role: "", linkedin: "" }]);
  };

  const removeMember = (idx: number) => {
    update("coreTeam", coreTeam.filter((_, i) => i !== idx));
  };

  return (
    <div className="flex flex-col gap-4">
      <Field label="Founder Education Background">
        <Textarea value={g("founderEducation")} onChange={e => update("founderEducation", e.target.value)} placeholder="MIT CS, Harvard MBA..." rows={2} />
      </Field>
      <Field label="Founder Work Experience">
        <Textarea value={g("founderExperience")} onChange={e => update("founderExperience", e.target.value)} placeholder="Ex-Google PM, 8 years in fintech..." rows={3} />
      </Field>
      <Field label="Number of Core Team Members">
        <Input value={n("teamSize")} onChange={e => update("teamSize", Number(e.target.value))} placeholder="5" type="number" min={1} />
      </Field>

      {/* Dynamic team members */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-medium text-gray-600">Core Team Members</label>
          {coreTeam.length < 5 && (
            <button onClick={addMember} className="text-xs text-indigo-600 font-medium hover:underline">+ Add member</button>
          )}
        </div>
        <div className="space-y-3">
          {coreTeam.map((m, i) => (
            <div key={i} className="grid grid-cols-3 gap-2 bg-gray-50 rounded-lg p-3 relative">
              <Input value={m.name} onChange={e => updateMember(i, "name", e.target.value)} placeholder="Name" />
              <Input value={m.role} onChange={e => updateMember(i, "role", e.target.value)} placeholder="Role (CTO, VP Sales)" />
              <Input value={m.linkedin} onChange={e => updateMember(i, "linkedin", e.target.value)} placeholder="LinkedIn URL" />
              <button onClick={() => removeMember(i)} className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-100 text-red-600 rounded-full text-xs flex items-center justify-center hover:bg-red-200">×</button>
            </div>
          ))}
          {coreTeam.length === 0 && (
            <p className="text-xs text-gray-400">No members added yet. Click "+ Add member" above.</p>
          )}
        </div>
      </div>

      <Field label="Advisors / Mentors">
        <Textarea value={g("advisors")} onChange={e => update("advisors", e.target.value)} placeholder="Notable advisors and mentors..." rows={2} />
      </Field>
    </div>
  );
}
