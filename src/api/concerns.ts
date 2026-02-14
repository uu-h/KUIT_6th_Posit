import { http } from "./http";

export type MyConcernsQuery = {
  cursorId?: number;
  size?: number;
};

export type ConcernDto = {
  concernId: number;
  title: string;
  content: string;
  commentCount: number;
  createdAt: string; // ISO
  resolved: boolean;
};

export type MyConcernsResponse = {
  isSuccess: boolean;
  data: {
    concerns: ConcernDto[];
  };
  meta: {
    orderType: string;
    nextCursor: string | null;
    hasNext: boolean;
  };
};

export async function getMyConcerns(params: MyConcernsQuery) {
  const res = await http.get<MyConcernsResponse>("/concerns/mine", { params });
  return res.data;
}
