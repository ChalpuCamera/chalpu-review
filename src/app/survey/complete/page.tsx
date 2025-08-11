'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function SurveyCompleteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const restaurantName = searchParams.get('restaurant') || '가게';
  const isDemo = searchParams.get('demo') === 'true';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Card className="text-center">
          <CardHeader>
            <div className="text-6xl mb-4">🎉</div>
            <CardTitle className="text-2xl">소중한 의견 정말 감사합니다!</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <p className="text-lg text-gray-600">
              당신의 진심 어린 피드백 덕분에 <strong>{restaurantName}</strong>은 한 뼘 더 성장할 수 있을 거예요. 😊
            </p>
            
            <div className={`p-4 rounded-lg ${isDemo ? 'bg-blue-50' : 'bg-green-50'}`}>
              <p className={`font-semibold ${isDemo ? 'text-blue-800' : 'text-green-800'}`}>
                {isDemo ? '🎮 데모 피드백 체험 완료!' : '✅ 피드백이 성공적으로 전달되었습니다'}
              </p>
              <p className={`text-sm mt-1 ${isDemo ? 'text-blue-700' : 'text-green-700'}`}>
                {isDemo ? '실제 사용을 위해서는 회원가입이 필요합니다' : '사장님만이 이 피드백을 확인할 수 있습니다'}
              </p>
            </div>
            
            <div className="space-y-3">
              {isDemo ? (
                <>
                  <Button 
                    onClick={() => router.push('/auth/signup')}
                    className="w-full"
                  >
                    회원가입하고 실제 피드백 작성하기
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={() => router.push('/auth/login')}
                    className="w-full"
                  >
                    기존 계정으로 로그인
                  </Button>

                  <Button 
                    variant="ghost"
                    onClick={() => router.push('/')}
                    className="w-full"
                  >
                    홈으로 돌아가기
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    onClick={() => router.push('/rewards')}
                    className="w-full"
                  >
                    내 리워드 현황 확인하기
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={() => router.push('/profile')}
                    className="w-full"
                  >
                    마이페이지로 이동
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function SurveyCompletePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">로딩 중...</div>}>
      <SurveyCompleteContent />
    </Suspense>
  );
}