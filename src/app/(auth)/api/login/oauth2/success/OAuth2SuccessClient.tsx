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

      console.log("OAuth Success Debug:", {
        accessToken: accessToken ? `present: ${accessToken.substring(0, 10)}...` : "missing",
        userId: userId ? `present: ${userId}` : "missing", 
        refreshToken: refreshToken ? `present: ${refreshToken.substring(0, 10)}...` : "missing",
        fullURL: window.location.href
      });

      if (accessToken && userId) {
        try {
          // localStorage에 토큰과 사용자 ID 저장
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("userId", userId);
          
          // refreshToken이 있으면 저장, 없어도 로그인 진행
          if (refreshToken) {
            localStorage.setItem("refreshToken", refreshToken);
          }
          
          // 저장 확인
          console.log("LocalStorage saved:", {
            accessToken: localStorage.getItem("accessToken") ? "saved" : "failed",
            userId: localStorage.getItem("userId") ? "saved" : "failed",
            refreshToken: localStorage.getItem("refreshToken") ? "saved" : "not set"
          });
          
          router.push("/");
        } catch (error) {
          console.error("Error saving to localStorage:", error);
          router.push("/api/login");
        }
      } else {
        console.log("OAuth failed - missing required parameters");
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