import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import StoreDotIcon from "../../assets/Map/StoreMarker.svg";
import MyLocationIcon from "../../assets/Map/MylocationPin.svg";
import type { StoreMarker } from "../../api/map";

export type MapBounds = {
  minLat: number;
  minLng: number;
  maxLat: number;
  maxLng: number;
};

export type MapCamera = {
  center: { lat: number; lng: number };
  zoom: number;
};

export type NaverMapHandle = {
  getBounds: () => MapBounds | null;
  getCamera: () => MapCamera | null;
  setCamera: (cam: MapCamera) => void;
};

type NaverMapProps = {
  markers: StoreMarker[];
  onMarkerClick?: (storeId: number) => void;
  onMapClick?: () => void;

  /** 마커 클릭 후 지도 센터를 보정(픽셀 단위) */
  getCenterOffsetPx?: () => number;

  /** 지도를 움직였을 때(Home에서 버튼 띄우기 용) */
  onMapMoved?: () => void;

  /** 선택된 마커 storeId (복원/하이라이트용) */
  selectedStoreId?: number | null;
  openInfoStoreId?: number | null;
};

const NaverMap = forwardRef<NaverMapHandle, NaverMapProps>(function NaverMap(
  {
    markers,
    onMarkerClick,
    onMapClick,
    getCenterOffsetPx,
    onMapMoved,
    selectedStoreId,
    openInfoStoreId,
  },
  ref,
) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const getCenterOffsetPxRef = useRef(getCenterOffsetPx);
  useEffect(() => {
    getCenterOffsetPxRef.current = getCenterOffsetPx;
  }, [getCenterOffsetPx]);

  const mapRef = useRef<naver.maps.Map | null>(null);

  const storeMarkersRef = useRef<naver.maps.Marker[]>([]);
  const myMarkerRef = useRef<naver.maps.Marker | null>(null);
  const infoWindowRef = useRef<naver.maps.InfoWindow | null>(null);

  const mapClickListenerRef = useRef<naver.maps.MapEventListener | null>(null);
  const markerClickListenersRef = useRef<naver.maps.MapEventListener[]>([]);
  const movedListenersRef = useRef<naver.maps.MapEventListener[]>([]);

  const onMarkerClickRef = useRef(onMarkerClick);
  useEffect(() => {
    onMarkerClickRef.current = onMarkerClick;
  }, [onMarkerClick]);

  const [locating, setLocating] = useState(false);

  const onMapMovedRef = useRef(onMapMoved);
  useEffect(() => {
    onMapMovedRef.current = onMapMoved;
  }, [onMapMoved]);

  const selectedStoreIdRef = useRef(selectedStoreId);
  useEffect(() => {
    selectedStoreIdRef.current = selectedStoreId;
  }, [selectedStoreId]);

  // ✅ Home에서 bounds/camera 가져가게 노출
  useImperativeHandle(ref, () => ({
    getBounds: () => {
      const map = mapRef.current;
      if (!map || !window.naver) return null;

      const b = map.getBounds() as unknown as naver.maps.LatLngBounds;

      const sw = b.getSW();
      const ne = b.getNE();

      return {
        minLat: sw.lat(),
        minLng: sw.lng(),
        maxLat: ne.lat(),
        maxLng: ne.lng(),
      };
    },

    getCamera: () => {
      const map = mapRef.current;
      if (!map || !window.naver) return null;

      // 타입을 LatLng로 강제
      const c = map.getCenter() as unknown as naver.maps.LatLng;

      return {
        center: { lat: c.lat(), lng: c.lng() },
        zoom: map.getZoom(),
      };
    },

    setCamera: (cam) => {
      const map = mapRef.current;
      if (!map || !window.naver) return;

      map.setCenter(
        new window.naver.maps.LatLng(cam.center.lat, cam.center.lng),
      );
      map.setZoom(cam.zoom);
    },
  }));

  // 1) 지도 생성
  useEffect(() => {
    if (!containerRef.current) return;
    if (!window.naver) return;

    const first = markers[0];
    const center = first
      ? new window.naver.maps.LatLng(first.lat, first.lng)
      : new window.naver.maps.LatLng(37.5665, 126.978);

    const map = new window.naver.maps.Map(containerRef.current, {
      center,
      zoom: 16,
    });

    mapRef.current = map;

    infoWindowRef.current = new window.naver.maps.InfoWindow({
      content: "",
      borderWidth: 0,
      disableAnchor: true,
      backgroundColor: "transparent",
      pixelOffset: new window.naver.maps.Point(0, 60),
    });

    mapClickListenerRef.current = window.naver.maps.Event.addListener(
      map,
      "click",
      () => {
        infoWindowRef.current?.close();
        onMapClick?.();
      },
    );

    // ✅ 지도 이동 감지 (드래그/줌/idle 조합)
    const onMoved = () => onMapMovedRef.current?.();
    movedListenersRef.current = [
      window.naver.maps.Event.addListener(map, "dragend", onMoved),
      window.naver.maps.Event.addListener(map, "zoom_changed", onMoved),
    ];

    return () => {
      storeMarkersRef.current.forEach((m) => m.setMap(null));
      storeMarkersRef.current = [];

      markerClickListenersRef.current.forEach((l) =>
        window.naver.maps.Event.removeListener(l),
      );
      markerClickListenersRef.current = [];

      myMarkerRef.current?.setMap(null);
      myMarkerRef.current = null;

      infoWindowRef.current?.close();
      infoWindowRef.current = null;

      if (mapClickListenerRef.current) {
        window.naver.maps.Event.removeListener(mapClickListenerRef.current);
        mapClickListenerRef.current = null;
      }

      movedListenersRef.current.forEach((l) =>
        window.naver.maps.Event.removeListener(l),
      );
      movedListenersRef.current = [];

      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2) markers 바뀌면 마커 재생성
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !window.naver) return;

    infoWindowRef.current?.close();

    storeMarkersRef.current.forEach((m) => m.setMap(null));
    storeMarkersRef.current = [];

    markerClickListenersRef.current.forEach((l) =>
      window.naver.maps.Event.removeListener(l),
    );
    markerClickListenersRef.current = [];

    const iconSize = 36;
    const nextDots: naver.maps.Marker[] = [];

    markers.forEach((store) => {
      const position = new window.naver.maps.LatLng(store.lat, store.lng);

      const dotMarker = new window.naver.maps.Marker({
        position,
        map,
        icon: {
          url: StoreDotIcon,
          size: new window.naver.maps.Size(iconSize, iconSize),
          scaledSize: new window.naver.maps.Size(iconSize, iconSize),
          origin: new window.naver.maps.Point(0, 0),
          anchor: new window.naver.maps.Point(iconSize / 2, iconSize / 2),
        },
        clickable: true,
        zIndex:
          store.storeId === (selectedStoreIdRef.current ?? -1) ? 200 : 100,
      });

      dotMarker.set("storeId", store.storeId);

      const listener = window.naver.maps.Event.addListener(
        dotMarker,
        "click",
        () => {
          const info = infoWindowRef.current;
          if (!info) return;

          const offsetY = getCenterOffsetPxRef.current?.() ?? 0;
          const projection = map.getProjection();
          const positionPoint = projection.fromCoordToOffset(position);

          const newPoint = new window.naver.maps.Point(
            positionPoint.x,
            positionPoint.y + offsetY,
          );
          const newCoord = projection.fromOffsetToCoord(newPoint);

          map.panTo(newCoord);
          onMapMovedRef.current?.();

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

          info.open(map, dotMarker);
          onMarkerClickRef.current?.(store.storeId);
        },
      );

      markerClickListenersRef.current.push(listener);
      nextDots.push(dotMarker);
    });

    storeMarkersRef.current = nextDots;
  }, [markers]); // selectedStoreId 변경에도 zIndex 반영

  useEffect(() => {
    const map = mapRef.current;
    const info = infoWindowRef.current;
    if (!map || !info || !window.naver) return;
    if (!openInfoStoreId) return;

    // 1) storeId에 해당하는 마커 찾기
    const targetMarker =
      storeMarkersRef.current.find(
        (m) => (m.get("storeId") as number | undefined) === openInfoStoreId,
      ) ?? null;

    if (!targetMarker) return;

    // 2) 이름 찾기 (markers 배열에서)
    const store = markers.find((s) => s.storeId === openInfoStoreId);
    if (!store) return;

    // 3) content는 기존 클릭 시와 동일하게
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

    // ✅ 지도 이동(panTo) 없이 그대로 열기 (카메라는 Home에서 이미 복원)
    info.open(map, targetMarker);
  }, [openInfoStoreId, markers]);

  useEffect(() => {
    if (!window.naver) return;

    const selectedId = selectedStoreIdRef.current ?? null;

    storeMarkersRef.current.forEach((marker) => {
      const id = marker.get("storeId") as number | undefined;
      marker.setZIndex(id && selectedId === id ? 200 : 100);
    });
  }, [selectedStoreId]);

  // 3) 내 위치 이동
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
        onMapMovedRef.current?.();

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
      () => {
        setLocating(false);
        alert("현재 위치를 가져오지 못했어요.");
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 },
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
          absolute right-4 bottom-[150px] z-30
          w-[44px] h-[44px] rounded-full bg-white
          shadow-[0px_2px_10px_rgba(0,0,0,0.15)]
          flex items-center justify-center
          disabled:opacity-50
        "
        aria-label="내 위치로 이동"
      >
        <img src={MyLocationIcon} className="h-[48px]" />
      </button>
    </div>
  );
});

export default NaverMap;

function escapeHtml(input: string) {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
