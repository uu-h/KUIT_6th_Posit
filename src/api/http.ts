import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
import {
  refreshAccessToken,
  tokenStore,
  normalizeBearer,
  logout,
} from "./auth";

type AnyObj = Record<string, any>;

localStorage.setItem(
  "accessToken",
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI5IiwiaWF0IjoxNzcwMjg1MTI2LCJleHAiOjE3NzAyODYwMjYsInRva2VuVHlwZSI6IkFDQ0VTUyIsInJvbGUiOiLsp4Tsp5zsgqzsnqXri5gifQ.5pTE_O7p2rK0qUEqn-iHfo6GCAhoSiuZIIwB5FUqDm0",
);
localStorage.setItem(
  "refreshToken",
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI5IiwiaWF0IjoxNzcwMjg1MTI2LCJleHAiOjE3NzE0OTQ3MjYsInRva2VuVHlwZSI6IlJFRlJFU0gifQ.6vhIKqiwktVfU1tBqr_RKRHPGadUMV7vGl3eblFDsFE",
);

// export const http = axios.create({
//   baseURL: "/api",
//   headers: { "Content-Type": "application/json" },
// });

// http.interceptors.request.use((config) => {
//   const token = localStorage.getItem("accessToken");

//   // 혹시 이미 Bearer가 붙어있는 토큰을 받을 수도 있어서 안전하게 처리
//   if (token) {
//     const value = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
//     config.headers.Authorization = value;
//   }
//   return config;
// });
export const http: AxiosInstance = axios.create({
  baseURL: "",
  withCredentials: true, // 쿠키 방식 섞일 수 있으니 유지 (원치 않으면 false)
  headers: {
    "Content-Type": "application/json",
  },
});

/** refresh 동시 호출 방지용 */
let isRefreshing = false;

/** refresh 기다리는 요청 큐 */
let pendingQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

function enqueueTokenRequest() {
  return new Promise<string>((resolve, reject) => {
    pendingQueue.push({ resolve, reject });
  });
}

function flushQueueWithToken(token: string) {
  pendingQueue.forEach((p) => p.resolve(token));
  pendingQueue = [];
}

function flushQueueWithError(err: unknown) {
  pendingQueue.forEach((p) => p.reject(err));
  pendingQueue = [];
}

/**
 * 요청 인터셉터: accessToken 붙이기
 * - /api/auth/refresh 는 auth.ts의 refreshClient로만 호출하므로 여기서 따로 예외처리 안 해도 됨
 */
http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const access = tokenStore.getAccess();
  if (access) {
    const raw = normalizeBearer(access);
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${raw}`;
  }
  return config;
});

/**
 * 응답 인터셉터:
 * - 401이면 refresh를 1번만 시도
 * - refresh 실패 시 무한 재시도 금지: 바로 logout + reject
 */
http.interceptors.response.use(
  (res) => res,
  async (error: AxiosError<AnyObj>) => {
    const original = error.config as
      | (InternalAxiosRequestConfig & {
          _retry?: boolean;
        })
      | null;

    const status = error.response?.status;

    // 원본 config가 없으면 그대로 종료
    if (!original) return Promise.reject(error);

    // refresh 요청은 auth.ts의 refreshClient로만 하므로,
    // 여기서 refresh endpoint에 대한 루프는 원천 차단되어 있음.
    // 그럼에도 방어적으로 _retry 체크는 유지.
    if (status !== 401) return Promise.reject(error);
    if (original._retry) return Promise.reject(error);

    original._retry = true;

    // refreshToken 자체가 없으면 더 시도하지 않음
    if (!tokenStore.getRefresh()) {
      logout();
      return Promise.reject(error);
    }

    // 이미 refresh 중이면 큐에 대기시킴
    if (isRefreshing) {
      try {
        const newToken = await enqueueTokenRequest();
        original.headers = original.headers ?? {};
        original.headers.Authorization = `Bearer ${normalizeBearer(newToken)}`;
        return http.request(original);
      } catch (e) {
        return Promise.reject(e);
      }
    }

    // refresh 시작
    isRefreshing = true;

    try {
      const newAccess = await refreshAccessToken();
      isRefreshing = false;

      // 대기 중이던 요청들에 토큰 전달
      flushQueueWithToken(newAccess);

      // 원래 요청 재시도
      original.headers = original.headers ?? {};
      original.headers.Authorization = `Bearer ${normalizeBearer(newAccess)}`;
      return http.request(original);
    } catch (refreshErr) {
      isRefreshing = false;

      // 대기 큐 전부 실패 처리
      flushQueueWithError(refreshErr);

      // refresh 실패 → 무한루프 금지: 토큰 삭제 및 종료
      logout();
      return Promise.reject(refreshErr);
    }
  },
);
