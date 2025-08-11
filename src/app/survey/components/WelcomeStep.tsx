interface WelcomeStepProps {
  restaurantName: string;
  menuName: string;
}

export function WelcomeStep({ restaurantName, menuName }: WelcomeStepProps) {
  return (
    <div className="text-center space-y-4">
      <div className="text-6xl">🍜</div>
      <h2 className="text-2xl font-bold">{restaurantName} 사장님이 당신의 솔직한 피드백을 애타게 기다리고 있어요!</h2>
      <p className="text-gray-600">
        오늘 식사는 어떠셨나요? 당신의 소중한 1분은 이 가게가 더 맛있어지는 데 큰 힘이 됩니다.
      </p>
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