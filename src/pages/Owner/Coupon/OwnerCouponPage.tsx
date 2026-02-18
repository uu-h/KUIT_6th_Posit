import { useMemo } from "react";
import AppBar from "../../../components/Common/AppBar";
import StatSummary from "../../../components/Owner/Home/StatSummary";
import CouponIssuedSectionList from "../../../components/Owner/Coupon/CouponIssuedSectionList";
import LoadMoreButton from "../../../components/Owner/Coupon/LoadMoreButton";

import { useOwnerCouponManagementInfinite } from "../../../hooks/useOwnerCouponManagementInfinite";
import { mapItemsToSections } from "../../../utils/ownerCoupon.mapper";
import { useNavigate } from "react-router-dom";

type StatItem = {
  label: string;
  value: number;
  unit: string;
};

const SIZE = 3;

export default function OwnerCouponPage() {
  const navigate = useNavigate();

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useOwnerCouponManagementInfinite(SIZE);

  const summary = data?.summary;
  const flatItems = data?.flatItems ?? [];

  // 통계 매핑
  const stats: StatItem[] = useMemo(() => {
    if (!summary) return [];

    return [
      { label: "누적 지급", value: summary.totalIssuedCount, unit: "개" },
      { label: "사용 완료", value: summary.usedCount, unit: "개" },
      { label: "미사용", value: summary.unusedCount, unit: "개" },
    ];
  }, [summary]);

  // 날짜별 그룹핑
  const sections = useMemo(() => {
    return mapItemsToSections(flatItems);
  }, [flatItems]);

  if (isLoading) {
    return (
      <div className="min-h-dvh w-full bg-[#F4F4F4]">
        <AppBar
          title="쿠폰 관리"
          layout="left"
          leftType="left"
          className="!bg-[#F4F4F4]"
        />
        <main className="px-[16px] pt-[15px] pb-[24px]">로딩중...</main>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-dvh w-full bg-[#F4F4F4]">
        <AppBar
          title="쿠폰 관리"
          layout="left"
          leftType="left"
          className="!bg-[#F4F4F4]"
        />
        <main className="px-[16px] pt-[15px] pb-[24px]">
          <p>쿠폰 데이터를 불러오지 못했습니다.</p>
          <button className="mt-2 underline" onClick={() => refetch()}>
            다시 시도
          </button>
        </main>
      </div>
    );
  }

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
            sections={sections}
            onDetailClick={(memoId) => {
              navigate(`/owner/home/coupon-adoptions/${memoId}`);
            }}
          />
        </div>

        {hasNextPage && (
          <div className="mt-[27px]">
            <LoadMoreButton
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              label={isFetchingNextPage ? "불러오는 중..." : "내역 더보기"}
            />
          </div>
        )}
        {!hasNextPage && flatItems.length > 0 && (
          <p className="typo-12-medium text-center py-3">마지막이에요</p>
        )}
      </main>
    </div>
  );
}
