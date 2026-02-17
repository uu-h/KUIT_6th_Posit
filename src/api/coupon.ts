import { http } from "./http";

/* =========================
   쿠폰 템플릿 조회
========================= */

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

/* =========================
   쿠폰 관리 (통계 + 목록)
========================= */

export interface CouponManagementSummary {
  totalIssuedCount: number;
  usedCount: number;
  unusedCount: number;
}

export interface IssuedCouponItem {
  issuedCouponId: number;
  issuedDate: string;
  userName: string;
  couponTitle: string;
  memoId: number;

  couponThumbnailUrl: string;
  quantity: number;
  status: string;
}

export interface CouponManagementMeta {
  orderType: string;
  nextCursor: string | null;
  hasNext: boolean;
}

export interface CouponManagementData {
  summary: CouponManagementSummary;
  items: IssuedCouponItem[];
}

export interface GetCouponManagementResponse {
  isSuccess: boolean;
  data: CouponManagementData;
  meta: CouponManagementMeta;
}

export async function getOwnerCouponManagement(
  size = 10,
  cursorId?: number
) {
  const res = await http.get<GetCouponManagementResponse>(
    "/owner/coupon-management",
    {
      params: {
        size,
        cursorId,
      },
    }
  );

  if (!res.data?.isSuccess) {
    throw new Error("쿠폰 관리 조회 실패");
  }

  return res.data;
}

/* =========================
   쿠폰 채택 상세 조회
========================= */

export interface CouponAdoptionDetailResponse {
  isSuccess: boolean;
  data: {
    source: "CONCERN" | "FREE";
    concern?: {
      title: string;
    };
    answer: {
      writerName: string;
      title: string;
      content: string;
      createdAt: string;
      imageUrl?: string;
    };
  };
}

export async function getCouponAdoptionDetail(memoId: number) {
  const res = await http.get<CouponAdoptionDetailResponse>(
    `/memos/${memoId}/adoption`
  );

  if (!res.data?.isSuccess) {
    throw new Error("쿠폰 채택 상세 조회 실패");
  }

  return res.data.data;
}
