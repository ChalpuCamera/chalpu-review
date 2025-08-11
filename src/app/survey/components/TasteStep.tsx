import { Label } from '@/components/ui/label';
import { FeedbackSlider } from '@/components/FeedbackSlider';

interface TasteStepProps {
  title: string;
  leftLabel: string;
  rightLabel: string;
  value: number;
  skipFlag: boolean;
  onChange: (value: number) => void;
  onSkip: () => void;
}

export function TasteStep({
  title,
  leftLabel,
  rightLabel,
  value,
  skipFlag,
  onChange,
  onSkip
}: TasteStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
      </div>
      
      <div className="p-4 rounded-lg bg-gray-50 border-l-4 border-gray-400">
        <Label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={skipFlag}
            onChange={onSkip}
            className="w-4 h-4"
          />
          <span>판단이 불가한 음식은 체크해 주세요</span>
        </Label>
      </div>
      
      {!skipFlag && (
        <FeedbackSlider
          label=""
          leftLabel={leftLabel}
          rightLabel={rightLabel}
          value={value}
          onChange={onChange}
          onReset={() => onChange(0)}
          sliderColor="blue"
        />
      )}
    </div>
  );
}