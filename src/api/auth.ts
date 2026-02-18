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

/* =====================
  중복확인
===================== */

export interface CheckLoginIdResponse {
  isSuccess: boolean;
  data: boolean; // true = 사용 가능, false = 중복
  message?: string;
}

export const checkLoginId = async (
  loginId: string
): Promise<boolean> => {
  const res = await http.get<CheckLoginIdResponse>(
    "/auth/id/confirm",
    {
      params: { loginId },
    }
  );

  if (!res.data?.isSuccess) {
    throw new Error(
      res.data?.message ?? "아이디 중복 확인 실패"
    );
  }

  return res.data.data; // true or false
};
