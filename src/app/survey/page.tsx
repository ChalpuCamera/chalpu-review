'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { feedbackApi } from '@/lib/api';
import { FeedbackSlider } from '@/components/FeedbackSlider';
import type { UserProfile, SliderValue, SurveyAnswer } from '@/types';

function SurveyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const restaurantName = searchParams.get('restaurant') || '맛집';
  const menuName = searchParams.get('menu') || '음식';
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  
  const [sliderValues, setSliderValues] = useState<SliderValue>({
    spice: 0,
    sweet: 0,
    salt: 0,
    sour: 0,
    portion: 0,
    price: 0
  });

  const [surveyData, setSurveyData] = useState({
    priceReasonCategory: '',
    priceReasonText: '',
    recommendationScore: 5,
    reorderScore: 5,
    improvementSuggestion: '',
    overallSatisfaction: 3
  });

  const [skipFlags, setSkipFlags] = useState({
    spice: false,
    sweet: false,
    salt: false,
    sour: false
  });

  const totalSteps = 9;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    
    if (token) {
      const savedProfile = localStorage.getItem('userProfile');
      if (savedProfile) {
        setUserProfile(JSON.parse(savedProfile));
      }
    }
  }, [router]);

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('accessToken');
    setIsLoading(true);
    setError('');

    try {
      if (token) {
        // Build survey answers
        const surveyAnswers: SurveyAnswer[] = [];
        
        if (!skipFlags.spice) {
          surveyAnswers.push({ questionId: 1, numericValue: sliderValues.spice });
        }
        if (!skipFlags.sweet) {
          surveyAnswers.push({ questionId: 2, numericValue: sliderValues.sweet });
        }
        if (!skipFlags.salt) {
          surveyAnswers.push({ questionId: 3, numericValue: sliderValues.salt });
        }
        if (!skipFlags.sour) {
          surveyAnswers.push({ questionId: 4, numericValue: sliderValues.sour });
        }
        surveyAnswers.push({ questionId: 5, numericValue: sliderValues.portion });
        surveyAnswers.push({ questionId: 6, numericValue: sliderValues.price });
        surveyAnswers.push({ questionId: 7, numericValue: surveyData.recommendationScore });
        surveyAnswers.push({ questionId: 8, numericValue: surveyData.reorderScore });
        surveyAnswers.push({ questionId: 9, answerText: surveyData.improvementSuggestion });
        surveyAnswers.push({ questionId: 10, numericValue: surveyData.overallSatisfaction });

        const response = await feedbackApi.create({
          foodId: 1, // TODO: Get from real data
          storeId: 1, // TODO: Get from real data
          surveyId: 1, // TODO: Get from real data
          surveyAnswers,
          photoS3Keys: [] // TODO: Implement photo upload
        });
        
        if (response.data.code === 0) {
          router.push('/survey/complete?restaurant=' + encodeURIComponent(restaurantName));
        } else {
          setError('피드백 제출에 실패했습니다.');
        }
      } else {
        // Redirect to login if not authenticated
        router.push('/api/login');
        return;
      }
    } catch {
      setError('피드백 제출 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };


  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="text-center space-y-4">
            <div className="text-6xl">🍜</div>
            <h2 className="text-2xl font-bold">{restaurantName} 사장님이 당신의 솔직한 피드백을 애타게 기다리고 있어요!</h2>
            <p className="text-gray-600">
              오늘 식사는 어떠셨나요? 당신의 소중한 1분은 이 가게가 더 맛있어지는 데 큰 힘이 됩니다.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg text-sm">
              <p><strong>💝 {restaurantName} 사장님이 간절히 기다리고 있어요!</strong></p>
              <p>&ldquo;{menuName}을 드신 분이 정말 어떻게 느끼셨을까?&rdquo;</p>
              <p>&ldquo;우리 음식이 손님 마음에 들었을까?&rdquo;</p>
              <br />
              <p>사장님은 아무도 모르는 곳에서 정성껏 요리하고 계세요.</p>
              <p>당신의 솔직한 한 마디가 이 가게를 더 맛있게 만들어요! 😊</p>
              <br />
              <p className="text-xs text-gray-500">
                ※ 이 피드백은 사장님만 보실 수 있습니다 (완전 익명)<br />
                ※ 지금까지 이 가게는 많은 소중한 피드백을 받았어요
              </p>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">
                {userProfile ? 
                  `평소 드시는 맵기(${['안 매움', '1단계', '2단계', '3단계', '4단계'][userProfile.spiceLevel]})를 기준으로, 오늘 드신 음식의 맵기는 어떠셨나요?` :
                  '오늘 드신 음식의 맵기는 어떠셨나요?'
                }
              </h2>
            </div>
            
            <Label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={skipFlags.spice}
                onChange={() => setSkipFlags({...skipFlags, spice: !skipFlags.spice})}
                className="w-4 h-4"
              />
              <span>판단이 불가한 음식은 체크 안해도 됩니다</span>
            </Label>
            
            {!skipFlags.spice && (
              <FeedbackSlider
                label=""
                leftLabel="훨씬 덜 매움"
                rightLabel="훨씬 더 매움"
                value={sliderValues.spice}
                onChange={(val) => setSliderValues({...sliderValues, spice: val})}
                onReset={() => setSliderValues({...sliderValues, spice: 0})}
              />
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">오늘 드신 음식의 달기는 어떠셨나요?</h2>
            </div>
            
            <Label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={skipFlags.sweet}
                onChange={() => setSkipFlags({...skipFlags, sweet: !skipFlags.sweet})}
                className="w-4 h-4"
              />
              <span>판단이 불가한 음식은 체크 안해도 됩니다</span>
            </Label>
            
            {!skipFlags.sweet && (
              <FeedbackSlider
                label=""
                leftLabel="단맛 거의 없음"
                rightLabel="많이 달콤함"
                value={sliderValues.sweet}
                onChange={(val) => setSliderValues({...sliderValues, sweet: val})}
                onReset={() => setSliderValues({...sliderValues, sweet: 0})}
              />
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">오늘 드신 음식의 간은 어떠셨나요?</h2>
            </div>
            
            <Label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={skipFlags.salt}
                onChange={() => setSkipFlags({...skipFlags, salt: !skipFlags.salt})}
                className="w-4 h-4"
              />
              <span>판단이 불가한 음식은 체크 안해도 됩니다</span>
            </Label>
            
            {!skipFlags.salt && (
              <FeedbackSlider
                label=""
                leftLabel="많이 싱거움"
                rightLabel="많이 짬"
                value={sliderValues.salt}
                onChange={(val) => setSliderValues({...sliderValues, salt: val})}
                onReset={() => setSliderValues({...sliderValues, salt: 0})}
              />
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">오늘 드신 음식의 신맛은 어떠셨나요?</h2>
            </div>
            
            <Label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={skipFlags.sour}
                onChange={() => setSkipFlags({...skipFlags, sour: !skipFlags.sour})}
                className="w-4 h-4"
              />
              <span>판단이 불가한 음식은 체크 안해도 됩니다</span>
            </Label>
            
            {!skipFlags.sour && (
              <FeedbackSlider
                label=""
                leftLabel="신맛 거의 없음"
                rightLabel="많이 신"
                value={sliderValues.sour}
                onChange={(val) => setSliderValues({...sliderValues, sour: val})}
                onReset={() => setSliderValues({...sliderValues, sour: 0})}
              />
            )}
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">
                {userProfile ? 
                  `평소 드시는 양(${['0.7인분', '1인분', '1.5인분', '2인분 이상'][userProfile.portionSize]})을 기준으로, 오늘 음식의 양은 어떠셨나요?` :
                  '오늘 음식의 양은 어떠셨나요?'
                }
              </h2>
            </div>
            
            <FeedbackSlider
              label=""
              leftLabel="훨씬 적었음"
              rightLabel="훨씬 많았음"
              value={sliderValues.portion}
              onChange={(val) => setSliderValues({...sliderValues, portion: val})}
              onReset={() => setSliderValues({...sliderValues, portion: 0})}
            />
          </div>
        );

      case 6:
        const showPriceReason = Math.abs(sliderValues.price) > 0.5;
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">비슷한 종류의 다른 음식과 비교했을 때, 가격은 어떻게 느끼셨나요?</h2>
            </div>
            
            <FeedbackSlider
              label=""
              leftLabel="훨씬 저렴함"
              rightLabel="훨씬 비쌈"
              value={sliderValues.price}
              onChange={(val) => setSliderValues({...sliderValues, price: val})}
              onReset={() => setSliderValues({...sliderValues, price: 0})}
            />
            
            {showPriceReason && (
              <div className="space-y-4 mt-6 pt-6 border-t">
                <h3 className="text-lg font-semibold">그렇게 느끼신 가장 큰 이유는 무엇인가요?</h3>
                <div className="space-y-2">
                  {[
                    { value: 'quantity', label: "음식의 '양'에 비해서" },
                    { value: 'quality', label: "음식의 '맛과 품질'에 비해서" },
                    { value: 'service', label: "가게의 '서비스나 분위기'에 비해서" },
                    { value: 'other', label: '기타' }
                  ].map((option) => (
                    <Label key={option.value} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="priceReason"
                        value={option.value}
                        checked={surveyData.priceReasonCategory === option.value}
                        onChange={() => setSurveyData({...surveyData, priceReasonCategory: option.value})}
                        className="w-4 h-4"
                      />
                      <span>{option.label}</span>
                    </Label>
                  ))}
                </div>
                
                {surveyData.priceReasonCategory === 'other' && (
                  <Input
                    placeholder="직접 입력해주세요"
                    value={surveyData.priceReasonText}
                    onChange={(e) => setSurveyData({...surveyData, priceReasonText: e.target.value})}
                  />
                )}
              </div>
            )}
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">거의 다 왔어요! 마지막 의견을 들려주세요.</h2>
              <div className="text-sm text-gray-500">
                진행률 바: 90% 진행
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <Label className="text-base font-semibold">
                  이 음식을 다른 사람에게 추천할 의향이 얼마나 있으신가요? (0점: 절대 안 함 ~ 10점: 무조건 추천)
                </Label>
                <div className="mt-4 space-y-2">
                  <Slider
                    value={[surveyData.recommendationScore]}
                    onValueChange={(val) => setSurveyData({...surveyData, recommendationScore: val[0]})}
                    min={0}
                    max={10}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>0점 (절대 안함)</span>
                    <span className="font-semibold">{surveyData.recommendationScore}점</span>
                    <span>10점 (무조건 추천)</span>
                  </div>
                </div>
              </div>
              
              <div>
                <Label className="text-base font-semibold">
                  이 가게에서 이 메뉴를 다시 주문할 의향이 얼마나 있으신가요? (0점: 절대 안 함 ~ 10점: 무조건 다시 주문)
                </Label>
                <div className="mt-4 space-y-2">
                  <Slider
                    value={[surveyData.reorderScore]}
                    onValueChange={(val) => setSurveyData({...surveyData, reorderScore: val[0]})}
                    min={0}
                    max={10}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>0점 (절대 안함)</span>
                    <span className="font-semibold">{surveyData.reorderScore}점</span>
                    <span>10점 (무조건 다시 주문)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 8:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-semibold">
                사장님께 딱 한 가지만 이야기할 수 있다면, 어떤 말을 해주고 싶으신가요?
              </Label>
              <p className="text-sm text-gray-600 mt-1 mb-4">
                &ldquo;이 음식이 &lsquo;인생 메뉴&rsquo;가 되려면, 어떤 점이 더해지면 좋을까요? 사장님께 살짝 팁을 알려주세요!&rdquo;
              </p>
              <textarea
                placeholder="30자 이상 입력해주세요"
                className="w-full min-h-[120px] p-3 border rounded-md resize-none"
                value={surveyData.improvementSuggestion}
                onChange={(e) => setSurveyData({...surveyData, improvementSuggestion: e.target.value})}
              />
              <div className="text-sm text-gray-500 text-right">
                {surveyData.improvementSuggestion.length}/30자 이상
              </div>
            </div>
            
            <div>
              <Label className="text-base font-semibold">
                오늘 식사 경험에 대해 전체적으로 얼마나 만족하시나요?
              </Label>
              <div className="mt-4 space-y-3">
                {[
                  { value: 1, label: '매우 불만족' },
                  { value: 2, label: '불만족' },
                  { value: 3, label: '보통' },
                  { value: 4, label: '만족' },
                  { value: 5, label: '매우 만족' }
                ].map((option) => (
                  <Label key={option.value} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="satisfaction"
                      value={option.value}
                      checked={surveyData.overallSatisfaction === option.value}
                      onChange={() => setSurveyData({...surveyData, overallSatisfaction: option.value})}
                      className="w-4 h-4"
                    />
                    <span>{option.label}</span>
                  </Label>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return <div>완료</div>;
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0: return true;
      case 1: return skipFlags.spice || sliderValues.spice !== 0;
      case 2: return skipFlags.sweet || sliderValues.sweet !== 0;
      case 3: return skipFlags.salt || sliderValues.salt !== 0;
      case 4: return skipFlags.sour || sliderValues.sour !== 0;
      case 5: return true;
      case 6: 
        if (Math.abs(sliderValues.price) > 0.5) {
          return surveyData.priceReasonCategory && 
            (surveyData.priceReasonCategory !== 'other' || surveyData.priceReasonText.length > 0);
        }
        return true;
      case 7: return true;
      case 8: return surveyData.improvementSuggestion.length >= 30;
      default: return true;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Card>
          <CardHeader className="text-center">
            <CardTitle>피드백 설문</CardTitle>
            <CardDescription>
              {restaurantName} - {menuName}
            </CardDescription>
            <div className="space-y-2">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-gray-500">{currentStep + 1} / {totalSteps}</p>
            </div>
          </CardHeader>
          
          <CardContent>
            {renderStep()}
            
            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md mt-4">
                {error}
              </div>
            )}
            
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handlePrev}
                disabled={currentStep === 0}
              >
                이전
              </Button>
              
              <Button
                onClick={handleNext}
                disabled={!isStepValid() || isLoading}
              >
                {isLoading ? '제출 중...' : 
                 currentStep < totalSteps - 1 ? '다음' : '피드백 완료'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function SurveyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">로딩 중...</div>}>
      <SurveyContent />
    </Suspense>
  );
}