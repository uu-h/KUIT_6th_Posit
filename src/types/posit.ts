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

export type CreateMemoRequest = {
  memoType: MemoType; // 여기선 "FREE"만 씀
  freeType: FreeType;
  title: string;
  content: string;
  images: MemoImage[];
  // concernId?: number; // 답변일 때만
};

export type CreateMemoResponse = {
  isSuccess: boolean;
  data: {
    memoId: number;
    memoType: MemoType;
    createdAt: string; // ISO string
    status: "REVIEWING" | string;
  };
  message: string;
};
