import { useEffect, useRef, useState } from "react";
import type { StoreDetail } from "../../types/store";
import StoreDotIcon from "../../assets/Map/StoreMarker.svg";

type NaverMapProps = {
  stores: StoreDetail[];
};

export default function NaverMap({ stores }: NaverMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // 지도 인스턴스
  const mapRef = useRef<naver.maps.Map | null>(null);

  // 가게 마커들
  const storeMarkersRef = useRef<naver.maps.Marker[]>([]);

  // 내 위치(블루닷) 마커
  const myMarkerRef = useRef<naver.maps.Marker | null>(null);

  const [locating, setLocating] = useState(false);

  // 1) 지도 생성 (최초 1회)
  useEffect(() => {
    if (!containerRef.current) return;
    if (!window.naver) return;

    const first = stores[0];
    const center = first
      ? new window.naver.maps.LatLng(first.lat, first.lng)
      : new window.naver.maps.LatLng(37.5665, 126.978); // 기본: 서울시청 근처

    mapRef.current = new window.naver.maps.Map(containerRef.current, {
      center,
      zoom: 16,
    });

    return () => {
      // cleanup
      storeMarkersRef.current.forEach((m) => m.setMap(null));
      storeMarkersRef.current = [];

      myMarkerRef.current?.setMap(null);
      myMarkerRef.current = null;

      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2) stores 바뀌면 가게 마커 다시 생성
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (!window.naver) return;

    // 기존 마커 제거
    storeMarkersRef.current.forEach((m) => m.setMap(null));
    storeMarkersRef.current = [];

    // 새 마커 생성
    const nextMarkers = stores.map((store) => {
      const size = 36;

      const marker = new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(store.lat, store.lng),
        map,
        icon: {
          content: `
        <div style="
          display: flex;
          flex-direction: column;
          align-items: center;
          transform: translateY(-4px);
        ">
          <img
            src="${StoreDotIcon}"
            style="
              width: ${size}px;
              height: ${size}px;
            "
          />
          <div style="
            font-size: 14px;
            font-weight: 500;
            
            white-space: nowrap;
          ">
            ${store.name}
          </div>
        </div>
      `,
          anchor: new window.naver.maps.Point(size / 2, size),
        },
      });

      return marker;
    });

    storeMarkersRef.current = nextMarkers;
  }, [stores]);

  // 3) 내 위치로 이동 + 블루닷(줌 상관없이 크기 고정)
  const moveToMyLocation = () => {
    const map = mapRef.current;
    if (!map) return;

    if (!navigator.geolocation) {
      alert("이 브라우저에서는 위치 기능을 지원하지 않아요.");
      return;
    }

    setLocating(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        if (!window.naver) return;

        const { latitude, longitude } = pos.coords;
        const myLatLng = new window.naver.maps.LatLng(latitude, longitude);

        // 지도 이동
        map.panTo(myLatLng);

        // 기존 블루닷 제거
        myMarkerRef.current?.setMap(null);

        // 블루닷(픽셀 고정 아이콘)
        myMarkerRef.current = new window.naver.maps.Marker({
          position: myLatLng,
          map,
          icon: {
            content: `
              <div style="
                width: 18px;
                height: 18px;
                background: #1190FF;
                border: 3px solid white;
                border-radius: 50%;
                box-shadow: 0 0 6px rgba(45,127,249,0.6);
              "></div>
            `,
            anchor: new window.naver.maps.Point(7, 7),
          },
        });
      },
      (err) => {
        setLocating(false);

        if (err.code === err.PERMISSION_DENIED) {
          alert(
            "위치 권한이 거부되었어요. 브라우저 설정에서 위치 권한을 허용해주세요.",
          );
          return;
        }
        if (err.code === err.POSITION_UNAVAILABLE) {
          alert("현재 위치를 확인할 수 없어요.");
          return;
        }
        if (err.code === err.TIMEOUT) {
          alert("위치 요청 시간이 초과되었어요. 잠시 후 다시 시도해주세요.");
          return;
        }
        alert("현재 위치를 가져오지 못했어요.");
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 0,
      },
    );
  };

  return (
    <div className="relative w-full h-full">
      {/* 지도 */}
      <div ref={containerRef} className="w-full h-full" />

      {/* 내 위치 버튼 */}
      <button
        type="button"
        onClick={moveToMyLocation}
        disabled={locating}
        className="
          absolute right-4 bottom-[180px] z-30
          w-[44px] h-[44px] rounded-full bg-white
          shadow-[0px_2px_10px_rgba(0,0,0,0.15)]
          flex items-center justify-center
          disabled:opacity-50
        "
        aria-label="내 위치로 이동"
      >
        <span className="text-[18px]">📍</span>
      </button>
    </div>
  );
}
