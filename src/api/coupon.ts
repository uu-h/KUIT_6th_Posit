import { http } from "./http";

export interface CouponTemplate {
  templateId: number;
  title: string;
  description: string;
  validDays: number;
}

export interface GetCouponTemplatesResponse {
  isSuccess: boolean;
  data: CouponTemplate[];
}

export async function getOwnerCouponTemplates() {
  const res = await http.get<GetCouponTemplatesResponse>(
    "/owner/coupon-templates"
  );

  if (!res.data?.isSuccess) {
    throw new Error("쿠폰 목록 조회 실패");
  }

  return res.data.data;
}
