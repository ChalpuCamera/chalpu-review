import { EnhancedSlider } from '@/components/ui/enhanced-slider';
import { Label } from '@/components/ui/label';

interface RecommendationStepProps {
  recommendationScore: number;
  reorderScore: number;
  onRecommendationChange: (score: number) => void;
  onReorderChange: (score: number) => void;
}

export function RecommendationStep({
  recommendationScore,
  reorderScore,
  onRecommendationChange,
  onReorderChange
}: RecommendationStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">거의 다 왔어요! 마지막 의견을 들려주세요.</h2>
      </div>
      
      <div className="p-4 rounded-lg bg-gray-50 border-l-4 border-gray-400">
        <p className="text-gray-800 font-medium">⭐ 추천 및 재주문 의향</p>
        <p className="text-gray-700 text-sm">솔직한 점수를 매겨주세요</p>
      </div>
      
      <div className="space-y-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <Label className="text-base font-semibold text-gray-800">
            이 음식을 다른 사람에게 추천할 의향이 얼마나 있으신가요?
          </Label>
          <div className="mt-4 space-y-2">
            <EnhancedSlider
              value={[recommendationScore]}
              onValueChange={(val) => onRecommendationChange(val[0])}
              min={0}
              max={10}
              step={1}
              className="w-full"
              trackColor="bg-blue-100"
              thumbColor="bg-blue-600"
              activeTrackColor="bg-blue-500"
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>0점 (절대 안함)</span>
              <span className="font-semibold text-gray-600 text-lg">{recommendationScore}점</span>
              <span>10점 (무조건 추천)</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <Label className="text-base font-semibold text-gray-800">
            이 가게에서 이 메뉴를 다시 주문할 의향이 얼마나 있으신가요?
          </Label>
          <div className="mt-4 space-y-2">
            <EnhancedSlider
              value={[reorderScore]}
              onValueChange={(val) => onReorderChange(val[0])}
              min={0}
              max={10}
              step={1}
              className="w-full"
              trackColor="bg-blue-100"
              thumbColor="bg-blue-600"
              activeTrackColor="bg-blue-500"
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>0점 (절대 안함)</span>
              <span className="font-semibold text-gray-600 text-lg">{reorderScore}점</span>
              <span>10점 (무조건 다시 주문)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}