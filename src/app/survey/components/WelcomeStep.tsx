import type { UserProfile } from "@/types";

interface WelcomeStepProps {
  restaurantName: string;
  menuName: string;
  userProfile: UserProfile | null;
}

export function WelcomeStep({ restaurantName, menuName, userProfile }: WelcomeStepProps) {
  const spicinessLabels = ['안 매움', '1단계', '2단계', '3단계', '4단계'];
  const portionLabels = ['0.7인분', '1인분', '1.5인분', '2인분 이상'];
  const priceLabels = ['8,000원 미만', '8,000원~12,000원', '12,000원~15,000원', '15,000원 이상'];

  return (
    <div className="text-center space-y-4">
      <div className="text-6xl">🍜</div>
      <h2 className="text-2xl font-bold">{restaurantName} 사장님이 당신의 솔직한 피드백을 애타게 기다리고 있어요!</h2>
      <p className="text-gray-600">
        오늘 식사는 어떠셨나요? 당신의 소중한 1분은 이 가게가 더 맛있어지는 데 큰 힘이 됩니다.
      </p>
      
      {userProfile && (
        <div className="bg-green-50 p-4 rounded-lg text-sm border-l-4 border-green-400">
          <p className="font-medium text-green-800 mb-2">📊 당신의 입맛 프로필</p>
          <div className="space-y-1 text-green-700">
            <p>• 매운맛 선호도: {spicinessLabels[userProfile.spiceLevel]}</p>
            <p>• 평소 식사량: {portionLabels[userProfile.portionSize]}</p>
            <p>• 점심 예산대: {priceLabels[userProfile.priceRange]}</p>
          </div>
          <p className="text-xs text-green-600 mt-2">위 정보를 바탕으로 개인화된 질문을 드릴게요!</p>
        </div>
      )}
      <div className="bg-blue-50 p-4 rounded-lg text-sm border-l-4 border-blue-400">
        <p><strong>💝 {restaurantName} 사장님이 간절히 기다리고 있어요!</strong></p>
        <p>&ldquo;{menuName}을 드신 분이 정말 어떻게 느끼셨을까?&rdquo;</p>
        <p>&ldquo;우리 음식이 손님 마음에 들었을까?&rdquo;</p>
        <br />
        <p>사장님은 아무도 모르는 곳에서 정성껏 요리하고 계세요.</p>
        <p>당신의 솔직한 한 마디가 이 가게를 더 맛있게 만들어요! 😊</p>
        <br />
        <p className="text-xs text-gray-500">
          ※ 이 피드백은 사장님만 보실 수 있습니다 (완전 익명)<br />
          ※ 지금까지 이 가게는 많은 소중한 피드백을 받았어요<br />
          ※ 새로고침하면 답변이 초기화되니 주의해 주세요
        </p>
      </div>
    </div>
  );
}