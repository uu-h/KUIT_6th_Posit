export type CouponType =
  | "AMERICANO_FREE"
  | "DESSERT_20_PERCENT"
  | "ICED_TEA_FREE";

export type CouponStatus = "USED" | "UNUSED";

export type CouponItem = {
  id: number;              
  memoId: number;         
  receiverName: string;
  couponType: CouponType;
  quantity: number;
  status: CouponStatus;
};

export type CouponIssuedSection = {
  issuedAt: string; // "2025.12.27"
  items: CouponItem[];
};
