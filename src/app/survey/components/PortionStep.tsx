import { FeedbackSlider } from '@/components/FeedbackSlider';
import type { UserProfile } from '@/types';

interface PortionStepProps {
  userProfile: UserProfile | null;
  value: number;
  onChange: (value: number) => void;
}

export function PortionStep({ userProfile, value, onChange }: PortionStepProps) {
  const title = userProfile ? 
    `평소 드시는 양(${['0.7인분', '1인분', '1.5인분', '2인분 이상'][userProfile.portionSize]})을 기준으로, 오늘 음식의 양은 어떠셨나요?` :
    '오늘 음식의 양은 어떠셨나요?';

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
      </div>
      
      <div className="p-4 rounded-lg bg-gray-50 border-l-4 border-gray-400">
        <p className="text-gray-800 font-medium">🍽️ 양에 대한 평가</p>
        <p className="text-gray-700 text-sm">개인차가 있을 수 있으니 솔직하게 답해주세요</p>
      </div>
      
      <FeedbackSlider
        label=""
        leftLabel="훨씬 적었음"
        rightLabel="훨씬 많았음"
        value={value}
        onChange={onChange}
        onReset={() => onChange(0)}
        sliderColor="blue"
      />
    </div>
  );
}