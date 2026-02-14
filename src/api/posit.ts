import type { CreateMemoRequest, CreateMemoResponse } from "../types/posit";
import { http } from "./http";

/* =====================
   메모 생성
===================== */
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

/* =====================
   답변 채택
===================== */

export interface AdoptAnswerRequest {
  couponTemplateId: number;
  message: string;
}

export async function adoptAnswer(
  memoId: number,
  body: AdoptAnswerRequest,
) {
  const res = await http.post(
    `/memos/${memoId}/adopt`,
    body,
  );

  if (!res.data?.isSuccess) {
    throw new Error(res.data?.message ?? "답변 채택 실패");
  }

  return res.data.data;
}


/* =====================
   답변 거절
===================== */

export type RejectCode =
  | "BUDGET"
  | "REALISTIC"
  | "ALREADY"
  | "ECT";

export interface RejectAnswerRequest {
  rejectCode: RejectCode;
  message: string;
}

export async function rejectAnswer(
  memoId: number,
  body: RejectAnswerRequest,
) {
  const res = await http.post(
    `/memos/${memoId}/reject`,
    body,
  );

  if (!res.data?.isSuccess) {
    throw new Error(res.data?.message ?? "답변 거절 실패");
  }

  return res.data.data;
}