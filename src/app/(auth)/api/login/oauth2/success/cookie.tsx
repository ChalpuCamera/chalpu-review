import { cookies } from "next/headers";

export default async function Cookie() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshTokenCookie")?.value;

  return { refreshToken };
}
