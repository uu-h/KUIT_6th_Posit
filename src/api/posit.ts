import type { CreateMemoRequest, CreateMemoResponse } from "../types/posit";
import { http } from "./http";

export async function createStoreMemo(
  storeId: number,
  body: CreateMemoRequest,
) {
  const res = await http.post<CreateMemoResponse>(
    `/stores/${storeId}/memos`,
    body,
  );

  if (!res.data?.isSuccess) {
    throw new Error(res.data?.message ?? "메모 등록 실패");
  }
  return res.data.data; // { memoId, memoType, createdAt, status }
}
