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
};

export async function createOwnerConcern(body: CreateOwnerConcernRequest) {
  const res = await http.post<CreateOwnerConcernResponse>(
    "/owner/concerns",
    body,
  );
  return res.data;
}
