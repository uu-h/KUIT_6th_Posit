import { http } from "./http";

export type Gender = "MALE" | "FEMALE";

export type MeResponse = {
  isSuccess: boolean;
  data: {
    loginId: string;
    name: string;
    phone: string;
    birthDate: string; // YYYY-MM-DD
    gender: Gender;
  };
};

export async function getMe(): Promise<MeResponse["data"]> {
  const res = await http.get<MeResponse>("/users/me");

  // 서버가 항상 isSuccess를 주는 구조라면 최소한의 가드
  if (!res.data.isSuccess) {
    throw new Error("Failed to fetch /users/me");
  }

  return res.data.data;
}
