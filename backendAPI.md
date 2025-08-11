POST
/api/customer-feedback
피드백 생성


음식에 대한 피드백과 설문 응답을 생성합니다.

Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "foodId": 1,
  "storeId": 1,
  "surveyId": 1,
  "surveyAnswers": [
    {
      "questionId": 1,
      "answerText": "음식이 매우 맛있었습니다",
      "numericValue": 1.5
    }
  ],
  "photoS3Keys": [
    "string"
  ]
}
Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "code": 0,
  "message": "string",
  "result": {
    "id": 1,
    "foodName": "김치찌개",
    "storeName": "맛있는집",
    "customerNickname": "음식러버",
    "surveyName": "음식 만족도 조사",
    "createdAt": "2025-08-11T07:02:24.181Z",
    "surveyAnswers": [
      {
        "id": 1,
        "questionText": "음식의 맛은 어떠셨나요?",
        "questionType": "SLIDER",
        "answerText": "매우 맛있었습니다",
        "numericValue": 1.5
      }
    ],
    "photoUrls": [
      "string"
    ]
  }
}
No links

POST
/api/customer-feedback/presigned-urls
피드백 사진들 Presigned URL 생성


고객이 여러 개의 피드백 사진을 S3에 직접 업로드하기 위한 Presigned URL들을 한 번에 생성합니다.

클라이언트 처리 순서:

이 API를 호출하여 각 파일별 presignedUrl과 s3Key를 받습니다.
각 presignedUrl에 해당하는 파일을 HTTP PUT 요청으로 업로드합니다.
주의: Content-Type 헤더에 반드시 실제 파일의 MIME 타입(예: image/jpeg)을 포함해야 합니다.
모든 S3 업로드가 성공하면, 피드백 생성 API를 호출할 때 모든 s3Key를 포함해서 전송합니다.
사용 예시:

1개 파일: ["photo1.jpg"]
여러개 파일: ["photo1.jpg", "photo2.jpg", "photo3.jpg"]
Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "fileNames": [
    "feedback-food-1.jpg",
    "feedback-food-2.jpg",
    "feedback-food-3.jpg"
  ]
}
Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "code": 0,
  "message": "string",
  "result": {
    "photoUrls": [
      {
        "originalFileName": "feedback-food-1.jpg",
        "presignedUrl": "string",
        "s3Key": "feedback-photos/a1b2c3d4-e5f6-7890-1234-567890abcdef.jpg"
      }
    ]
  }
}
No links

GET
/api/customer-feedback/{feedbackId}
피드백 상세 조회


특정 피드백의 상세 정보를 조회합니다.

Parameters
Try it out
Name	Description
feedbackId *
integer($int64)
(path)
피드백 ID

Example : 1

1
Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
string
No links

GET
/api/customer-feedback/store/{storeId}
매장별 피드백 목록 조회



GET
/api/customer-feedback/me
내 피드백 목록 조회


현재 로그인한 고객이 작성한 모든 피드백을 조회합니다.

Parameters
Try it out
No parameters

Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
string
No links

GET
/api/customer-feedback/me/page
내 피드백 페이징 조회


현재 로그인한 고객이 작성한 피드백을 페이징으로 조회합니다.

Parameters
Try it out
Name	Description
pageable *
(query)
pageable
Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
string

PUT
/api/rewards/redemptions/{redemptionId}/use
리워드 사용 처리


교환된 리워드를 사용 처리합니다.

Parameters
Try it out
Name	Description
redemptionId *
integer($int64)
(path)
교환 ID

Example : 1

1
Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "code": 0,
  "message": "string",
  "result": {}
}
No links

PUT
/api/rewards/redemptions/{redemptionId}/cancel
리워드 사용 취소


교환된 리워드의 사용을 취소합니다.

Parameters
Try it out
Name	Description
redemptionId *
integer($int64)
(path)
교환 ID

Example : 1

1
Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "code": 0,
  "message": "string",
  "result": {}
}
No links

POST
/api/rewards/redeem
리워드 교환


현재 로그인한 고객이 리워드를 교환합니다.

Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "rewardId": 1
}
Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "code": 0,
  "message": "string",
  "result": {
    "id": 1,
    "rewardName": "올리브영 1만원 상품권",
    "rewardCount": 10,
    "status": "ISSUED",
    "redeemedAt": "2025-08-11T07:03:30.489Z"
  }
}
No links

GET
/api/rewards
전체 리워드 목록 조회


사용 가능한 모든 리워드 목록을 조회합니다.

Parameters
Try it out
No parameters

Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "code": 0,
  "message": "string",
  "result": [
    {
      "id": 1,
      "rewardName": "올리브영 1만원 상품권",
      "rewardType": "coupon",
      "rewardValue": 10000,
      "requiredCount": 5,
      "description": "올리브영에서 사용 가능한 1만원 상품권",
      "expiryDate": "2025-08-11",
      "available": true
    }
  ]
}
No links

GET
/api/rewards/redemptions/me
내 리워드 교환 내역 조회


현재 로그인한 고객의 모든 리워드 교환 내역을 조회합니다.

Parameters
Try it out
No parameters

Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "code": 0,
  "message": "string",
  "result": [
    {
      "id": 1,
      "rewardName": "올리브영 1만원 상품권",
      "rewardCount": 10,
      "status": "ISSUED",
      "redeemedAt": "2025-08-11T07:03:30.490Z"
    }
  ]
}
No links

GET
/api/rewards/redemptions/me/active
내가 사용 가능한 리워드 조회


현재 로그인한 고객의 사용 가능한 리워드를 조회합니다.

Parameters
Try it out
No parameters

Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "code": 0,
  "message": "string",
  "result": [
    {
      "id": 1,
      "rewardName": "올리브영 1만원 상품권",
      "rewardCount": 10,
      "status": "ISSUED",
      "redeemedAt": "2025-08-11T07:03:30.491Z"
    }
  ]
}
No links

GET
/api/rewards/me
내가 받을 수 있는 리워드 조회


현재 로그인한 고객이 받을 수 있는 리워드 목록을 조회합니다.

Parameters
Try it out
No parameters

Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "code": 0,
  "message": "string",
  "result": [
    {
      "id": 1,
      "rewardName": "올리브영 1만원 상품권",
      "rewardType": "coupon",
      "rewardValue": 10000,
      "requiredCount": 5,
      "description": "올리브영에서 사용 가능한 1만원 상품권",
      "expiryDate": "2025-08-11",
      "available": true
    }
  ]
}
No links

GET
/api/rewards/eligible
내 리워드 수령 자격 확인


현재 로그인한 고객의 리워드 수령 자격을 확인합니다.

Parameters
Try it out
No parameters

Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "code": 0,
  "message": "string",
  "result": true
}

https://{apiURL}/api/oauth2/authorization/kakao"
https://review.chalpu.com/api/login/oauth2/success
4:49
Cookie refreshTokenCookie = new Cookie("refreshToken", tokenDTO.getRefreshToken());
refreshTokenCookie.setHttpOnly(true);
refreshTokenCookie.setSecure(true);
refreshTokenCookie.setPath("/");
refreshTokenCookie.setMaxAge(7 * 24 * 60 * 60); // 7일
response.addCookie(refreshTokenCookie);

log.info("OAuth2 로그인 성공: userId={}, email={}, provider={}", 
        userDetails.getId(), userDetails.getEmail(), userDetails.getProvider());

// Access Token과 userId만 URL 파라미터로 전달
String targetUrl = UriComponentsBuilder.fromUriString(redirectSuccessUrl)
        .queryParam("accessToken", tokenDTO.getAccessToken())
        .queryParam("userId", userDetails.getId())
        .build().toUriString();

// 리다이렉트 수행
getRedirectStrategy().sendRedirect(request, response, targetUrl);