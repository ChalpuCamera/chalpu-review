import { FeedbackSlider } from '@/components/FeedbackSlider';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface PriceStepProps {
  value: number;
  priceReasonCategory: string;
  priceReasonText: string;
  onChange: (value: number) => void;
  onReasonCategoryChange: (category: string) => void;
  onReasonTextChange: (text: string) => void;
}

export function PriceStep({
  value,
  priceReasonCategory,
  priceReasonText,
  onChange,
  onReasonCategoryChange,
  onReasonTextChange
}: PriceStepProps) {
  const showPriceReason = Math.abs(value) > 0.5;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">비슷한 종류의 다른 음식과 비교했을 때, 가격은 어떻게 느끼셨나요?</h2>
      </div>
      
      <div className="p-4 rounded-lg bg-gray-50 border-l-4 border-gray-400">
        <p className="text-gray-800 font-medium">💰 가격 대비 만족도</p>
        <p className="text-gray-700 text-sm">비슷한 음식과 비교해서 평가해주세요</p>
      </div>
      
      <FeedbackSlider
        label=""
        leftLabel="훨씬 저렴함"
        rightLabel="훨씬 비쌈"
        value={value}
        onChange={onChange}
        onReset={() => onChange(0)}
        sliderColor="blue"
      />
      
      {showPriceReason && (
        <div className="space-y-4 mt-6 pt-6 border-t border-gray-200 bg-gray-25 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800">그렇게 느끼신 가장 큰 이유는 무엇인가요?</h3>
          <div className="space-y-2">
            {[
              { value: 'quantity', label: "음식의 '양'에 비해서" },
              { value: 'quality', label: "음식의 '맛과 품질'에 비해서" },
              { value: 'service', label: "가게의 '서비스나 분위기'에 비해서" },
              { value: 'other', label: '기타' }
            ].map((option) => (
              <Label key={option.value} className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-gray-100 rounded">
                <input
                  type="radio"
                  name="priceReason"
                  value={option.value}
                  checked={priceReasonCategory === option.value}
                  onChange={() => onReasonCategoryChange(option.value)}
                  className="w-4 h-4 text-gray-600"
                />
                <span>{option.label}</span>
              </Label>
            ))}
          </div>
          
          {priceReasonCategory === 'other' && (
            <Input
              placeholder="직접 입력해주세요"
              value={priceReasonText}
              onChange={(e) => onReasonTextChange(e.target.value)}
              className="border-gray-300 focus:border-gray-500"
            />
          )}
        </div>
      )}
    </div>
  );
}