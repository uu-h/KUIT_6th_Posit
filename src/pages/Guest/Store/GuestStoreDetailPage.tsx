import AppBar from "../../../components/Common/AppBar";
import type { StoreDetail } from "../../../types/store";
import { storeDetailMocks } from "./store.mock";
import StoreDetailBody from "../../../components/Guest/Store/StoreDetailBody";
import GuestLayout from "../../../layouts/GuestLayout";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useMemo } from "react";

type GuestStoreDetailLocationState = {
  restore?: unknown; // 복원 데이터의 구체 타입을 알면 더 좁혀도 좋아요
  from?: "home" | "posit" | "coupon" | "my" | string;
};

export default function GuestStoreDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { storeId } = useParams();

  const state = location.state as GuestStoreDetailLocationState | null;
  const restore = state?.restore;
  const from = state?.from;

  const goBackToHomeWithRestore = () => {
    if (from === "home" && restore) {
      navigate("/guest/home", {
        state: { restoreFromDetail: restore },
      });
      return;
    }
    navigate(-1);
  };

  const store: StoreDetail | null = useMemo(() => {
    const idNum = Number(storeId);
    if (!Number.isFinite(idNum)) return null;

    return (
      storeDetailMocks.find(
        (s) => Number(s.id.replace("store_", "")) === idNum,
      ) ?? null
    );
  }, [storeId]);

  if (!store) {
    return (
      <GuestLayout active="home">
        <AppBar
          title="가게 정보 없음"
          layout="left"
          leftType="left"
          rightType="close"
        />
        <div className="p-4">존재하지 않는 가게입니다.</div>
      </GuestLayout>
    );
  }

  return (
    <GuestLayout active="home">
      <AppBar
        title={store.name}
        layout="left"
        leftType="left"
        onBack={goBackToHomeWithRestore}
      />
      <StoreDetailBody store={store} headerOffset={64} />
    </GuestLayout>
  );
}
