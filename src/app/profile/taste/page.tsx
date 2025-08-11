'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import type { UserProfile } from '@/types';

const spicinessOptions = [
  { value: 0, label: '매운 음식은 거의 먹지 않아요. (0단계)' },
  { value: 1, label: '순두부찌개, 진라면 매운맛 정도 (1단계)' },
  { value: 2, label: '김치찌개, 신라면 정도 (2단계)' },
  { value: 3, label: '불닭볶음면, 엽기떡볶이 착한맛 정도 (3단계)' },
  { value: 4, label: '더 매운 음식도 즐겨요 (틈새라면, 엽기떡볶이 오리지널 등) (4단계)' }
];

const quantityOptions = [
  { value: 0, label: '0.7인분 이하 (조금만 먹어도 배불러요)' },
  { value: 1, label: '1인분 (딱 정량을 먹는 편이에요)' },
  { value: 2, label: '1.5인분 (든든하게 먹어야 만족스러워요)' },
  { value: 3, label: '2인분 이상 (누구보다 잘 먹을 자신이 있어요)' }
];

const priceOptions = [
  { value: 0, label: '8,000원 미만' },
  { value: 1, label: '8,000원 ~ 12,000원' },
  { value: 2, label: '12,000원 ~ 15,000원' },
  { value: 3, label: '15,000원 이상' }
];

export default function TasteProfilePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  
  const [profile, setProfile] = useState<UserProfile>({
    spiceLevel: -1,
    portionSize: -1,
    priceRange: -1
  });

  const totalSteps = 3;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    // TODO: Load existing profile from API
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
      setIsEditing(true);
      setCurrentStep(3);
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
    setIsLoading(true);
    setError('');

    try {
      // TODO: Save to API
      localStorage.setItem('userProfile', JSON.stringify(profile));
      
      setTimeout(() => {
        setIsLoading(false);
        router.push('/profile');
      }, 1000);
    } catch {
      setError('프로필 저장 중 오류가 발생했습니다.');
      setIsLoading(false);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0: return profile.spiceLevel >= 0;
      case 1: return profile.portionSize >= 0;
      case 2: return profile.priceRange >= 0;
      default: return true;
    }
  };

  const renderQuestion = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <h2 className="text-xl font-semibold">Q1. 평소 즐겨 드시는 매운맛은 어느 정도인가요?</h2>
            </div>
            <div className="space-y-3">
              {spicinessOptions.map((option) => (
                <Label key={option.value} className="flex items-center space-x-3 cursor-pointer p-3 border rounded-lg hover:bg-gray-50">
                  <input
                    type="radio"
                    name="spiceLevel"
                    value={option.value}
                    checked={profile.spiceLevel === option.value}
                    onChange={() => setProfile({ ...profile, spiceLevel: option.value })}
                    className="w-4 h-4"
                  />
                  <span className="flex-1">{option.label}</span>
                </Label>
              ))}
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <h2 className="text-xl font-semibold">Q2. 평소 식사량은 어느 정도이신가요? (1인분 기준)</h2>
            </div>
            <div className="space-y-3">
              {quantityOptions.map((option) => (
                <Label key={option.value} className="flex items-center space-x-3 cursor-pointer p-3 border rounded-lg hover:bg-gray-50">
                  <input
                    type="radio"
                    name="portionSize"
                    value={option.value}
                    checked={profile.portionSize === option.value}
                    onChange={() => setProfile({ ...profile, portionSize: option.value })}
                    className="w-4 h-4"
                  />
                  <span className="flex-1">{option.label}</span>
                </Label>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <h2 className="text-xl font-semibold">Q3. 보통 점심 식사로 얼마를 지출하시나요?</h2>
            </div>
            <div className="space-y-3">
              {priceOptions.map((option) => (
                <Label key={option.value} className="flex items-center space-x-3 cursor-pointer p-3 border rounded-lg hover:bg-gray-50">
                  <input
                    type="radio"
                    name="priceRange"
                    value={option.value}
                    checked={profile.priceRange === option.value}
                    onChange={() => setProfile({ ...profile, priceRange: option.value })}
                    className="w-4 h-4"
                  />
                  <span className="flex-1">{option.label}</span>
                </Label>
              ))}
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-4 text-center">
            <h2 className="text-xl font-semibold">입맛 프로필이 완성되었습니다!</h2>
            <div className="space-y-3 text-left bg-gray-50 p-4 rounded-lg">
              <div><strong>매운맛 선호도:</strong> {spicinessOptions.find(o => o.value === profile.spiceLevel)?.label}</div>
              <div><strong>식사량:</strong> {quantityOptions.find(o => o.value === profile.portionSize)?.label}</div>
              <div><strong>점심 예산:</strong> {priceOptions.find(o => o.value === profile.priceRange)?.label}</div>
            </div>
            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                {error}
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Card>
          <CardHeader className="text-center">
            <CardTitle>{isEditing ? '입맛 프로필 수정' : '당신의 입맛 알아보기'}</CardTitle>
            <CardDescription>
              개인 맞춤 피드백을 위해 기본 취향을 알려주세요
            </CardDescription>
            <div className="space-y-2">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-gray-500">{currentStep + 1} / {totalSteps}</p>
            </div>
          </CardHeader>
          
          <CardContent>
            {renderQuestion()}
            
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handlePrev}
                disabled={currentStep === 0 && !isEditing}
              >
                이전
              </Button>
              
              <Button
                onClick={handleNext}
                disabled={!isStepValid() || isLoading}
              >
                {isLoading ? '저장 중...' : 
                 currentStep < totalSteps - 1 ? '다음' : 
                 isEditing ? '수정 완료' : '완료'}
              </Button>
            </div>
            
            {isEditing && currentStep < 3 && (
              <div className="text-center mt-4">
                <Button variant="ghost" onClick={() => router.push('/profile')}>
                  취소
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}