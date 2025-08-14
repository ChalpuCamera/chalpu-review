'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { feedbackApi } from '@/lib/api';
import { User as UserIcon, Settings, Gift, FileText, LogOut, PenTool } from 'lucide-react';
import { toast } from '@/components/ui/toast';

export default function ProfilePage() {
  const router = useRouter();
  const [feedbacks, setFeedbacks] = useState<Record<string, unknown>[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [feedbackCount, setFeedbackCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      toast.warning("로그인이 필요합니다", {
        description: "로그인 페이지로 이동합니다"
      });
      router.push('/api/login');
      return;
    }

    const loadData = async () => {
      try {
        const feedbackResponse = await feedbackApi.getMyFeedback();
        if ((feedbackResponse.data.result.totalElements as number) > 0) {
          const feedbackResults = feedbackResponse.data.result.content as Record<string, unknown>[];
          setFeedbacks(feedbackResults);
          setFeedbackCount(feedbackResults.length);
        }
      } catch (err) {
        console.error('Failed to load data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userId');
    toast.success("로그아웃되었습니다", {
      description: "안전하게 로그아웃되었습니다"
    });
    router.push('/api/login');
  };

  const startSurvey = () => {
    toast.success("피드백 작성 페이지로 이동합니다!", {
      description: "소중한 의견을 들려주세요"
    });
    router.push('/survey');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div>로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 space-y-6">
        {/* Header */}
        <Card>
          <CardHeader className="text-center">
            <div className="flex items-center justify-center space-x-2">
              <UserIcon className="w-8 h-8" />
              <CardTitle className="text-2xl">마이페이지</CardTitle>
            </div>
            <CardDescription>
              피드백과 리워드를 관리해보세요
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => {
            toast.info("입맛 프로필 페이지로 이동합니다");
            router.push('/profile/taste');
          }}>
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <Settings className="w-8 h-8 mb-2 text-blue-600" />
              <h3 className="font-semibold">내 입맛 프로필</h3>
              <p className="text-sm text-gray-600 mt-1">프로필 수정</p>
            </CardContent>
          </Card>

          {/* 추후 수정 필요 onClick={() => router.push('/rewards')} */}
          <Card className="cursor-not-allowed hover:shadow-md transition-shadow opacity-50">
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <Gift className="w-8 h-8 mb-2 text-green-600" />
              <h3 className="font-semibold">상품권 교환</h3>
              <p className="text-sm text-gray-600 mt-1">{0 ? `리워드 확인` : `준비중 입니다.`}</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={startSurvey}>
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <PenTool className="w-8 h-8 mb-2 text-purple-600" />
              <h3 className="font-semibold">피드백 작성</h3>
              <p className="text-sm text-gray-600 mt-1">새 리뷰 작성</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handleLogout}>
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <LogOut className="w-8 h-8 mb-2 text-red-600" />
              <h3 className="font-semibold">로그아웃</h3>
              <p className="text-sm text-gray-600 mt-1">계정 로그아웃</p>
            </CardContent>
          </Card>
        </div>

        {/* User Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {feedbackCount}개
              </div>
              <p className="text-gray-600">작성한 피드백</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {Math.floor(feedbackCount / 5)}개
              </div>
              <p className="text-gray-600">교환 가능한 상품권</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {5 - feedbackCount % 5}개
              </div>
              <p className="text-gray-600">다음 상품권까지</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Feedback History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>내가 작성한 피드백 내역</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {feedbacks.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>아직 작성한 피드백이 없습니다.</p>
                <Button className="mt-4" onClick={startSurvey}>
                  첫 피드백 작성하기
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {feedbacks
                  .slice(0, 5)
                  .map((feedback) => (
                    <div
                      key={(feedback.id as string | number) || Math.random()}
                      className="p-4 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-semibold">{String(feedback.storeName || 'Unknown')}</h4>
                            <span className="text-gray-400">•</span>
                            <span className="text-gray-600">{String(feedback.foodName || 'Unknown')}</span>
                          </div>
                          
                          <div className="text-sm mb-2">
                            <span className="text-gray-500">작성일:</span>
                            <span className="ml-2">{new Date(String(feedback.createdAt || Date.now())).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                
                {feedbacks.length > 5 && (
                  <div className="text-center pt-4">
                    <p className="text-gray-500 text-sm">
                      총 {feedbacks.length}개의 피드백 중 최근 5개를 표시하고 있습니다.
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Account Info */}
        <Card>
          <CardHeader>
            <CardTitle>계정 정보</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">로그인 방식:</span>
                <span className="font-medium">카카오 로그인</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}