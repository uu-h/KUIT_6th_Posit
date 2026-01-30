import type { CouponType } from "../types/coupon.types";

export const COUPON_META: Record<
  CouponType,
  {
    title: string;
    imageUrl: string;
  }
> = {
  AMERICANO_FREE: {
    title: "아메리카노 1잔 무료 쿠폰",
    imageUrl: "/images/coupon/americano.png",
  },
  DESSERT_20_PERCENT: {
    title: "디저트 20% 할인 쿠폰",
    imageUrl: "/images/coupon/dessert.png",
  },
  ICED_TEA_FREE: {
    title: "아이스티 1잔 무료 쿠폰",
    imageUrl: "/images/coupon/iced-tea.png",
  },
};
