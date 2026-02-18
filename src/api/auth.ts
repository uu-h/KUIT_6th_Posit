import { http } from "./http";

/* =====================
   로그인
===================== */

export interface LoginRequest {
  loginId: string;
  password: string;
}

export interface LoginResponse {
  isSuccess: boolean;
  data: {
    user: {
      userId: number;
      role: "GUEST" | "OWNER";
    };
    tokens: {
      accessToken: string;
      refreshToken: string;
    };
  };
}

export const login = async (
  data: LoginRequest
): Promise<LoginResponse> => {
  const res = await http.post<LoginResponse>("/auth/login", data);
  return res.data;
};

/* =====================
   회원가입
===================== */

export type UserRole = "GUEST" | "OWNER";
export type Gender = "MALE" | "FEMALE";

export interface SignUpRequest {
  role: UserRole;
  loginId: string;
  password: string;
  name: string;
  phone: string;
  gender: Gender;
  birth: string; // YYYY-MM-DD
  signupToken?: string;
}

export interface OwnerProfile {
  businessNumber: string;
  couponPin: string;
}

export interface OwnerSignUpRequest extends SignUpRequest {
  role: "OWNER";
  ownerProfile: OwnerProfile;
}

export type UnifiedSignUpRequest =
  | SignUpRequest
  | OwnerSignUpRequest;

export interface SignUpResponse {
  isSuccess: boolean;
  data: {
    user: {
      userId: number;
      role: UserRole;
    };
    tokens: {
      accessToken: string;
      refreshToken: string;
    };
  };
}

export const signup = async (
  data: UnifiedSignUpRequest
): Promise<SignUpResponse> => {
  const res = await http.post<SignUpResponse>("/auth/signup", data);
  return res.data;
};
