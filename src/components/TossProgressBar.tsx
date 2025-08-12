interface TossProgressBarProps {
  progress: number;
  className?: string;
}

export function TossProgressBar({ progress, className = "" }: TossProgressBarProps) {
  return (
    <div className={`fixed top-0 left-0 w-full z-50 ${className}`}>
      <div className="h-1 bg-gray-200">
        <div 
          className="h-full bg-blue-500 transition-all duration-300 ease-out"
          style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
        />
      </div>
    </div>
  );
}