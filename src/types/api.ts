export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface AuthRequest {
  email: string;
  password: string;
  name?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface TasteProfile {
  id: string;
  userId: string;
  spiciness: number; // 0-4 (Q1)
  quantity: number; // 1-4 (Q2) 
  priceRange: number; // 1-4 (Q3)
  createdAt: string;
  updatedAt: string;
}

export interface TasteProfileRequest {
  spiciness: number;
  quantity: number;
  priceRange: number;
}

export interface FeedbackSurvey {
  id: string;
  userId: string;
  restaurantName: string;
  menuName: string;
  
  // Phase 2: Food evaluation (-2 to +2)
  spiciness: number | null;
  sweetness: number | null;
  saltiness: number | null;
  sourness: number | null;
  quantity: number | null;
  price: number | null;
  priceReasonCategory?: string; // if price not neutral
  priceReasonText?: string;
  
  // Phase 3: Overall feedback
  recommendationScore: number; // 0-10 NPS
  reorderScore: number; // 0-10 NPS
  improvementSuggestion: string;
  overallSatisfaction: number; // 1-5
  
  createdAt: string;
}

export interface FeedbackRequest {
  restaurantName: string;
  menuName: string;
  spiciness?: number;
  sweetness?: number;
  saltiness?: number;
  sourness?: number;
  quantity?: number;
  price?: number;
  priceReasonCategory?: string;
  priceReasonText?: string;
  recommendationScore: number;
  reorderScore: number;
  improvementSuggestion: string;
  overallSatisfaction: number;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  requiredFeedbacks: number;
  value: number;
  available: boolean;
}

export interface UserRewards {
  userId: string;
  totalFeedbacks: number;
  availableRewards: Reward[];
  exchangeHistory: RewardExchange[];
}

export interface RewardExchange {
  id: string;
  userId: string;
  rewardId: string;
  rewardName: string;
  exchangedAt: string;
  code?: string;
}

export interface RewardExchangeRequest {
  rewardId: string;
}

export interface RestaurantStats {
  restaurantName: string;
  totalFeedbacks: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}