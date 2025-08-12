"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Cookie from "./cookie";

function OAuth2SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleOAuthSuccess = async () => {
      // OAuth2 성공 콜백 처리
      const accessToken = searchParams.get("accessToken");
      const userId = searchParams.get("userId");

      // 쿠키에서 refreshToken 가져오기
      const { refreshToken } = await Cookie();

      if (accessToken && userId && refreshToken) {
        // localStorage에 토큰과 사용자 ID 저장
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("userId", userId);
        localStorage.setItem("refreshToken", refreshToken);
        router.push("/");
      } else {
        router.push("/api/login");
      }
    };

    handleOAuthSuccess();
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
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          로딩 중...
        </div>
      }
    >
      <OAuth2SuccessContent />
    </Suspense>
  );
}
