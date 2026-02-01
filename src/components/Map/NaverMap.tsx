import { useEffect, useRef, useState } from "react";
import type { StoreDetail } from "../../types/store";
import StoreDotIcon from "../../assets/Map/StoreMarker.svg";
import MyLocationIcon from "../../assets/Map/MylocationPin.svg";

type NaverMapProps = {
  stores: StoreDetail[];
};

export default function NaverMap({ stores }: NaverMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // 지도 인스턴스
  const mapRef = useRef<naver.maps.Map | null>(null);

  // 가게 마커들 (이미지 마커)
  const storeMarkersRef = useRef<naver.maps.Marker[]>([]);

  // 내 위치(블루닷) 마커
  const myMarkerRef = useRef<naver.maps.Marker | null>(null);

  // 클릭 시 표시할 InfoWindow (하나만 재사용)
  const infoWindowRef = useRef<naver.maps.InfoWindow | null>(null);

  // map click 리스너 보관 (cleanup용)
  const mapClickListenerRef = useRef<naver.maps.MapEventListener | null>(null);

  const [locating, setLocating] = useState(false);

  // 1) 지도 생성 (최초 1회)
  useEffect(() => {
    if (!containerRef.current) return;
    if (!window.naver) return;

    const first = stores[0];
    const center = first
      ? new window.naver.maps.LatLng(first.lat, first.lng)
      : new window.naver.maps.LatLng(37.5665, 126.978);

    const map = new window.naver.maps.Map(containerRef.current, {
      center,
      zoom: 16,
    });

    mapRef.current = map;

    // InfoWindow 1개 생성 (스타일은 여기서 통일)
    infoWindowRef.current = new window.naver.maps.InfoWindow({
      content: "",
      borderWidth: 0,
      disableAnchor: true,
      backgroundColor: "transparent",
      // 점 마커 아래에 띄우기 (값 조절 가능)
      pixelOffset: new window.naver.maps.Point(0, 60),
    });

    // 지도 빈 곳 클릭하면 닫기
    mapClickListenerRef.current = window.naver.maps.Event.addListener(
      map,
      "click",
      () => {
        infoWindowRef.current?.close();
      },
    );

    return () => {
      // cleanup - 가게 마커
      storeMarkersRef.current.forEach((m) => m.setMap(null));
      storeMarkersRef.current = [];

      // 내 위치 마커
      myMarkerRef.current?.setMap(null);
      myMarkerRef.current = null;

      // infowindow
      infoWindowRef.current?.close();
      infoWindowRef.current = null;

      // map click listener
      if (mapClickListenerRef.current) {
        window.naver.maps.Event.removeListener(mapClickListenerRef.current);
        mapClickListenerRef.current = null;
      }

      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2) stores 바뀌면: 마커 다시 생성 + 마커 클릭 시 InfoWindow 띄우기
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (!window.naver) return;

    // stores 바뀌면 열려있던 인포윈도우는 닫아두자
    infoWindowRef.current?.close();

    // 기존 마커 제거
    storeMarkersRef.current.forEach((m) => m.setMap(null));
    storeMarkersRef.current = [];

    const iconSize = 36;

    const nextDots: naver.maps.Marker[] = [];

    stores.forEach((store) => {
      const position = new window.naver.maps.LatLng(store.lat, store.lng);

      const dotMarker = new window.naver.maps.Marker({
        position,
        map,
        icon: {
          url: StoreDotIcon,
          size: new window.naver.maps.Size(iconSize, iconSize),
          scaledSize: new window.naver.maps.Size(iconSize, iconSize),
          origin: new window.naver.maps.Point(0, 0),
          // ✅ 점(원) 마커면 중앙 앵커가 제일 자연스러움
          anchor: new window.naver.maps.Point(iconSize / 2, iconSize / 2),
          // 만약 네 아이콘이 "핀(아래 뾰족)" 형태면 아래로 바꿔:
          // anchor: new window.naver.maps.Point(iconSize / 2, iconSize),
        },
        clickable: true,
        zIndex: 100,
      });

      // 마커 클릭 시 가게 이름 InfoWindow 띄우기
      window.naver.maps.Event.addListener(dotMarker, "click", () => {
        const info = infoWindowRef.current;
        if (!info) return;

        info.setContent(`
          <div style="
            height: 17px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
            font-size: 14px;
      line-height: 16px;
      font-weight: 500;
              white-space: nowrap;
              user-select: none;
            ">
            ${escapeHtml(store.name)}
          </div>
        `);

        // ✅ 이게 핵심: marker에 붙여 열면 위치가 자연스럽게 따라감
        info.open(map, dotMarker);
      });

      nextDots.push(dotMarker);
    });

    storeMarkersRef.current = nextDots;
  }, [stores]);

  // 3) 내 위치로 이동 + 블루닷
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

        map.panTo(myLatLng);

        myMarkerRef.current?.setMap(null);

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
            anchor: new window.naver.maps.Point(9, 9),
          },
          zIndex: 300,
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
      <div ref={containerRef} className="w-full h-full" />
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
        <img src={MyLocationIcon} className="h-[48px]" />
      </button>
      console.log("naver maps", !!window.naver?.maps); console.log("InfoWindow",
      window.naver?.maps?.InfoWindow);
    </div>
  );
}

function escapeHtml(input: string) {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
