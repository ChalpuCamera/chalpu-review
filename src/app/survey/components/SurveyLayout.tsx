import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface SurveyLayoutProps {
  currentStep: number;
  totalSteps: number;
  progress: number;
  restaurantName: string;
  menuName: string;
  children: React.ReactNode;
  error?: string;
  onPrev: () => void;
  onNext: () => void;
  isStepValid: boolean;
  isLoading: boolean;
  bgColor?: string;
}

export function SurveyLayout({
  currentStep,
  totalSteps,
  progress,
  restaurantName,
  menuName,
  children,
  error,
  onPrev,
  onNext,
  isStepValid,
  isLoading,
  bgColor = "bg-gray-50"
}: SurveyLayoutProps) {
  const router = useRouter();

  return (
    <div className={`min-h-screen ${bgColor} py-8`}>
      <div className="max-w-2xl mx-auto px-4">
        {/* 홈 버튼 */}
        <div className="mb-4 flex justify-between items-center">
          <Button 
            variant="outline" 
            onClick={() => router.push('/')}
            className="flex items-center gap-2"
          >
            🏠 홈으로
          </Button>
        </div>

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
            {children}
            
            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md mt-4">
                {error}
              </div>
            )}
            
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={onPrev}
                disabled={currentStep === 0}
              >
                이전
              </Button>
              
              <Button
                onClick={onNext}
                disabled={!isStepValid || isLoading}
                className={`transition-all duration-300 ${
                  !isStepValid || isLoading 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg transform hover:scale-105'
                }`}
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