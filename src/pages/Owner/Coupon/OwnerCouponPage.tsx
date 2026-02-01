import { useMemo, useState } from "react";
import AppBar from "../../../components/Common/AppBar";
import StatSummary from "../../../components/Owner/Home/StatSummary";
import CouponIssuedSectionList from "../../../components/Owner/Coupon/CouponIssuedSectionList";
import LoadMoreButton from "../../../components/Owner/Coupon/LoadMoreButton";

import { ownerCouponMock } from "./coupon.mock";
import {
  countTotalCoupons,
  takeSectionsByItemCount,
} from "../../../utils/Owner/coupon.utils";

const PAGE_SIZE = 7;

export default function OwnerCouponPage() {
  const { stats, sections } = ownerCouponMock;

  const total = useMemo(() => countTotalCoupons(sections), [sections]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const visibleSections = useMemo(
    () => takeSectionsByItemCount(sections, visibleCount),
    [sections, visibleCount],
  );

  const canLoadMore = visibleCount < total;

  return (
    <div className="min-h-dvh w-full bg-[#F4F4F4]">
      <AppBar
        title="쿠폰 관리"
        layout="left"
        leftType="left"
        className="!bg-[#F4F4F4]"
      />

      <main className="px-[16px] pt-[15px] pb-[24px]">
        <StatSummary title="" items={stats} variant="coupon" />

        <div className="mt-[37px]">
          <CouponIssuedSectionList
            sections={visibleSections}
            onDetailClick={(couponId) => {
              void couponId;
            }}
          />
        </div>

        {/* 내역 더보기 */}
        {canLoadMore && (
          <div className="mt-[27px]">
            <LoadMoreButton
              onClick={() =>
                setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, total))
              }
            />
          </div>
        )}
      </main>
    </div>
  );
}
