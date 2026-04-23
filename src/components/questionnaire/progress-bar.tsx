export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm text-slate-500">
        <span>Progress</span>
        <span>{value}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-navy-950 to-navy-700 transition-all duration-500"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
