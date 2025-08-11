import { Label } from '@/components/ui/label';

interface FinalStepProps {
  improvementSuggestion: string;
  overallSatisfaction: number;
  onImprovementChange: (text: string) => void;
  onSatisfactionChange: (score: number) => void;
}

export function FinalStep({
  improvementSuggestion,
  overallSatisfaction,
  onImprovementChange,
  onSatisfactionChange
}: FinalStepProps) {
  return (
    <div className="space-y-6">
      <div className="p-4 rounded-lg bg-gray-50 border-l-4 border-gray-400">
        <p className="text-gray-800 font-medium">💬 마지막 한마디</p>
        <p className="text-gray-700 text-sm">사장님께 전하는 소중한 조언</p>
      </div>
      
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <Label className="text-base font-semibold text-gray-800">
          사장님께 딱 한 가지만 이야기할 수 있다면, 어떤 말을 해주고 싶으신가요?
        </Label>
        <p className="text-sm text-gray-600 mt-1 mb-4">
          &ldquo;이 음식이 &lsquo;인생 메뉴&rsquo;가 되려면, 어떤 점이 더해지면 좋을까요? 사장님께 살짝 팁을 알려주세요!&rdquo;
        </p>
        <textarea
          placeholder="30자 이상 입력해주세요"
          className="w-full min-h-[120px] p-3 border border-gray-300 rounded-md resize-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
          value={improvementSuggestion}
          onChange={(e) => onImprovementChange(e.target.value)}
        />
        <div className={`text-sm text-right mt-1 ${improvementSuggestion.length >= 30 ? 'text-green-600' : 'text-gray-500'}`}>
          {improvementSuggestion.length}/30자 이상
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <Label className="text-base font-semibold text-gray-800">
          오늘 식사 경험에 대해 전체적으로 얼마나 만족하시나요?
        </Label>
        <div className="mt-4 space-y-3">
          {[
            { value: 1, label: '매우 불만족', color: 'text-red-600' },
            { value: 2, label: '불만족', color: 'text-orange-600' },
            { value: 3, label: '보통', color: 'text-gray-600' },
            { value: 4, label: '만족', color: 'text-blue-600' },
            { value: 5, label: '매우 만족', color: 'text-green-600' }
          ].map((option) => (
            <Label key={option.value} className={`flex items-center space-x-3 cursor-pointer p-2 rounded hover:bg-gray-50 ${overallSatisfaction === option.value ? 'bg-gray-100 border border-gray-300' : ''}`}>
              <input
                type="radio"
                name="satisfaction"
                value={option.value}
                checked={overallSatisfaction === option.value}
                onChange={() => onSatisfactionChange(option.value)}
                className="w-4 h-4 text-gray-600"
              />
              <span className={`font-medium ${option.color}`}>{option.label}</span>
            </Label>
          ))}
        </div>
      </div>
    </div>
  );
}