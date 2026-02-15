export type MemoType = "ANSWER" | "FREE";

export type FreeType =
  | "TIP"
  | "MARKETING"
  | "MENU_DEV"
  | "TREND"
  | "CUSTOMER_SERVICE";

export type MemoImage = {
  imageKey: string;
  order: number;
};

// FREE 메모 (자유 의견)
export type CreateFreeMemoRequest = {
  memoType: "FREE";
  freeType: FreeType;
  title: string;
  content: string;
  images: MemoImage[];
};

// ANSWER 메모 (사장님 고민 답변)
export type CreateAnswerMemoRequest = {
  memoType: "ANSWER";
  concernId: number;
  title: string;
  content: string;
  images: MemoImage[];
};

export type CreateMemoRequest = CreateFreeMemoRequest | CreateAnswerMemoRequest;

export type CreateMemoResponse = {
  isSuccess: boolean;
  code?: string;
  message?: string;
  data: {
    memoId: number;
    memoType: MemoType; // "ANSWER" | "FREE"
    createdAt: string; // ISO string
    status: string; // 서버 enum 있으면 더 좁혀도 됨
  };
};
