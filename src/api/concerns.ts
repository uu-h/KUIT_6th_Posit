import { http } from "./http";

/** 공통 커서 쿼리 */
export type CursorQuery = {
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

/** 공통 응답 타입 */
export type ConcernsResponse = {
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

/** 기존 사장님 코드 호환 유지용 alias */
export type MyConcernsQuery = CursorQuery;
export type MyConcernsResponse = ConcernsResponse;

/** 사장님: 내가 작성한 고민 목록 */
export async function getMyConcerns(params: CursorQuery) {
  const res = await http.get<ConcernsResponse>("/concerns/mine", { params });
  return res.data;
}

/** 게스트: 특정 가게(storeId) 사장님 고민 목록 */
export async function getStoreConcerns(
  params: CursorQuery & { storeId: number },
) {
  const { storeId, ...query } = params;
  const res = await http.get<ConcernsResponse>(
    `/users/stores/${storeId}/concerns`,
    { params: query },
  );
  return res.data;
}
