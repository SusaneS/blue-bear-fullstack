interface ProgressBarProps {
  label: string;
  value: number;
  max: number;
  color?: string;
  showValues?: boolean;
}

export default function ProgressBar({
  label,
  value,
  max,
  color = 'bg-blue-500',
  showValues = true,
}: ProgressBarProps) {
  const percentage = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  const satisfied = value >= max;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between items-center text-sm">
        <span className="font-medium text-gray-700">{label}</span>
        {showValues && (
          <span className={`text-xs font-semibold ${satisfied ? 'text-green-600' : 'text-gray-500'}`}>
            {satisfied ? '✓ ' : ''}{value}/{max} credits
          </span>
        )}
      </div>
      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            satisfied ? 'bg-green-500' : color
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
