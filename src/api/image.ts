import { http } from "./http";

/* =====================
   Presigned URL 요청
===================== */

export interface PresignedRequest {
  purpose: "MEMO_IMAGE" | "STORE_IMAGE";
  files: {
    fileName: string;
    contentType: string;
    contentLength: number;
  }[];
}

interface PresignedItem {
  uploadUrl: string;
  imageKey: string;
  expiresInSeconds: number;
}

interface PresignedRawResponse {
  isSuccess: boolean;
  data: {
    items: PresignedItem[];
  };
}

/**
 * presigned 요청 후
 * uploadUrl + 실제 접근 가능한 fileUrl 반환
 */
export const getPresignedUrl = async (
  data: PresignedRequest,
): Promise<{ uploadUrl: string; fileUrl: string }> => {
  const res = await http.post<PresignedRawResponse>(
    "/images/presigned-url",
    data,
  );

  const response = res.data;

  if (!response?.data?.items || response.data.items.length === 0) {
    throw new Error("Presigned 응답 구조 이상");
  }

  const { uploadUrl, imageKey } = response.data.items[0];

  // S3 공개 접근 URL 직접 생성
  const fileUrl = `https://posit-deploy.s3.ap-northeast-2.amazonaws.com/${imageKey}`;

  return { uploadUrl, fileUrl };
};

// imageKey도 반환하는 함수 추가
export const getPresignedUrlWithKey = async (
  data: PresignedRequest,
): Promise<{ uploadUrl: string; fileUrl: string; imageKey: string }> => {
  const res = await http.post<PresignedRawResponse>(
    "/images/presigned-url",
    data,
  );

  const response = res.data;
  if (!response?.data?.items || response.data.items.length === 0) {
    throw new Error("Presigned 응답 구조 이상");
  }

  const { uploadUrl, imageKey } = response.data.items[0];
  const fileUrl = `https://posit-deploy.s3.ap-northeast-2.amazonaws.com/${imageKey}`;
  return { uploadUrl, fileUrl, imageKey };
};

/* =====================
   S3 업로드
===================== */

export const uploadToS3 = async (uploadUrl: string, file: File) => {
  const response = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
    },
    body: file,
  });

  if (!response.ok) {
    throw new Error("S3 업로드 실패");
  }
};
