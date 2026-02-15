import { http } from "./http"; // 경로는 프로젝트에 맞게

export type CouponTemplate = {
  templateId: number;
  title: string;
  description: string;
  validDays: number;
};

export type CouponTemplateListResponse = {
  isSuccess: boolean;
  data: CouponTemplate[];
  meta?: {
    orderType?: string;
    nextCursor?: string;
    hasNext?: boolean;
  };
};

export async function getOwnerCouponTemplates() {
  const res = await http.get<CouponTemplateListResponse>(
    "/owner/coupon-templates",
  );
  return res.data;
}
