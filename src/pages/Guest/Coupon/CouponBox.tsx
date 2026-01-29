import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { INITIAL_COUPONS } from "./couponData";
import type { Coupon } from "./couponData"; // 1번 문제 해결
import CouponCard from "../../../components/Guest/Coupon/CouponCard";
import UsedToggleButton from "../../../components/Guest/Coupon/UsedToggleButton";
import BottomBar from "../../../components/BottomBar/BottomBar";
import AppBar from "../../../components/Common/AppBar";

export default function CouponBox() {
  const navigate = useNavigate();
  const location = useLocation();
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [selectedTab, setSelectedTab] = useState<"available" | "used">("available");

useEffect(() => {
  const usedCouponId = location.state?.usedCouponId;
  

  if (!usedCouponId) return;

  setCoupons((prev) =>
    prev.map((c) => (c.id === Number(usedCouponId) ? { ...c, isUsed: true } : c))
  );

  navigate(location.pathname, { replace: true, state: {} });

}, [location.state?.usedCouponId]);

  const filteredCoupons = coupons.filter(c => 
    selectedTab === "available" ? !c.isUsed : c.isUsed
  );

  return (
    <div className="h-screen w-full flex flex-col bg-white overflow-hidden">
      <AppBar title="쿠폰함" layout="left" leftType="left" />
      
      <UsedToggleButton
        selectedTab={selectedTab}
        onChange={setSelectedTab}
        availableCount={coupons.filter(c => !c.isUsed).length}
        usedCount={coupons.filter(c => c.isUsed).length}
      />

      <div className="flex-1 overflow-y-auto pt-[57px] pb-[100px] no-scrollbar">
        <div className="flex flex-col gap-[20px] items-center px-[4px]">
          {filteredCoupons.map(coupon => (
            <CouponCard 
              key={coupon.id} 
              {...coupon} 
              onClick={() => navigate(`/guest/coupon/${coupon.id}`, { state: { coupon } })} 
            />
          ))}
        </div>
      </div>

      <BottomBar active="coupon" />
    </div>
  );
}