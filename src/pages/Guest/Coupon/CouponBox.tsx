import { useState } from "react";
import CouponCard from "../../../components/Guest/Coupon/CouponCard";
import UsedToggleButton from "../../../components/Guest/Coupon/UsedToggleButton";
import BottomBar from "../../../components/BottomBar/BottomBar";
import AppBar from "../../../components/Common/AppBar";

/* 타입 */
interface Coupon {
  id: number;
  brand: string;
  menu: string;
  expiration: string;
  brandImg: string;
  isUsed: boolean;
}

/* 임시 데이터 (나중에 API로 대체) */
const COUPONS: Coupon[] = [
  {
    id: 1,
    brand: "테라커피",
    menu: "아이스 아메리카노 1잔 무료",
    expiration: "2025.12.19까지",
    brandImg: "src/assets/Guest/Coupon/TerraCoffee.svg",
    isUsed: true,
  },
  {
    id: 2,
    brand: "카페 레이지아워",
    menu: "아이스 아메리카노 1잔 무료",
    expiration: "2026.02.24까지",
    brandImg: "src/assets/Guest/Coupon/LazyHour.svg",
    isUsed: true,
  },
  {
    id: 3,
    brand: "카페 언필드",
    menu: "아이스 아메리카노 1잔 무료",
    expiration: "2026.05.26까지",
    brandImg: "src/assets/Guest/Coupon/CafeUnfield.svg",
    isUsed: false,
  },
  {
    id: 4,
    brand: "카페 도우터",
    menu: "아이스 아메리카노 1잔 무료",
    expiration: "2025.11.30까지",
    brandImg: "src/assets/Guest/Coupon/CafeDaughter.svg",
    isUsed: false,
  },
];

export default function CouponBox() {
  const [selectedTab, setSelectedTab] =
    useState<"available" | "used">("available");

  const [coupons, setCoupons] = useState<Coupon[]>(COUPONS);

  const availableCount = coupons.filter(c => !c.isUsed).length;
  const usedCount = coupons.filter(c => c.isUsed).length;

  const filteredCoupons = coupons.filter(c =>
    selectedTab === "available" ? !c.isUsed : c.isUsed
  );

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden bg-white">
      {/* 헤더 */}
      <AppBar title="쿠폰함" layout="left" leftType="left"></AppBar>

      {/* 탭 */}
      <UsedToggleButton
        selectedTab={selectedTab}
        onChange={setSelectedTab}
        availableCount={availableCount}
        usedCount={usedCount}
      />

      {/* 쿠폰 리스트 */}
      <div className="flex-1 overflow-y-auto pt-[57px] pb-[177px] no-scrollbar">
        <div className="flex flex-col gap-[37px] items-center px-[4px]">
          {filteredCoupons.map(coupon => (
            <CouponCard key={coupon.id} {...coupon} />
          ))}
        </div>
      </div>

      <BottomBar active="coupon" onChange={() => {}} />
    </div>
  );
}
