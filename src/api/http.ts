import axios from "axios";

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
