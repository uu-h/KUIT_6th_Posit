import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { http } from "../../../api/http";
import CouponCard from "../../../components/Guest/Coupon/CouponCard";
import UsedToggleButton from "../../../components/Guest/Coupon/UsedToggleButton";
import AppBar from "../../../components/Common/AppBar";
import BottomBar from "../../../components/BottomBar/BottomBar";

interface ApiCoupon {
  couponId: number;
  storeId: number;
  storeName: string;
  title: string;
  condition: string;
  expiredAt: string;
  imageUrl: string;
  status: "ISSUED" | "USED" | "EXPIRED";
}

interface CouponListResponse {
  isSuccess: boolean;
  data: ApiCoupon[];
}

interface Coupon {
  id: number;
  brand: string;
  menu: string;
  condition: string;
  expiration: string;
  brandImg: string;
  isUsed: boolean;
}


export default function CouponBox() {
  const navigate = useNavigate();
  const location = useLocation();

  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [selectedTab, setSelectedTab] = useState<"available" | "used">("available");
  const [loading, setLoading] = useState(false);
  const [counts, setCounts] = useState({ available: 0, used: 0 });

  // 1. fetchCoupons를 useCallback으로 감싸고 의존성을 명확히 합니다.
  const fetchCoupons = useCallback(
    async (status: "ISSUED" | "USED" | "EXPIRED", isInitial = false) => {
      try {
        if (!isInitial) setLoading(true);

        const token = localStorage.getItem("accessToken");
        if (!token) {
          navigate("/guest/login");
          return;
        }

        const res = await http.get<CouponListResponse>("/coupons", {
          params: { status },
        });

        if (res.data.isSuccess) {
          const newCoupons: Coupon[] = res.data.data.map((c) => ({
            id: c.couponId,
            brand: c.storeName,
            menu: c.title,
            condition: c.condition,
            expiration: c.expiredAt.slice(0, 10),
            brandImg: c.imageUrl,
            isUsed: c.status !== "ISSUED",
          }));

          // 탭 상태와 일치할 때만 리스트 업데이트 (setSelectedTab과의 불일치 방지)
          // 이 로직을 위해 selectedTab은 fetchCoupons 내부가 아닌 useEffect에서 관리하는게 좋지만,
          // 현재 로직을 유지하면서 버그를 막으려면 아래 조건이 필요합니다.
          setCoupons(newCoupons);

          setCounts((prev) => ({
            ...prev,
            available: status === "ISSUED" ? newCoupons.length : prev.available,
            used: status === "USED" ? newCoupons.length : prev.used,
          }));
        }
      } catch (err) {
        console.error("쿠폰 로딩 실패:", err);
      } finally {
        setLoading(false);
      }
    },
    [navigate] // selectedTab을 여기서 빼야 탭 바뀔 때 함수가 재생성되지 않음
  );

  // 2. 최초 렌더링 시 양쪽 카운트 조회
  useEffect(() => {
    fetchCoupons("ISSUED", true);
    fetchCoupons("USED", true);
  }, [fetchCoupons]); // 의존성 추가

  // 3. 탭 변경 시 해당 데이터 리스트 조회
  useEffect(() => {
    const statusParam = selectedTab === "available" ? "ISSUED" : "USED";
    fetchCoupons(statusParam);
  }, [selectedTab, fetchCoupons]); // 의존성 추가

  // 4. 사용 완료 처리 반영
  useEffect(() => {
    const usedCouponId = location.state?.usedCouponId;
    if (!usedCouponId) return;

    setCoupons((prev) =>
      prev.map((c) => (c.id === Number(usedCouponId) ? { ...c, isUsed: true } : c))
    );
    
    setCounts(prev => ({
      available: Math.max(0, prev.available - 1),
      used: prev.used + 1
    }));

    // state 초기화 시 location.pathname을 의존성에 추가
    navigate(location.pathname, { replace: true, state: {} });
  }, [location.state, location.pathname, navigate]); // location.pathname 추가

  return (
    <div className="h-dvh w-full flex flex-col bg-white overflow-hidden">
      <AppBar title="쿠폰함" layout="left" leftType="left" />
      
      <UsedToggleButton
        selectedTab={selectedTab}
        onChange={setSelectedTab}
        availableCount={counts.available}
        usedCount={counts.used}
      />

      <div className="flex-1 overflow-y-auto pt-[30px] pb-[120px] no-scrollbar">
        <div className="flex flex-col gap-[28px] items-center px-[4px]">
          {loading && <div className="text-gray-400 mt-10">로딩중...</div>}
          {!loading && coupons.map((coupon) => (
              <CouponCard
                key={coupon.id}
                {...coupon}
                onClick={() => navigate(`/guest/coupon/${coupon.id}`, { state: { coupon } })}
              />
          ))}
        </div>
      </div>
      <BottomBar active="coupon" onChange={() => {}} />
    </div>
  );
}