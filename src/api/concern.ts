import { http } from "./http";
export type ConcernDetailRes = {
  isSuccess: boolean;
  data: {
    concernId: number;
    concernContent: string;
    createdAt: string;
    memos: Array<{
      memoId: number;
      writerName: string;
      title: string;
      content: string;
      createdAt: string;
    }>;
  };
  meta?: {
    orderType?: string;
    nextCursor?: string;
    hasNext?: boolean;
  };
};

export async function getConcernDetail(concernId: string | number) {
  const res = await http.get<ConcernDetailRes>(`/concerns/${concernId}`);
  return res.data;
}
