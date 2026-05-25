// Progress bar shown at top of multi-step form

interface Props {
  current: number;
  total: number;
  title: string;
}

export default function ProgressBar({ current, total, title }: Props) {
  const pct = Math.round((current / total) * 100);

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-gray-500">
          Step {current} of {total}
        </span>
        <span className="text-xs font-semibold text-indigo-600">{title}</span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-indigo-600 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
