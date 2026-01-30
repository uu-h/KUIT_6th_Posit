export type CouponStatus = "USED" | "UNUSED";

export type CouponItem = {
  id: number;
  receiverName: string; // @kuit_posit, slowturtle...
  title: string; // 아메리카노 1잔 무료 교환권
  quantity: number; // 수량 1개
  status: CouponStatus; // USED / UNUSED
  imageUrl: string;
};

export type CouponIssuedSection = {
  issuedAt: string; // "2025.12.27"
  items: CouponItem[];
};

export const ownerCouponMock = {
  stats: [
    { label: "누적 지급 수", value: 10, unit: "건" },
    { label: "사용 완료", value: 8, unit: "건" },
    { label: "미사용", value: 2, unit: "건" },
  ],
  sections: [
    {
      issuedAt: "2025.12.27",
      items: [
        {
          id: 1,
          receiverName: "@kuit_posit",
          title: "아메리카노 1잔 무료 교환권",
          quantity: 1,
          status: "USED",
          imageUrl: "/images/coupon/americano.png",
        },
      ],
    },
    {
      issuedAt: "2025.12.26",
      items: [
        {
          id: 2,
          receiverName: "slowturtle",
          title: "디저트 20% 할인 쿠폰",
          quantity: 1,
          status: "USED",
          imageUrl: "/images/coupon/dessert.png",
        },
        {
          id: 3,
          receiverName: "subinn",
          title: "디저트 20% 할인 쿠폰",
          quantity: 1,
          status: "UNUSED",
          imageUrl: "/images/coupon/dessert.png",
        },
      ],
    },
  ],
};
