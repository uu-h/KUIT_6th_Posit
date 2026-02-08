// src/api/auth.ts
import axios, { AxiosError } from "axios";

export type RefreshResponse = {
  accessToken: string;
  refreshToken?: string; // 서버가 재발급해주면 사용
};

export type AuthError = {
  isSuccess?: boolean;
  errorCode?: string;
  code?: number;
  message?: string;
};

const ACCESS_KEY = "accessToken";
const REFRESH_KEY = "refreshToken";

/** 토큰 저장소(필요하면 localStorage -> sessionStorage로 바꿔도 됨) */
export const tokenStore = {
  getAccess(): string | null {
    return localStorage.getItem(ACCESS_KEY);
  },
  setAccess(token: string) {
    localStorage.setItem(ACCESS_KEY, token);
  },
  getRefresh(): string | null {
    return localStorage.getItem(REFRESH_KEY);
  },
  setRefresh(token: string) {
    localStorage.setItem(REFRESH_KEY, token);
  },
  clear() {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};

/** "Bearer xxx" 형태로 들어오는 실수 방지 */
export function normalizeBearer(token: string) {
  return token.startsWith("Bearer ") ? token.slice(7) : token;
}

/**
 * ⚠️ refresh는 "인터셉터가 붙지 않는" 전용 axios로 호출해야 무한루프가 안 남.
 * - baseURL은 Vite dev proxy 사용 시 "" 로 두고 /api/...로 호출
 * - 쿠키 방식이면 withCredentials: true 유지
 */
const refreshClient = axios.create({
  baseURL: "",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

/**
 * refresh API 호출 (무한 재시도 방지: 여기서는 절대 http.ts 인스턴스 사용 금지)
 * - body로 { refreshToken } 보내는 현재 네 상황 기준
 */
export async function refreshAccessToken(): Promise<string> {
  const refreshToken = tokenStore.getRefresh();
  if (!refreshToken) throw new Error("NO_REFRESH_TOKEN");

  const rawRefresh = normalizeBearer(refreshToken);

  try {
    const res = await refreshClient.post<RefreshResponse>("/api/auth/refresh", {
      refreshToken: rawRefresh,
    });

    if (!res.data?.accessToken) throw new Error("NO_ACCESS_TOKEN_IN_REFRESH");

    tokenStore.setAccess(res.data.accessToken);

    // 서버가 refreshToken도 재발급하면 업데이트
    if (res.data.refreshToken) {
      tokenStore.setRefresh(res.data.refreshToken);
    }

    return res.data.accessToken;
  } catch (e) {
    const err = e as AxiosError<AuthError>;

    // refresh 실패면 토큰 정리(= 더 이상 refresh 시도 안 하게)
    tokenStore.clear();

    // 원인 파악용(콘솔에서 바로 보이게)
    const status = err.response?.status;
    const payload = err.response?.data;
    console.error("[refreshAccessToken] failed", { status, payload });

    throw err;
  }
}

/** 앱에서 명시적으로 로그아웃 처리할 때 */
export function logout() {
  tokenStore.clear();
}
