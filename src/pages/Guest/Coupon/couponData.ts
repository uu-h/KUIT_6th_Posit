import TerraCoffee from "../../../assets/Guest/Coupon/TerraCoffee.svg";
import LazyHour from "../../../assets/Guest/Coupon/LazyHour.svg";
import CafeUnfield from "../../../assets/Guest/Coupon/CafeUnfield.svg";
import CafeDaughter from "../../../assets/Guest/Coupon/CafeDaughter.svg";

export interface Coupon {
  id: number;
  brand: string;
  menu: string;
  expiration: string;
  brandImg: string;
  isUsed: boolean;
  password: number;
}

export const INITIAL_COUPONS: Coupon[] = [
  {
    id: 1,
    brand: "테라커피",
    menu: "아이스 아메리카노 1잔 무료",
    expiration: "2025.12.19",
    brandImg: TerraCoffee,
    isUsed: false,
    password: 1111,
  },
  {
    id: 2,
    brand: "카페 레이지아워",
    menu: "아이스 아메리카노 1잔 무료",
    expiration: "2026.02.24",
    brandImg: LazyHour,
    isUsed: false,
    password: 2222,
  },
  {
    id: 3,
    brand: "카페 언필드",
    menu: "아이스 아메리카노 1잔 무료",
    expiration: "2026.05.26",
    brandImg: CafeUnfield,
    isUsed: false,
    password: 3333,
  },
  {
    id: 4,
    brand: "카페 도우터",
    menu: "아이스 아메리카노 1잔 무료",
    expiration: "2025.11.30",
    brandImg: CafeDaughter,
    isUsed: false,
    password: 4444,
  },
];
