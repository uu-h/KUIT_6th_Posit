import type { OwnerCouponItemDto } from "../api/ownerCouponManagement";
import type {
  CouponIssuedSection,
  CouponItem,
  CouponStatus,
  CouponType,
} from "../types/coupon.types";

function mapStatus(status: "USED" | "ISSUED" | "EXPIRED"): CouponStatus {
  if (status === "USED") return "USED";
  return "UNUSED";
}

function mapCouponTypeByTitle(title: string): CouponType {
  if (title.includes("아메리카노")) return "AMERICANO_FREE";
  if (title.includes("디저트")) return "DESSERT_20_PERCENT";
  return "ICED_TEA_FREE";
}

function formatIssuedAt(yyyyMmDd: string): string {
  // "2025-12-27" -> "2025.12.27"
  return yyyyMmDd.replaceAll("-", ".");
}

export function mapItemsToSections(
  items: OwnerCouponItemDto[],
): CouponIssuedSection[] {
  const grouped = new Map<string, OwnerCouponItemDto[]>();

  for (const item of items) {
    const key = item.issuedDate; // "2025-12-27"
    const arr = grouped.get(key) ?? [];
    arr.push(item);
    grouped.set(key, arr);
  }

  const sortedDates = Array.from(grouped.keys()).sort((a, b) =>
    a < b ? 1 : -1,
  );

  return sortedDates.map(
    (date): CouponIssuedSection => ({
      issuedAt: formatIssuedAt(date),
      items: (grouped.get(date) ?? []).map(
        (item): CouponItem => ({
          id: item.issuedCouponId,
          receiverName: item.userName,
          couponType: mapCouponTypeByTitle(item.couponTitle),
          quantity: item.quantity,
          status: mapStatus(item.status),
        }),
      ),
    }),
  );
}
