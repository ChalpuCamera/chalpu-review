import axios from 'axios';
import type { 
  ApiResponse, 
  FeedbackSubmission, 
  RewardItem, 
  RedemptionItem, 
  PhotoUpload 
} from '@/types';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://review.chalpu.com',
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

export const authApi = {
  getKakaoLoginUrl: () => `${api.defaults.baseURL}/api/oauth2/authorization/kakao`,
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