import axios from 'axios';
import type { 
  ApiResponse, 
  FeedbackSubmission, 
  RewardItem, 
  RedemptionItem, 
  PhotoUpload,
  TasteProfileResponse
} from '@/types';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const feedbackApi = {
  create: (data: FeedbackSubmission) => 
    api.post<ApiResponse<Record<string, unknown>>>('/api/customer-feedback', data),

  getPresignedUrls: (fileNames: string[]) =>
    api.post<ApiResponse<{ photoUrls: PhotoUpload[] }>>(
      '/api/customer-feedback/presigned-urls', 
      { fileNames }
    ),

  getById: (feedbackId: number) =>
    api.get<ApiResponse<Record<string, unknown>>>(`/api/customer-feedback/${feedbackId}`),

  getMyFeedback: () =>
    api.get<ApiResponse<Record<string, unknown>>>('/api/customer-feedback/me'),

  getMyFeedbackPaged: (page: number = 0, size: number = 10) =>
    api.get<ApiResponse<Record<string, unknown>>>(`/api/customer-feedback/me/page?page=${page}&size=${size}`),
};

export const rewardApi = {
  getAll: () =>
    api.get<ApiResponse<RewardItem[]>>('/api/rewards'),

  getMyRewards: () =>
    api.get<ApiResponse<RewardItem[]>>('/api/rewards/me'),

  getMyRedemptions: () =>
    api.get<ApiResponse<RedemptionItem[]>>('/api/rewards/redemptions/me'),

  getActiveRedemptions: () =>
    api.get<ApiResponse<RedemptionItem[]>>('/api/rewards/redemptions/me/active'),

  checkEligibility: () =>
    api.get<ApiResponse<boolean>>('/api/rewards/eligible'),

  redeem: (rewardId: number) =>
    api.post<ApiResponse<RedemptionItem>>('/api/rewards/redeem', { rewardId }),

  use: (redemptionId: number) =>
    api.put<ApiResponse<Record<string, unknown>>>(`/api/rewards/redemptions/${redemptionId}/use`),

  cancel: (redemptionId: number) =>
    api.put<ApiResponse<Record<string, unknown>>>(`/api/rewards/redemptions/${redemptionId}/cancel`),
};

export const tasteProfileApi = {
  // 내 취향 정보 조회
  getTasteProfile: () =>
    api.get<ApiResponse<TasteProfileResponse>>('/api/customers/me/taste'),
    
  // 내 취향 정보 생성/수정
  createOrUpdateTasteProfile: (data: TasteProfileResponse) =>
    api.post<ApiResponse<Record<string, unknown>>>('/api/customers/me/taste', data),
};

export const authApi = {
  initiateKakaoLogin: async () => {
    console.log("로그인 시도");
    try {
      window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/oauth2/authorization/kakao`;
      // // 카카오 로그인 API 엔드포인트로 GET 요청 보내기
      // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/oauth2/authorization/kakao`, {
      //   method: 'GET',
      // });
      // console.log(response);
      
      // if (response.redirected) {
      //   // 서버에서 리다이렉트가 발생한 경우, 해당 URL로 이동
      //   window.location.href = response.url;
      // }
    } catch (error) {
      console.error('카카오 로그인 요청 실패:', error);
      // 에러 발생 시 기존 방식으로 fallback
      
    }
  }
};

export const authMockApi = {
  register: async (data: { name: string; email: string; password: string }) => {
    // Mock API for demo
    return {
      success: true,
      data: {
        user: { id: 1, name: data.name, email: data.email }
      },
      error: null as string | null
    };
  }
};

export const storage = {
  getCurrentUser: () => {
    const userData = localStorage.getItem('currentUser');
    return userData ? JSON.parse(userData) : null;
  },
  setCurrentUser: (user: unknown) => {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }
};

export default api;