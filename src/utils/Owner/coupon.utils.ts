import type { CouponIssuedSection } from "../../types/coupon.types";

export function countTotalCoupons(sections: CouponIssuedSection[]) {
  return sections.reduce((sum, s) => sum + s.items.length, 0);
}

/**
 * 섹션 구조는 유지한 채로, "앞에서부터 maxItems개"만 남기기
 * (날짜 섹션 경계를 고려하면서도 전체 개수 기준으로 잘림)
 */
export function takeSectionsByItemCount(
  sections: CouponIssuedSection[],
  maxItems: number,
): CouponIssuedSection[] {
  if (maxItems <= 0) return [];

  let remaining = maxItems;
  const result: CouponIssuedSection[] = [];

  for (const section of sections) {
    if (remaining <= 0) break;

    const items = section.items.slice(0, remaining);
    if (items.length > 0) {
      result.push({ ...section, items });
      remaining -= items.length;
    }
  }

  return result;
}
