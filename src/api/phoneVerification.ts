import { http } from "./http";


// 인증번호 요청
export interface PhoneVerificationRequest {
  phone: string;
}

export interface PhoneVerificationResponse {
  isSuccess: boolean;
  data: {
    verificationId: number;
    expiredAt: string;
    resendCount: number;
    attemptCount: number;
    status: "PENDING" | "VERIFIED" | "EXPIRED";
  };
}

// 인증번호 확인
export interface PhoneVerificationConfirmRequest {
  verificationId: number;
  phone: string;
  code: string;
}

export interface PhoneVerificationConfirmResponse {
  isSuccess: boolean;
  data: {
    verified: boolean;
    status: "PENDING" | "VERIFIED";
    verifiedAt: string;
    isExistingUser: boolean;
    signupToken: string | null;
    userId: number | null;
  };
}

/**
 * 휴대폰 인증번호 요청
 * POST /auth/phone/verification
 */
export const requestPhoneVerification = async (
  payload: PhoneVerificationRequest
): Promise<PhoneVerificationResponse> => {
  const res = await http.post<PhoneVerificationResponse>(
    "/auth/phone/verification",
    payload
  );

  return res.data;
};

/**
 * 휴대폰 인증번호 확인
 * POST /auth/phone/verification/confirm
 */
export const confirmPhoneVerification = async (
  payload: PhoneVerificationConfirmRequest
): Promise<PhoneVerificationConfirmResponse> => {
  const res = await http.post<PhoneVerificationConfirmResponse>(
    "/auth/phone/verification/confirm",
    payload
  );

  return res.data;
};
