import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import AppBar from "../../../components/Common/AppBar";
import StoreDetailBody from "../../../components/Guest/Store/StoreDetailBody";
import GuestLayout from "../../../layouts/GuestLayout";

import type { StoreDetail } from "../../../types/store";
import { mapApi, mapStoreDetailDtoToStoreDetail } from "../../../api/map";

type GuestStoreDetailLocationState = {
  restore?: unknown;
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

  const idNum = useMemo(() => Number(storeId), [storeId]);

  const [store, setStore] = useState<StoreDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!Number.isFinite(idNum)) {
      setStore(null);
      setLoading(false);
      return;
    }

    let cancelled = false;

    const run = async () => {
      setLoading(true);
      try {
        const res = await mapApi.getStoreDetail(idNum);

        if (!res.data.isSuccess) {
          throw new Error("API returned isSuccess=false");
        }

        const mapped = mapStoreDetailDtoToStoreDetail(res.data.data);

        if (!cancelled) setStore(mapped);
      } catch (e) {
        console.error(e);
        if (!cancelled) setStore(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [idNum]);

  if (!Number.isFinite(idNum)) {
    return (
      <GuestLayout active="home">
        <AppBar
          title="가게 정보 없음"
          layout="left"
          leftType="left"
          onBack={goBackToHomeWithRestore}
        />
        <div className="p-4">잘못된 가게 ID 입니다.</div>
      </GuestLayout>
    );
  }

  if (loading) {
    return (
      <GuestLayout active="home">
        <AppBar
          title="가게 상세"
          layout="left"
          leftType="left"
          onBack={goBackToHomeWithRestore}
        />
        <div className="p-4">불러오는 중...</div>
      </GuestLayout>
    );
  }

  if (!store) {
    return (
      <GuestLayout active="home">
        <AppBar
          title="가게 정보 없음"
          layout="left"
          leftType="left"
          onBack={goBackToHomeWithRestore}
        />
        <div className="p-4">가게 정보를 불러오지 못했어요.</div>
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
