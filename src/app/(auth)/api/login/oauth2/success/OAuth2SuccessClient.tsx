"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface OAuth2SuccessClientProps {
  refreshToken?: string;
}

export default function OAuth2SuccessClient({ refreshToken }: OAuth2SuccessClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleOAuthSuccess = async () => {
      // OAuth2 성공 콜백 처리
      const accessToken = searchParams.get("accessToken");
      const userId = searchParams.get("userId");

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
  }, [router, searchParams, refreshToken]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-lg">로그인 처리 중...</div>
        <div className="text-sm text-gray-500 mt-2">잠시만 기다려주세요</div>
      </div>
    </div>
  );
}