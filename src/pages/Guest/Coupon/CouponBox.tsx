import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { http } from "../../../api/http"; // axios 인스턴스
import CouponCard from "../../../components/Guest/Coupon/CouponCard";
import UsedToggleButton from "../../../components/Guest/Coupon/UsedToggleButton";
import AppBar from "../../../components/Common/AppBar";
import GuestLayout from "../../../layouts/GuestLayout";

// 서버 쿠폰 타입
interface ApiCoupon {
  couponId: number;
  storeName: string;
  title: string;
  expiredAt: string;
  imageUrl: string;
}

interface CouponResponse {
  coupons: ApiCoupon[];
  meta: {
    orderType: string;
    nextCursor: string;
    hasNext: boolean;
  };
}

// 내부에서 사용할 Coupon 타입
interface Coupon {
  id: number;
  brand: string;      // storeName
  menu: string;       // title
  expiration: string; // expiredAt
  brandImg: string;   // imageUrl
  isUsed: boolean;
}

// ... 상단 import 및 interface는 기존과 동일

export default function CouponBox() {
  const navigate = useNavigate();
  const location = useLocation();

  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [selectedTab, setSelectedTab] = useState<"available" | "used">(
    "available"
  );
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 서버에서 쿠폰 가져오기
  const fetchCoupons = async (
    status: "ISSUED" | "USED" | "EXPIRED", // 대문자로 수정
    size?: number,
    cursor?: string
  ) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        alert("로그인이 필요합니다.");
        navigate("/guest/login");
        return;
      }

      setLoading(true);

      const params: Record<string, string | number> = { status };
      if (typeof size === "number") params.size = size;
      if (cursor) params.cursor = cursor;

      const res = await http.get<{ isSuccess: boolean; data: CouponResponse }>(
        "/coupons",
        { params }
      );

      if (res.data.isSuccess) {
        const newCoupons: Coupon[] = res.data.data.coupons.map((c) => ({
          id: c.couponId,
          brand: c.storeName,
          menu: c.title,
          expiration: c.expiredAt.slice(0, 10),
          brandImg: c.imageUrl,
          isUsed: status === "USED" || status === "EXPIRED",
        }));

        setCoupons((prev) => (cursor ? [...prev, ...newCoupons] : newCoupons));
        setNextCursor(res.data.data.meta.nextCursor);
      }
    } catch (err: unknown) {
      const statusCode =
        typeof err === "object" && err && "response" in err
          ? (err as { response?: { status?: number } }).response?.status
          : undefined;
      if (statusCode === 401 || statusCode === 403) {
        alert("로그인이 필요합니다.");
        navigate("/guest/login");
        return;
      }
      console.error("쿠폰 불러오기 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  // 탭 변경 시에만 호출 (초기 로드 포함)
  useEffect(() => {
    // 탭 상태에 따라 대문자 파라미터 전달
    const statusParam = selectedTab === "available" ? "ISSUED" : "USED";
    fetchCoupons(statusParam);
  }, [selectedTab]); // [] 의존성 배열에서 fetchCoupons를 빼고 selectedTab만 감시

  // 이전 화면에서 사용한 쿠폰 반영 (기존 로직 유지)
  useEffect(() => {
    const usedCouponId = location.state?.usedCouponId;
    if (!usedCouponId) return;

    setCoupons((prev) =>
      prev.map((c) =>
        c.id === Number(usedCouponId) ? { ...c, isUsed: true } : c
      )
    );
    navigate(location.pathname, { replace: true, state: {} });
  }, [location.state?.usedCouponId]);

  // 기존 필터 로직 유지
  const filteredCoupons = coupons.filter((c) =>
    selectedTab === "available" ? !c.isUsed : c.isUsed
  );

  return (
    <GuestLayout active="coupon">
      <div className="h-screen w-full flex flex-col bg-white overflow-hidden">
        <AppBar title="쿠폰함" layout="left" leftType="left" />

        <UsedToggleButton
          selectedTab={selectedTab}
          onChange={setSelectedTab}
          availableCount={coupons.filter((c) => !c.isUsed).length}
          usedCount={coupons.filter((c) => c.isUsed).length}
        />

        <div className="flex-1 overflow-y-auto pt-[57px] pb-[100px] no-scrollbar">
          <div className="flex flex-col gap-[20px] items-center px-[4px]">
            {filteredCoupons.map((coupon) => (
              <CouponCard
                key={coupon.id}
                id={coupon.id} 
                brand={coupon.brand}
                menu={coupon.menu}
                expiration={coupon.expiration}
                brandImg={coupon.brandImg}
                isUsed={coupon.isUsed}
                onClick={() =>
                  navigate(`/guest/coupon/${coupon.id}`, { state: { coupon } })
                }
              />
            ))}
          </div>
        </div>
      </div>
    </GuestLayout>
  );
}
