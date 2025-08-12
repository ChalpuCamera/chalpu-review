import { Suspense } from "react";
import { cookies } from "next/headers";
import OAuth2SuccessClient from "./OAuth2SuccessClient";

export default async function OAuth2SuccessPage() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshTokenCookie")?.value;

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          로딩 중...
        </div>
      }
    >
      <OAuth2SuccessClient refreshToken={refreshToken} />
    </Suspense>
  );
}
