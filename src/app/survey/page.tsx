"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { feedbackApi, tasteProfileApi } from "@/lib/api";
import type { UserProfile, SliderValue, SurveyAnswer } from "@/types";
import { SurveyLayout } from "./components/SurveyLayout";
import { WelcomeStep } from "./components/WelcomeStep";
import { TasteStep } from "./components/TasteStep";
import { PortionStep } from "./components/PortionStep";
import { PriceStep } from "./components/PriceStep";
import { RecommendationStep } from "./components/RecommendationStep";
import { FinalStep } from "./components/FinalStep";
import { TossProgressBar } from "@/components/TossProgressBar";
import { toast } from "@/components/ui/toast";

function SurveyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const restaurantName = searchParams.get("restaurant") || "맛집";
  const menuName = searchParams.get("menu") || "음식";

  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const [sliderValues, setSliderValues] = useState<SliderValue>({
    spice: 0,
    sweet: 0,
    salt: 0,
    sour: 0,
    portion: 0,
    price: 0,
  });

  const [surveyData, setSurveyData] = useState({
    priceReasonCategory: "",
    priceReasonText: "",
    recommendationScore: 5,
    reorderScore: 5,
    improvementSuggestion: "",
    overallSatisfaction: 3,
  });

  const [skipFlags, setSkipFlags] = useState({
    spice: false,
    sweet: false,
    salt: false,
    sour: false,
  });

  const totalSteps = 9;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      // 백엔드에서 프로필 로드
      const loadProfile = async () => {
        try {
          const response = await tasteProfileApi.getTasteProfile();
          if (response.data.code === 200 && response.data.result) {
            const profile = response.data.result;
            // 프로필이 완전히 설정되어 있는지 확인
            if (
              profile.spicyLevel >= 0 &&
              profile.mealAmount >= 0 &&
              profile.mealSpending >= 0
            ) {
              setUserProfile(profile);
            } else {
              // 프로필이 완전하지 않으면 프로필 설정 페이지로 리다이렉트
              sessionStorage.setItem("returnUrl", window.location.href);
              router.push("/profile/taste");
              return;
            }
          } else {
            // 프로필이 없으면 프로필 설정 페이지로 리다이렉트
            sessionStorage.setItem("returnUrl", window.location.href);
            router.push("/profile/taste");
            return;
          }
        } catch (error) {
          console.log("프로필 로드 실패:", error);
          // 프로필 로드에 실패하면 프로필 설정 페이지로 리다이렉트
          sessionStorage.setItem("returnUrl", window.location.href);
          router.push("/profile/taste");
          return;
        }
      };

      loadProfile();
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
    const token = localStorage.getItem("accessToken");
    setIsLoading(true);
    setError("");
    console.log(token);

    try {
      if (token) {
        // Build survey answers
        const surveyAnswers: SurveyAnswer[] = [];

        surveyAnswers.push({
          questionId: 1,
          numericValue: skipFlags.spice ? null : sliderValues.spice,
        });
        surveyAnswers.push({
          questionId: 2,
          numericValue: skipFlags.sweet ? null : sliderValues.sweet,
        });
        surveyAnswers.push({
          questionId: 3,
          numericValue: skipFlags.salt ? null : sliderValues.salt,
        });
        surveyAnswers.push({
          questionId: 4,
          numericValue: skipFlags.sour ? null : sliderValues.sour,
        });
        surveyAnswers.push({
          questionId: 5,
          numericValue: sliderValues.portion,
        });
        surveyAnswers.push({ questionId: 6, numericValue: sliderValues.price });

        // 가격 이유 답변 추가
        if (
          Math.abs(sliderValues.price) > 0.5 &&
          surveyData.priceReasonCategory
        ) {
          // 기타인 경우 사용자가 입력한 텍스트를 사용, 아니면 카테고리 사용
          const answerText =
            surveyData.priceReasonCategory === "other" &&
            surveyData.priceReasonText
              ? surveyData.priceReasonText
              : surveyData.priceReasonCategory;
          surveyAnswers.push({ questionId: 11, answerText });
        }

        surveyAnswers.push({
          questionId: 7,
          numericValue: surveyData.recommendationScore,
        });
        surveyAnswers.push({
          questionId: 8,
          numericValue: surveyData.reorderScore,
        });
        surveyAnswers.push({
          questionId: 9,
          answerText: surveyData.improvementSuggestion,
        });
        surveyAnswers.push({
          questionId: 10,
          numericValue: surveyData.overallSatisfaction,
        });
        console.log(surveyAnswers);
        const response = await feedbackApi.create({
          foodId: 1, // 추후에 구현해야됨
          storeId: 1, // 추후에 구현해야됨
          surveyId: 1, // 추후에 구현해야됨
          surveyAnswers,
          photoS3Keys: [], // 추후에 사진 넣는 거 넣어야 함
        });
        console.log(response);
        if (response.data.code === 200) {
          toast.success("피드백이 성공적으로 제출되었습니다!", {
            description: "소중한 의견을 보내주셔서 감사합니다."
          });
          router.push(
            "/survey/complete?restaurant=" + encodeURIComponent(restaurantName)
          );
        } else {
          toast.error("피드백 제출에 실패했습니다", {
            description: "다시 시도해 주세요."
          });
          setError("피드백 제출에 실패했습니다.");
        }
      } else {
        // Redirect to login if not authenticated
        router.push("/api/login");
        return;
      }
    } catch {
      toast.error("피드백 제출 중 오류가 발생했습니다", {
        description: "네트워크 연결을 확인하고 다시 시도해 주세요."
      });
      setError("피드백 제출 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    const spiceTitle = userProfile
      ? `평소 드시는 맵기(${
          ["안 매움", "1단계", "2단계", "3단계", "4단계"][
            userProfile.spicyLevel - 1
          ]
        })를 기준으로, 오늘 드신 음식의 맵기는 어떠셨나요?`
      : "오늘 드신 음식의 맵기는 어떠셨나요?";

    switch (currentStep) {
      case 0:
        return (
          <WelcomeStep
            restaurantName={restaurantName}
            menuName={menuName}
            userProfile={userProfile}
          />
        );

      case 1:
        return (
          <TasteStep
            title={spiceTitle}
            leftLabel="훨씬 덜 매움"
            rightLabel="훨씬 더 매움"
            value={sliderValues.spice}
            skipFlag={skipFlags.spice}
            onChange={(val) => setSliderValues({ ...sliderValues, spice: val })}
            onSkip={() =>
              setSkipFlags({ ...skipFlags, spice: !skipFlags.spice })
            }
            userProfile={userProfile}
            profileType="spicy"
          />
        );

      case 2:
        return (
          <TasteStep
            title="오늘 드신 음식의 달기는 어떠셨나요?"
            leftLabel="단맛 거의 없음"
            rightLabel="많이 달콤함"
            value={sliderValues.sweet}
            skipFlag={skipFlags.sweet}
            onChange={(val) => setSliderValues({ ...sliderValues, sweet: val })}
            onSkip={() =>
              setSkipFlags({ ...skipFlags, sweet: !skipFlags.sweet })
            }
            userProfile={userProfile}
            profileType="sweet"
          />
        );

      case 3:
        return (
          <TasteStep
            title="오늘 드신 음식의 간은 어떠셨나요?"
            leftLabel="많이 싱거움"
            rightLabel="많이 짬"
            value={sliderValues.salt}
            skipFlag={skipFlags.salt}
            onChange={(val) => setSliderValues({ ...sliderValues, salt: val })}
            onSkip={() => setSkipFlags({ ...skipFlags, salt: !skipFlags.salt })}
            userProfile={userProfile}
            profileType="salt"
          />
        );

      case 4:
        return (
          <TasteStep
            title="오늘 드신 음식의 신맛은 어떠셨나요?"
            leftLabel="신맛 거의 없음"
            rightLabel="많이 심"
            value={sliderValues.sour}
            skipFlag={skipFlags.sour}
            onChange={(val) => setSliderValues({ ...sliderValues, sour: val })}
            onSkip={() => setSkipFlags({ ...skipFlags, sour: !skipFlags.sour })}
            userProfile={userProfile}
            profileType="sour"
          />
        );

      case 5:
        return (
          <PortionStep
            userProfile={userProfile}
            value={sliderValues.portion}
            onChange={(val) =>
              setSliderValues({ ...sliderValues, portion: val })
            }
          />
        );

      case 6:
        return (
          <PriceStep
            userProfile={userProfile}
            value={sliderValues.price}
            priceReasonCategory={surveyData.priceReasonCategory}
            priceReasonText={surveyData.priceReasonText}
            onChange={(val) => setSliderValues({ ...sliderValues, price: val })}
            onReasonCategoryChange={(category) =>
              setSurveyData({ ...surveyData, priceReasonCategory: category })
            }
            onReasonTextChange={(text) =>
              setSurveyData({ ...surveyData, priceReasonText: text })
            }
          />
        );

      case 7:
        return (
          <RecommendationStep
            recommendationScore={surveyData.recommendationScore}
            reorderScore={surveyData.reorderScore}
            onRecommendationChange={(score) =>
              setSurveyData({ ...surveyData, recommendationScore: score })
            }
            onReorderChange={(score) =>
              setSurveyData({ ...surveyData, reorderScore: score })
            }
          />
        );

      case 8:
        return (
          <FinalStep
            improvementSuggestion={surveyData.improvementSuggestion}
            overallSatisfaction={surveyData.overallSatisfaction}
            onImprovementChange={(text) =>
              setSurveyData({ ...surveyData, improvementSuggestion: text })
            }
            onSatisfactionChange={(score) =>
              setSurveyData({ ...surveyData, overallSatisfaction: score })
            }
          />
        );

      default:
        return <div>완료</div>;
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return true;
      case 1:
        return true; // 항상 활성화
      case 2:
        return true; // 항상 활성화
      case 3:
        return true; // 항상 활성화
      case 4:
        return true; // 항상 활성화
      case 5:
        return true; // 항상 활성화
      case 6:
        // 가격이 0이 아니고 이유를 선택하지 않았으면 비활성화
        if (sliderValues.price !== 0 && !surveyData.priceReasonCategory) {
          return false;
        }
        // 기타를 선택했는데 텍스트가 없으면 비활성화
        if (
          surveyData.priceReasonCategory === "other" &&
          !surveyData.priceReasonText.trim()
        ) {
          return false;
        }
        return true;
      case 7:
        return true;
      case 8:
        return surveyData.improvementSuggestion.length >= 30;
      default:
        return true;
    }
  };

  // 모든 단계 배경을 통일
  const getBgColor = () => {
    return "bg-gray-50";
  };

  return (
    <>
      <TossProgressBar progress={progress} />
      <SurveyLayout
        currentStep={currentStep}
        totalSteps={totalSteps}
        progress={progress}
        restaurantName={restaurantName}
        menuName={menuName}
        error={error}
        onPrev={handlePrev}
        onNext={handleNext}
        isStepValid={isStepValid() as boolean}
        isLoading={isLoading}
        bgColor={getBgColor()}
      >
        {renderStep()}
      </SurveyLayout>
    </>
  );
}

export default function SurveyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          로딩 중...
        </div>
      }
    >
      <SurveyContent />
    </Suspense>
  );
}
