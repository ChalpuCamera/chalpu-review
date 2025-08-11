'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function OAuth2SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // OAuth2 성공 콜백 처리
    const accessToken = searchParams.get('accessToken');
    const userId = searchParams.get('userId');

    if (accessToken && userId) {
      // localStorage에 토큰과 사용자 ID 저장
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('userId', userId);
      
      // 홈페이지로 리다이렉트
      router.push('/');
    } else {
      // 토큰이나 userId가 없으면 로그인 페이지로
      router.push('/api/login');
    }
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-lg">로그인 처리 중...</div>
        <div className="text-sm text-gray-500 mt-2">잠시만 기다려주세요</div>
      </div>
    </div>
  );
}

export default function OAuth2SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">로딩 중...</div>}>
      <OAuth2SuccessContent />
    </Suspense>
  );
}