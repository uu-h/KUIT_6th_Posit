import { useState, useEffect, useCallback, useMemo, useRef } from "react";
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
  status: "ISSUED" | "USED" | "EXPIRED" | string;
}

interface CouponListResponse {
  isSuccess: boolean;
  data: ApiCoupon[];
  meta?: {
    nextCursor?: string | null;
    hasNext?: boolean;
    orderType?: string | null;
  };
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

type Status = "ISSUED" | "USED";
type Tab = "available" | "used";

/**
 * 우회안:
 * - 서버 커서(meta.nextCursor) 계약이 깨져 있어서( nextCursor:null + hasNext:true )
 *   페이지네이션/더보기는 쓰지 않고,
 * - size를 크게(예: 100) 해서 탭별로 "한 번에" 가져온다.
 */
const PAGE_SIZE = 100;

type PageState = {
  items: Coupon[];
  loading: boolean;
  initialized: boolean;
};

export default function CouponBox() {
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedTab, setSelectedTab] = useState<Tab>("available");

  const [pages, setPages] = useState<Record<Status, PageState>>({
    ISSUED: { items: [], loading: false, initialized: false },
    USED: { items: [], loading: false, initialized: false },
  });

  // 최신 pages 참조용 ref (stale 방지)
  const pagesRef = useRef(pages);
  useEffect(() => {
    pagesRef.current = pages;
  }, [pages]);

  const status: Status = selectedTab === "available" ? "ISSUED" : "USED";
  const coupons = pages[status].items;

  const counts = useMemo(
    () => ({
      available: pages.ISSUED.items.length,
      used: pages.USED.items.length,
    }),
    [pages],
  );

  const mapCoupons = useCallback((list: ApiCoupon[]): Coupon[] => {
    return list.map((c) => ({
      id: c.couponId,
      brand: c.storeName,
      menu: c.title,
      condition: c.condition,
      expiration: c.expiredAt?.slice(0, 10),
      brandImg: c.imageUrl,
      isUsed: c.status !== "ISSUED",
    }));
  }, []);

  const requireTokenOrRedirect = useCallback(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/guest/login");
      return null;
    }
    return token;
  }, [navigate]);

  // 탭별 "한 번에" 가져오기 (더보기 없음)
  const fetchAllOnce = useCallback(
    async (s: Status) => {
      const current = pagesRef.current[s];
      if (current.loading) return;

      const token = requireTokenOrRedirect();
      if (!token) return;

      setPages((prev) => ({
        ...prev,
        [s]: { ...prev[s], loading: true, initialized: true },
      }));

      try {
        const res = await http.get<CouponListResponse>("/coupons", {
          params: {
            status: s,
            size: PAGE_SIZE,
          },
        });

        if (!res.data?.isSuccess) return;

        const newItems = mapCoupons(res.data.data ?? []);

        setPages((prev) => ({
          ...prev,
          [s]: {
            ...prev[s],
            items: newItems, // 통째로 교체
          },
        }));
      } catch (e) {
        console.error("쿠폰 로딩 실패:", e);
      } finally {
        setPages((prev) => ({
          ...prev,
          [s]: { ...prev[s], loading: false },
        }));
      }
    },
    [mapCoupons, requireTokenOrRedirect],
  );

  // 최초 렌더링: 두 탭 다 미리 로드(탭 전환 즉시)
  useEffect(() => {
    fetchAllOnce("ISSUED");
    fetchAllOnce("USED");
  }, [fetchAllOnce]);

  // 탭 전환 시: 아직 시도 안 했으면 로드
  useEffect(() => {
    const st = pages[status];
    if (!st.initialized && !st.loading) {
      fetchAllOnce(status);
    }
  }, [status, pages, fetchAllOnce]);

  // 사용 완료 처리 반영 (상세에서 돌아올 때)
  useEffect(() => {
    const usedCouponId = (location.state as any)?.usedCouponId;
    if (!usedCouponId) return;

    const idNum = Number(usedCouponId);

    setPages((prev) => {
      const issued = prev.ISSUED.items;
      const target = issued.find((c) => c.id === idNum);
      if (!target) return prev;

      const nextIssued = issued.filter((c) => c.id !== idNum);
      const nextUsed = [{ ...target, isUsed: true }, ...prev.USED.items];

      return {
        ...prev,
        ISSUED: { ...prev.ISSUED, items: nextIssued },
        USED: { ...prev.USED, items: nextUsed },
      };
    });

    navigate(location.pathname, { replace: true, state: {} });
  }, [location.state, location.pathname, navigate]);

  const isLoading = pages[status].loading;

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
          {coupons.map((coupon) => (
            <CouponCard
              key={coupon.id}
              {...coupon}
              onClick={() =>
                navigate(`/guest/coupon/${coupon.id}`, { state: { coupon } })
              }
            />
          ))}

          {isLoading && (
            <div className="text-gray-400 text-sm mb-[16px]">
              불러오는 중...
            </div>
          )}

          {coupons.length === 0 && !isLoading && (
            <div className="text-gray-400 mt-10">쿠폰이 없습니다</div>
          )}
        </div>
      </div>

      <BottomBar active="coupon" onChange={() => {}} />
    </div>
  );
}
