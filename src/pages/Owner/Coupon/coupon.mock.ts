import type { CouponIssuedSection } from "../../../types/coupon.types";

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
          couponType: "AMERICANO_FREE",
          quantity: 1,
          status: "USED",
        },
      ],
    },
    {
      issuedAt: "2025.12.26",
      items: [
        {
          id: 2,
          receiverName: "slowturtle",
          couponType: "DESSERT_20_PERCENT",
          quantity: 1,
          status: "USED",
        },
        {
          id: 3,
          receiverName: "subinn",
          couponType: "DESSERT_20_PERCENT",
          quantity: 1,
          status: "USED",
        },
      ],
    },
    {
      issuedAt: "2025.12.25",
      items: [
        {
          id: 4,
          receiverName: "Ryuuu",
          couponType: "AMERICANO_FREE",
          quantity: 1,
          status: "USED",
        },
      ],
    },
    {
      issuedAt: "2025.12.24",
      items: [
        {
          id: 5,
          receiverName: "yeon",
          couponType: "ICED_TEA_FREE",
          quantity: 1,
          status: "UNUSED",
        },
      ],
    },
    {
      issuedAt: "2025.12.23",
      items: [
        {
          id: 6,
          receiverName: "yeon",
          couponType: "ICED_TEA_FREE",
          quantity: 1,
          status: "USED",
        },
      ],
    },
    {
      issuedAt: "2025.12.22",
      items: [
        {
          id: 7,
          receiverName: "yeon",
          couponType: "ICED_TEA_FREE",
          quantity: 1,
          status: "UNUSED",
        },
        {
          id: 8,
          receiverName: "yeon",
          couponType: "ICED_TEA_FREE",
          quantity: 1,
          status: "UNUSED",
        },
      ],
    },
    {
      issuedAt: "2025.12.21",
      items: [
        {
          id: 9,
          receiverName: "yeon",
          couponType: "AMERICANO_FREE",
          quantity: 1,
          status: "USED",
        },
      ],
    },
  ] satisfies CouponIssuedSection[],
};
