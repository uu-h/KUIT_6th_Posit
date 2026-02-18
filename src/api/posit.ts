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
    throw { response: { data: res.data } };
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

export async function adoptAnswer(memoId: number, body: AdoptAnswerRequest) {
  const res = await http.post(`/memos/${memoId}/adopt`, body);

  if (!res.data?.isSuccess) {
    throw { response: { data: res.data } };
  }

  return res.data.data;
}

/* =====================
   답변 거절
===================== */

export type RejectCode = "BUDGET" | "REALISTIC" | "ALREADY" | "ECT";

export interface RejectAnswerRequest {
  rejectCode: RejectCode;
  message: string;
}

export async function rejectAnswer(memoId: number, body: RejectAnswerRequest) {
  const res = await http.post(`/memos/${memoId}/reject`, body);

  if (!res.data?.isSuccess) {
    throw { response: { data: res.data } };
  }

  return res.data.data;
}

export interface MemoDetail {
  memoId: number;
  memoType: "FREE" | "ANSWER";
  title: string;
  content: string;
  createdAt: string;
  status: string;

  writer?: {
    name: string;
    profile?: string;
  };

  images?: string[];
}

export interface GetMemoDetailResponse {
  isSuccess: boolean;
  data: MemoDetail;
}

export async function getMemoDetail(memoId: number) {
  const res = await http.get<GetMemoDetailResponse>(`/memos/${memoId}`);

  if (!res.data?.isSuccess) {
    throw new Error("메모 조회 실패");
  }

  return res.data.data;
}

export interface MemoAdoptionDetail {
  concernTitle: string;
  writer: string;
  adoptedAt: string;
  reward: string;
}

export interface GetMemoAdoptionResponse {
  isSuccess: boolean;
  data: MemoAdoptionDetail;
}

export async function getMemoAdoption(memoId: number) {
  const res = await http.get<GetMemoAdoptionResponse>(
    `/memos/${memoId}/adoption`,
  );

  if (!res.data?.isSuccess) {
    throw new Error("채택 정보 조회 실패");
  }

  return res.data.data;
}
