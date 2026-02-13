import { useEffect, useMemo, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import NaverMap, {
  type NaverMapHandle,
} from "../../../components/Map/NaverMap";
import type { StoreMarker } from "../../../api/map";

type NavState = {
  lat: number;
  lng: number;
  name: string;
};

export default function GuestStoreMapPage() {
  const navigate = useNavigate();
  const { storeId } = useParams();
  const { state } = useLocation();

  const s = state as NavState | null;
  const id = Number(storeId);

  const mapRef = useRef<NaverMapHandle | null>(null);

  // state가 없으면(직접 URL로 들어온 경우) 뒤로 보내거나, 여기서 API로 좌표 재조회해도 됨
  useEffect(() => {
    if (!s || !Number.isFinite(id)) {
      navigate(-1);
    }
  }, [s, id, navigate]);

  const markers: StoreMarker[] = useMemo(() => {
    if (!s || !Number.isFinite(id)) return [];
    return [{ storeId: id, name: s.name, lat: s.lat, lng: s.lng }];
  }, [s, id]);

  // 진입 시 센터 맞추기
  useEffect(() => {
    if (!s || !Number.isFinite(id)) return;
    mapRef.current?.panToWithOffset({ lat: s.lat, lng: s.lng, zoom: 16 });
  }, [s, id]);

  if (!s || !Number.isFinite(id)) return null;

  return (
    <div className="relative w-full h-[100dvh] bg-white">
      <NaverMap
        ref={mapRef}
        markers={markers}
        selectedStoreId={id}
        openInfoStoreId={id}
        getCenterOffsetPx={() => 0}
      />

      {/* 닫기 버튼 */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="absolute top-[14px] right-[14px] z-50
                   w-[40px] h-[40px] 
                   flex items-center justify-center text-neutrals-08 font-bold text-[20px]"
        aria-label="닫기"
      >
        ✕
      </button>
    </div>
  );
}
