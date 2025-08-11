'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { rewardApi } from '@/lib/api';
import type { RewardItem, RedemptionItem } from '@/types';
import { Gift, Clock, CheckCircle } from 'lucide-react';

export default function RewardsPage() {
  const router = useRouter();
  const [rewards, setRewards] = useState<RewardItem[]>([]);
  const [redemptions, setRedemptions] = useState<RedemptionItem[]>([]);
  const [feedbackCount, setFeedbackCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [exchangeLoading, setExchangeLoading] = useState<number | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    const loadRewards = async () => {
      try {
        const [rewardsRes, redemptionsRes] = await Promise.all([
          rewardApi.getMyRewards(),
          rewardApi.getMyRedemptions()
        ]);

        if (rewardsRes.data.code === 0) {
          setRewards(rewardsRes.data.result);
        }
        if (redemptionsRes.data.code === 0) {
          setRedemptions(redemptionsRes.data.result);
        }

        // Mock feedback count for demo
        const mockCount = localStorage.getItem('mockFeedbackCount');
        setFeedbackCount(mockCount ? parseInt(mockCount) : 7);
      } catch (err) {
        setError('리워드 정보를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    loadRewards();
  }, [router]);

  const handleExchange = async (rewardId: number) => {
    setExchangeLoading(rewardId);
    setError('');

    try {
      const response = await rewardApi.redeem(rewardId);
      
      if (response.data.code === 0) {
        // Refresh redemptions
        const redemptionsRes = await rewardApi.getMyRedemptions();
        if (redemptionsRes.data.code === 0) {
          setRedemptions(redemptionsRes.data.result);
        }
        
        alert(`상품권이 성공적으로 교환되었습니다!`);
      } else {
        setError('교환에 실패했습니다.');
      }
    } catch (err) {
      setError('교환 중 오류가 발생했습니다.');
    } finally {
      setExchangeLoading(null);
    }
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
            <CardTitle className="text-2xl flex items-center justify-center gap-2">
              <Gift className="w-6 h-6" />
              내 피드백 리워드
            </CardTitle>
            <CardDescription>
              소중한 피드백을 상품권으로 교환해보세요
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Current Status */}
        <Card>
          <CardHeader>
            <CardTitle>현재 상태</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {feedbackCount}개
              </div>
              <p className="text-gray-600">
                지금까지 <strong>{feedbackCount}개</strong>의 소중한 피드백을 남겨주셨어요!
              </p>
            </div>

            {/* Progress to next reward */}
            <div className="space-y-2">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">다음 상품권까지</span>
                <span className="text-sm text-blue-600 font-semibold">
                  {5 - (feedbackCount % 5)}개 남았어요!
                </span>
              </div>
              <Progress value={(feedbackCount % 5) * 20} className="w-full" />
              <p className="text-xs text-gray-500 mt-1">
                5,000원 상품권까지 {5 - (feedbackCount % 5)}개 더 필요해요
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Available Rewards */}
        <Card>
          <CardHeader>
            <CardTitle>교환 가능한 상품권</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {rewards.length === 0 ? (
                // Mock rewards for demo
                [
                  { id: 1, rewardName: 'CU 5,000원 상품권', rewardValue: 5000, requiredCount: 5, description: 'CU에서 사용 가능한 5,000원 상품권' },
                  { id: 2, rewardName: '스타벅스 10,000원 상품권', rewardValue: 10000, requiredCount: 10, description: '스타벅스에서 사용 가능한 10,000원 상품권' },
                  { id: 3, rewardName: '올리브영 15,000원 상품권', rewardValue: 15000, requiredCount: 15, description: '올리브영에서 사용 가능한 15,000원 상품권' }
                ].map((reward) => {
                  const canExchange = feedbackCount >= reward.requiredCount;
                  
                  return (
                    <Card key={reward.id} className={`relative ${canExchange ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{reward.rewardName}</CardTitle>
                        <CardDescription>{reward.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">필요 피드백:</span>
                            <span className="font-semibold">{reward.requiredCount}개</span>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">상품권 가치:</span>
                            <span className="font-semibold text-blue-600">
                              {reward.rewardValue.toLocaleString()}원
                            </span>
                          </div>

                          {canExchange ? (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button className="w-full" disabled={exchangeLoading === reward.id}>
                                  {exchangeLoading === reward.id ? '교환 중...' : '상품권으로 교환하기'}
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>상품권 교환 확인</DialogTitle>
                                  <DialogDescription>
                                    피드백 {reward.requiredCount}개를 사용하여 &lsquo;{reward.rewardName}&rsquo;으로 교환하시겠습니까? 
                                    <br />
                                    <strong className="text-red-600">교환 후에는 취소할 수 없습니다.</strong>
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="flex justify-end space-x-2 mt-4">
                                  <DialogTrigger asChild>
                                    <Button variant="outline">취소</Button>
                                  </DialogTrigger>
                                  <Button onClick={() => handleExchange(reward.id)}>
                                    확인
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                          ) : (
                            <Button disabled className="w-full">
                              <Clock className="w-4 h-4 mr-2" />
                              {reward.requiredCount - feedbackCount}개 더 필요
                            </Button>
                          )}
                        </div>
                      </CardContent>
                      
                      {canExchange && (
                        <div className="absolute top-2 right-2">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                      )}
                    </Card>
                  );
                })
              ) : (
                rewards.map((reward) => {
                  const canExchange = feedbackCount >= reward.requiredCount;
                  
                  return (
                    <Card key={reward.id} className={`relative ${canExchange ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{reward.rewardName}</CardTitle>
                        <CardDescription>{reward.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">필요 피드백:</span>
                            <span className="font-semibold">{reward.requiredCount}개</span>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">상품권 가치:</span>
                            <span className="font-semibold text-blue-600">
                              {reward.rewardValue.toLocaleString()}원
                            </span>
                          </div>

                          {canExchange ? (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button className="w-full" disabled={exchangeLoading === reward.id}>
                                  {exchangeLoading === reward.id ? '교환 중...' : '상품권으로 교환하기'}
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>상품권 교환 확인</DialogTitle>
                                  <DialogDescription>
                                    피드백 {reward.requiredCount}개를 사용하여 &lsquo;{reward.rewardName}&rsquo;으로 교환하시겠습니까? 
                                    <br />
                                    <strong className="text-red-600">교환 후에는 취소할 수 없습니다.</strong>
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="flex justify-end space-x-2 mt-4">
                                  <DialogTrigger asChild>
                                    <Button variant="outline">취소</Button>
                                  </DialogTrigger>
                                  <Button onClick={() => handleExchange(reward.id)}>
                                    확인
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                          ) : (
                            <Button disabled className="w-full">
                              <Clock className="w-4 h-4 mr-2" />
                              {reward.requiredCount - feedbackCount}개 더 필요
                            </Button>
                          )}
                        </div>
                      </CardContent>
                      
                      {canExchange && (
                        <div className="absolute top-2 right-2">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                      )}
                    </Card>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>

        {/* Exchange History */}
        {redemptions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>내 상품권 교환 내역</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {redemptions
                  .sort((a, b) => new Date(b.redeemedAt).getTime() - new Date(a.redeemedAt).getTime())
                  .map((redemption) => (
                    <div
                      key={redemption.id}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <div className="font-semibold">{redemption.rewardName}</div>
                        <div className="text-sm text-gray-600">
                          {new Date(redemption.redeemedAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm px-2 py-1 rounded ${
                          redemption.status === 'ISSUED' ? 'bg-green-100 text-green-800' :
                          redemption.status === 'USED' ? 'bg-gray-100 text-gray-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {redemption.status === 'ISSUED' ? '발급완료' :
                           redemption.status === 'USED' ? '사용완료' : '만료'}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}

        {error && (
          <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
            {error}
          </div>
        )}

        {/* Navigation */}
        <div className="text-center">
          <Button variant="outline" onClick={() => router.push('/profile')}>
            마이페이지로 돌아가기
          </Button>
        </div>
      </div>
    </div>
  );
}