export interface UserProfile {
  spicyLevel: number; // 매운맛 수준 (백엔드 API 필드명)
  mealAmount: number; // 식사량 (백엔드 API 필드명)
  mealSpending: number; // 가격대 (백엔드 API 필드명)
}

// 백엔드 API 응답 타입
export interface TasteProfileResponse {
  spicyLevel: number;
  mealAmount: number;
  mealSpending: number;
}

export interface SurveyAnswer {
  questionId: number;
  answerText?: string;
  numericValue?: number | null;
}

export interface FeedbackSubmission {
  foodId: number;
  storeId: number;
  surveyId: number;
  surveyAnswers: SurveyAnswer[];
  photoS3Keys: string[];
}

export interface RewardItem {
  id: number;
  rewardName: string;
  rewardType: string;
  rewardValue: number;
  requiredCount: number;
  description: string;
  expiryDate: string;
  available: boolean;
}

export interface RedemptionItem {
  id: number;
  rewardName: string;
  rewardCount: number;
  status: 'ISSUED' | 'USED' | 'EXPIRED';
  redeemedAt: string;
}

export interface PhotoUpload {
  originalFileName: string;
  presignedUrl: string;
  s3Key: string;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  result: T;
}

export type QuestionType = 'SLIDER' | 'RATING' | 'TEXT';

export interface SliderValue {
  spice: number;
  sweet: number;
  salt: number;
  sour: number;
  portion: number;
  price: number;
}