import { http } from "./http";

export type IssuedCouponStatus = "USED" | "ISSUED" | "EXPIRED";

export type OwnerCouponSummaryDto = {
  totalIssuedCount: number;
  usedCount: number;
  unusedCount: number;
};

export type OwnerCouponItemDto = {
  issuedCouponId: number;
  issuedDate: string;
  userName: string;
  couponTitle: string;
  couponThumbnailUrl: string;
  quantity: number;
  status: IssuedCouponStatus;
};

export type OwnerCouponManagementResDto = {
  isSuccess: boolean;
  data: {
    summary: OwnerCouponSummaryDto;
    items: OwnerCouponItemDto[];
  };
  meta: {
    orderType: string | null;
    nextCursor: string | null;
    hasNext: boolean;
  };
};

export async function getOwnerCouponManagement(params: {
  size: number;
  cursorId?: string;
}) {
  const res = await http.get<OwnerCouponManagementResDto>(
    "/owner/coupon-management",
    { params },
  );
  return res.data;
}
