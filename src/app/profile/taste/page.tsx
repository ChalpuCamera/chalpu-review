"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { TossProgressBar } from "@/components/TossProgressBar";
import { tasteProfileApi } from "@/lib/api";
import type { UserProfile } from "@/types";

const spicinessOptions = [
  { value: 1, label: "매운 음식은 거의 먹지 않아요. (0단계)" },
  { value: 2, label: "순두부찌개, 진라면 매운맛 정도 (1단계)" },
  { value: 3, label: "김치찌개, 신라면 정도 (2단계)" },
  { value: 4, label: "불닭볶음면, 엽기떡볶이 착한맛 정도 (3단계)" },
  {
    value: 5,
    label: "더 매운 음식도 즐겨요 (틈새라면, 엽기떡볶이 오리지널 등) (4단계)",
  },
];

const quantityOptions = [
  { value: 1, label: "0.7인분 이하 (조금만 먹어도 배불러요)" },
  { value: 2, label: "1인분 (딱 정량을 먹는 편이에요)" },
  { value: 3, label: "1.5인분 (든든하게 먹어야 만족스러워요)" },
  { value: 4, label: "2인분 이상 (누구보다 잘 먹을 자신이 있어요)" },
];

const priceOptions = [
  { value: 1, label: "8,000원 미만" },
  { value: 2, label: "8,000원 ~ 12,000원" },
  { value: 3, label: "12,000원 ~ 15,000원" },
  { value: 4, label: "15,000원 이상" },
];

export default function TasteProfilePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [error, setError] = useState("");

  const [profile, setProfile] = useState<UserProfile>({
    spicyLevel: -1,
    mealAmount: -1,
    mealSpending: -1,
  });

  const totalSteps = 3;
  const progress = isCompleted ? 100 : ((currentStep + 1) / totalSteps) * 100;

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.push("/api/login");
      return;
    }

    // 백엔드에서 기존 프로필 로드
    const loadProfile = async () => {
      try {
        const response = await tasteProfileApi.getTasteProfile();
        if (response.data.code === 200 && response.data.result) {
          setProfile(response.data.result);
          setIsEditing(true);
          // 수정 모드에서도 첫 번째 단계부터 시작하되 기존 답변이 선택된 상태로 시작
          setCurrentStep(0);
        } else {
          // 프로필이 없는 경우 (새로 생성하는 경우)
          console.log("기존 프로필이 없습니다. 새로 생성합니다.");
          setProfile({
            spicyLevel: -1,
            mealAmount: -1,
            mealSpending: -1,
          });
          setIsEditing(false);
        }
      } catch (error) {
        console.log("프로필 로드 실패:", error);
        // 에러 발생 시에도 새로 생성하는 모드로 설정
        setProfile({
          spicyLevel: -1,
          mealAmount: -1,
          mealSpending: -1,
        });
        setIsEditing(false);
      }
    };

    loadProfile();
  }, [router]);

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsCompleted(true);
      handleSubmit();
    }
  };

  const handlePrev = () => {
    if (isCompleted) {
      setIsCompleted(false);
    } else if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError("");

    try {
      // 백엔드 API로 프로필 저장
      const response = await tasteProfileApi.createOrUpdateTasteProfile({
        spicyLevel: profile.spicyLevel,
        mealAmount: profile.mealAmount,
        mealSpending: profile.mealSpending,
      });

      if (response.data.code === 200) {
        // localStorage에도 저장 (기존 코드 호환성을 위해)
        localStorage.setItem("userProfile", JSON.stringify(profile));

        setIsLoading(false);
        // 설문에서 온 경우 설문으로 돌아가기
        const returnUrl = sessionStorage.getItem("returnUrl");
        if (returnUrl) {
          sessionStorage.removeItem("returnUrl");
          router.push(returnUrl);
        } else {
          router.push("/profile");
        }
      } else {
        setError("프로필 저장에 실패했습니다.");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("프로필 저장 오류:", error);
      setError("프로필 저장 중 오류가 발생했습니다.");
      setIsLoading(false);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return profile.spicyLevel >= 0;
      case 1:
        return profile.mealAmount >= 0;
      case 2:
        return profile.mealSpending >= 0;
      default:
        return true;
    }
  };

  const renderQuestion = () => {
    if (isCompleted) {
      return (
        <div className="space-y-4 text-center">
          <h2 className="text-xl font-semibold">
            입맛 프로필이 완성되었습니다!
          </h2>
          <div className="space-y-3 text-left bg-gray-50 p-4 rounded-lg">
            <div>
              <strong>매운맛 선호도:</strong>{" "}
              {
                spicinessOptions.find((o) => o.value === profile.spicyLevel)
                  ?.label
              }
            </div>
            <div>
              <strong>식사량:</strong>{" "}
              {
                quantityOptions.find((o) => o.value === profile.mealAmount)
                  ?.label
              }
            </div>
            <div>
              <strong>점심 예산:</strong>{" "}
              {
                priceOptions.find((o) => o.value === profile.mealSpending)
                  ?.label
              }
            </div>
          </div>
          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}
        </div>
      );
    }

    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <h2 className="text-xl font-semibold">
                Q1. 평소 즐겨 드시는 매운맛은 어느 정도인가요?
              </h2>
            </div>
            <div className="space-y-3">
              {spicinessOptions.map((option) => (
                <Label
                  key={option.value}
                  className="flex items-center space-x-3 cursor-pointer p-3 border rounded-lg hover:bg-gray-100"
                >
                  <input
                    type="radio"
                    name="spicyLevel"
                    value={option.value}
                    checked={profile.spicyLevel === option.value}
                    onChange={() =>
                      setProfile({ ...profile, spicyLevel: option.value })
                    }
                    className="w-4 h-4 text-blue-600"
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
              <h2 className="text-xl font-semibold">
                Q2. 평소 식사량은 어느 정도이신가요? (1인분 기준)
              </h2>
            </div>
            <div className="space-y-3">
              {quantityOptions.map((option) => (
                <Label
                  key={option.value}
                  className="flex items-center space-x-3 cursor-pointer p-3 border rounded-lg hover:bg-gray-100"
                >
                  <input
                    type="radio"
                    name="mealAmount"
                    value={option.value}
                    checked={profile.mealAmount === option.value}
                    onChange={() =>
                      setProfile({ ...profile, mealAmount: option.value })
                    }
                    className="w-4 h-4 text-blue-600"
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
              <h2 className="text-xl font-semibold">
                Q3. 보통 점심 식사로 얼마를 지출하시나요? (1인분 기준)
              </h2>
            </div>
            <div className="space-y-3">
              {priceOptions.map((option) => (
                <Label
                  key={option.value}
                  className="flex items-center space-x-3 cursor-pointer p-3 border rounded-lg hover:bg-gray-100"
                >
                  <input
                    type="radio"
                    name="mealSpending"
                    value={option.value}
                    checked={profile.mealSpending === option.value}
                    onChange={() =>
                      setProfile({ ...profile, mealSpending: option.value })
                    }
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="flex-1">{option.label}</span>
                </Label>
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <>
      <TossProgressBar progress={progress} />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          {/* 홈 버튼 */}
          <div className="mb-4 flex justify-between items-center">
            <Button
              variant="outline"
              onClick={() => router.push("/")}
              className="flex items-center gap-2"
            >
              🏠 홈으로
            </Button>
          </div>

          <Card>
            <CardHeader className="text-center">
              <CardTitle>
                {isEditing ? "입맛 프로필 수정" : "당신의 입맛 알아보기"}
              </CardTitle>
              <CardDescription>
                개인 맞춤 피드백을 위해 기본 취향을 알려주세요
              </CardDescription>

              {/* 피드백 작성 전 필수 안내 */}
              {!isEditing && (
                <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm">
                  <div className="flex items-start gap-2">
                    <span className="text-amber-500">⚠️</span>
                    <div className="text-amber-800">
                      <p className="font-medium">
                        피드백 작성을 위해 입맛 프로필 설정이 필요합니다
                      </p>
                      <p className="text-xs mt-1">
                        개인 맞춤형 질문을 제공하기 위해 먼저 취향을 알려주세요!
                      </p>
                    </div>
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <Progress value={progress} className="w-full" />
                <p className="text-sm text-gray-500">
                  {isCompleted ? `완료` : `${currentStep + 1} / ${totalSteps}`}
                </p>
              </div>
            </CardHeader>

            <CardContent>
              {renderQuestion()}

              <div className="flex justify-between mt-8">
                <Button
                  variant="outline"
                  onClick={handlePrev}
                  disabled={currentStep === 0 && !isCompleted && !isEditing}
                >
                  이전
                </Button>

                <Button
                  onClick={handleNext}
                  disabled={(!isStepValid() || isLoading) && !isCompleted}
                  className={`transition-all duration-300 ${
                    (!isStepValid() || isLoading) && !isCompleted
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg transform hover:scale-105"
                  }`}
                >
                  {isCompleted
                    ? isEditing
                      ? "수정 완료"
                      : "완료"
                    : isLoading
                    ? "저장 중..."
                    : currentStep < totalSteps - 1
                    ? "다음"
                    : "완료"}
                </Button>
              </div>

              {isEditing && currentStep < 3 && (
                <div className="text-center mt-4">
                  <Button
                    variant="ghost"
                    onClick={() => router.push("/profile")}
                  >
                    취소
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
