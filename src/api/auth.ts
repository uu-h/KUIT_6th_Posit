import { http } from "./http";

export interface LoginRequest {
  loginId: string;
  password: string;
}

export const login = (data: LoginRequest) => {
  return http.post("/auth/login", data);
};