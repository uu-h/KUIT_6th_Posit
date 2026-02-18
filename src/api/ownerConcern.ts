import { http } from "./http";

export type CreateOwnerConcernRequest = {
  content: string;
  templateId?: number;
};

export type CreateOwnerConcernResponse = {
  isSuccess: boolean;
  data: {
    concernId: number;
    storeId: number;
    templateId?: number | null;
  };
  errorCode?: string;
  message?: string;
  code?: number;
  errors?: { field: string; message: string }[];
};

export async function createOwnerConcern(body: CreateOwnerConcernRequest) {
  try {
    const res = await http.post<CreateOwnerConcernResponse>(
      "/owner/concerns",
      body,
    );

    // 200인데도 isSuccess=false면 여기서 에러로 전환
    if (!res.data?.isSuccess) {
      const fakeAxiosErr = {
        response: {
          status: 400, // 의미만 주는 값(아무 값이어도 됨)
          data: res.data,
        },
      };
      throw fakeAxiosErr;
    }

    return res.data;
  } catch (err) {
    // 기존 normalizeApiError 흐름을 그대로 쓰기 위해 그대로 throw
    throw err;
  }
}
