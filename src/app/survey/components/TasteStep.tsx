import { Label } from '@/components/ui/label';
import { FeedbackSlider } from '@/components/FeedbackSlider';
import type { UserProfile } from '@/types';

interface TasteStepProps {
  title: string;
  leftLabel: string;
  rightLabel: string;
  value: number;
  skipFlag: boolean;
  onChange: (value: number) => void;
  onSkip: () => void;
  userProfile?: UserProfile | null;
  profileType?: 'spicy' | 'sweet' | 'salt' | 'sour';
}

export function TasteStep({
  title,
  leftLabel,
  rightLabel,
  value,
  skipFlag,
  onChange,
  onSkip,
  userProfile,
  profileType
}: TasteStepProps) {
  const getProfileDisplay = () => {
    if (!userProfile || !profileType) return null;
    
    const spicinessLabels = ['안 매움', '1단계', '2단계', '3단계', '4단계'];
    
    if (profileType === 'spicy') {
      return `당신의 평소 매운맛 선호도: ${spicinessLabels[userProfile.spicyLevel - 1]}`;
    }
    
    // 다른 맛은 일반적인 메시지
    return '오늘 드신 음식의 맛을 기준으로 평가해주세요';
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
      </div>

      {/* 입맛 프로필 표시 */}
      {userProfile && profileType && (
        <div className="p-3 rounded-lg bg-blue-50 border-l-4 border-blue-400">
          <p className="text-blue-800 text-sm font-medium">
            📊 {getProfileDisplay()}
          </p>
        </div>
      )}
      
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