export interface UserProfile {
  spiceLevel: number; // 0-4 (매운맛 수준)
  portionSize: number; // 0-3 (식사량)
  priceRange: number; // 0-3 (가격대)
}

export interface SurveyAnswer {
  questionId: number;
  answerText?: string;
  numericValue?: number;
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