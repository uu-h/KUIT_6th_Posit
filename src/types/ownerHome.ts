export type OwnerHomeResponse = {
  isSuccess: boolean;
  data: OwnerHomeData;
  meta?: {
    orderType?: string;
    nextCursor?: string;
    hasNext?: boolean;
  };
};

export type OwnerHomeData = {
  storeName: string;
  ownerNickname: string;
  stats: {
    totalMemoCount: number;
    issuedCouponCount: number;
    adoptedCount: number;
  };
  newMemoCount: number;
  myConcerns: Array<{
    concernId: number;
    content: string;
    createdAt: string; // ISO
    commentCount: number;
  }>;
};
