import axios, { AxiosError } from "axios";
import { emitToast } from "../utils/toastBus";

export const http = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  /* 회원가입/휴대폰 인증 관련 API는 로그인 토큰이 없어야 정상 동작하므로 Authorization 헤더를 붙이지 않음 */
  const isPublicAuthApi =
    config.url?.includes("/auth/phone") ||
    config.url?.includes("/auth/signup") ||
    config.url?.includes("/auth/login");

  if (token && !isPublicAuthApi) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

http.interceptors.response.use(
  (res) => res,
  (error: AxiosError<any>) => {
    // 1) 네트워크 에러 (응답 자체가 없음)
    if (!error.response) {
      emitToast({ message: "네트워크 연결을 확인해주세요." });
      return Promise.reject(error);
    }

    const status = error.response.status;
    const url = error.config?.url;

    const isPublicAuthApi =
      url?.includes("/auth/phone") ||
      url?.includes("/auth/signup") ||
      url?.includes("/auth/login");

    // 2) 401 인증 만료/실패
    if (status === 401 && !isPublicAuthApi) {
      localStorage.removeItem("accessToken");
      emitToast({ message: "로그인이 만료됐어요. 다시 로그인해주세요." });

      // 라우터 훅은 여기서 못 쓰니까 window 이동
      window.location.href = "/login";
      return Promise.reject(error);
    }

    // 3) 5xx 서버 에러
    if (status >= 500) {
      emitToast({
        message: "서버 오류가 발생했어요. 잠시 후 다시 시도해주세요.",
      });
      return Promise.reject(error);
    }

    // 나머지(400/404 등)는 페이지/훅에서 상황별 처리
    return Promise.reject(error);
  },
);
