'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    setIsLoggedIn(!!token);
    setIsLoading(false);
  }, []);


  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div>로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Hero Section */}
          <div className="mb-16">
            <div className="text-6xl mb-6">🍽️</div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              찰푸 리뷰
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8">
              당신의 솔직한 피드백으로 맛집을 더 맛있게 만들어주세요
            </p>
            <p className="text-gray-500 mb-8">
              피드백을 작성하고 상품권 리워드를 받아보세요!
            </p>
          </div>

          {/* Action Cards */}
          {isLoggedIn ? (
            <div className="grid gap-6 md:grid-cols-2 mb-12">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push('/profile')}>
                <CardHeader>
                  <CardTitle className="text-xl">마이페이지</CardTitle>
                  <CardDescription>
                    내 프로필과 피드백 내역을 확인하세요
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">
                    마이페이지 보기
                  </Button>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push('/survey')}>
                <CardHeader>
                  <CardTitle className="text-xl">피드백 작성</CardTitle>
                  <CardDescription>
                    새로운 음식에 대한 피드백을 작성해보세요
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="outline">
                    피드백 작성하기
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="flex justify-center mb-12">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow max-w-md" onClick={() => router.push('/api/login')}>
                <CardHeader>
                  <CardTitle className="text-xl text-center">시작하기</CardTitle>
                </CardHeader>
                <CardContent>
                  카카오 계정으로 간편하게 로그인하세요
                </CardContent>
              </Card>
            </div>
          )}


          {/* Features */}
          <div className="grid gap-6 md:grid-cols-3">
            <div className="text-center">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-lg font-semibold mb-2">간편한 피드백</h3>
              <p className="text-gray-600 text-sm">
                슬라이더 기반의 직관적인 인터페이스로 쉽고 빠른 피드백 작성
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🎁</div>
              <h3 className="text-lg font-semibold mb-2">리워드 시스템</h3>
              <p className="text-gray-600 text-sm">
                피드백 작성하고 상품권으로 교환할 수 있는 포인트 적립
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-lg font-semibold mb-2">익명 보장</h3>
              <p className="text-gray-600 text-sm">
                완전 익명으로 사장님께만 전달되는 안전한 피드백
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-16 pt-8 border-t border-gray-200">
            <p className="text-gray-500 text-sm">
              © 2025 chalpu review. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
