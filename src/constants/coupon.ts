import type { CouponType } from "../types/coupon.types";
import CoffeeImg from "../assets/images/Coffee.png";
import DessertImg from "../assets/images/Dessert.png";
import IceTeaImg from "../assets/images/IceTea.png";

export const COUPON_META: Record<
  CouponType,
  {
    title: string;
    imageUrl: string;
  }
> = {
  AMERICANO_FREE: {
    title: "아메리카노 1잔 무료 쿠폰",
    imageUrl: CoffeeImg,
  },
  DESSERT_20_PERCENT: {
    title: "디저트 20% 할인 쿠폰",
    imageUrl: DessertImg,
  },
  ICED_TEA_FREE: {
    title: "아이스티 1잔 무료 쿠폰",
    imageUrl: IceTeaImg,
  },
};
