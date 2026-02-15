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
