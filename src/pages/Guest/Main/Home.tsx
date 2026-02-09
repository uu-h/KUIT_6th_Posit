import BottomSheet, {
  type SheetState,
} from "../../../components/Guest/Main/BottomSheet";
import PopularPlaces from "../../../components/Guest/Main/PopularPlaces";
import PlaceList from "../../../components/Guest/Main/PlaceList";
import type { Place } from "../../../types/place";
import BottomSheetFooter from "../../../components/Guest/Main/BottomSheetFooter";
import CategoryChipBar from "../../../components/Guest/Main/CategoryChipBar";
import NaverMap, {
  type NaverMapHandle,
  type MapCamera,
} from "../../../components/Map/NaverMap";
import SearchContainer from "../../../components/Common/SearchContainer";
import GuestLayout from "../../../layouts/GuestLayout";
import { mapApi, type StoreMarker } from "../../../api/map";
import {
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { StoreDetail } from "../../../types/store";
import { storeDetailMocks } from "../Store/store.mock";
import StoreDetailBody from "../../../components/Guest/Store/StoreDetailBody";
import { useLocation, useNavigate } from "react-router-dom";
import SearchArrowIcon from "../../../assets/Guest/Main/SearchArrow.svg";

const mockPlaces: Place[] = [
  {
    id: 1,
    name: "더이퀼리브리엄커피",
    description: "숲속 감성 담은 루프탑 커피 공간",
    status: "영업 중",
    address: "서울 광진구 자양동 7-30",
    images: [
      "/images/cafe1.jpg",
      "/images/cafe2.jpg",
      "/images/cafe3.jpg",
      "/images/cafe4.jpg",
    ],
  },
  {
    id: 2,
    name: "카페 레이지아워",
    description: "반지하 감성 속 따뜻한 디저트 향기",
    status: "영업 중",
    address: "서울 광진구 화양동 3-75",
    images: [
      "/images/cafe5.jpg",
      "/images/cafe6.jpg",
      "/images/cafe7.jpg",
      "/images/cafe8.jpg",
    ],
  },
  {
    id: 3,
    name: "카페 언필드",
    description: "차분한 2층 감성, 브륄레 치즈케이크",
    status: "영업 중",
    address: "서울 광진구 화양동 49-15",
    images: [
      "/images/cafe9.jpg",
      "/images/cafe10.jpg",
      "/images/cafe11.jpg",
      "/images/cafe12.jpg",
    ],
  },
  {
    id: 4,
    name: "도우터",
    description: "유럽 감성 가득한 여유로운 브런치 공간",
    status: "영업 중",
    address: "서울 광진구 화양동 11-17",
    images: [
      "/images/cafe13.jpg",
      "/images/cafe14.jpg",
      "/images/cafe15.jpg",
      "/images/cafe16.jpg",
    ],
  },
];

const mockMarkers: StoreMarker[] = [
  { storeId: 1, name: "카페 레이지아워", lat: 37.54312, lng: 127.071253 },
  { storeId: 2, name: "마이 디어 버터하우스", lat: 37.544966, lng: 127.069126 },
  { storeId: 3, name: "도우터", lat: 37.542712, lng: 127.070158 },
  { storeId: 4, name: "cafe 462", lat: 37.543181, lng: 127.06788 },
  { storeId: 5, name: "카페 언필드", lat: 37.542093, lng: 127.06594 },
  { storeId: 6, name: "test", lat: 37.538513, lng: 127.133774 },
];

const ENABLE_SERVER = true;

type HomeRestoreState = {
  selectedStoreId?: number | null;
  sheetOpen?: boolean;
  sheetState?: SheetState;
  mapCamera?: MapCamera;
  // (선택) 필터 결과 유지하고 싶으면 사용
  filteredStoreIds?: number[];
  showSearchHere?: boolean;
  openInfoStoreId?: number | null;
};

type HomeLocationState = {
  restoreFromDetail?: HomeRestoreState;
};

export type SearchPlace = {
  id: number;
  name: string;
  address: string;
  lat?: number;
  lng?: number;
};

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const suppressMapMovedRef = useRef(false);

  const mapHandleRef = useRef<NaverMapHandle | null>(null);

  const [allMarkers, setAllMarkers] = useState<StoreMarker[]>(
    ENABLE_SERVER ? [] : mockMarkers,
  );

  const [markers, setMarkers] = useState<StoreMarker[]>(
    ENABLE_SERVER ? [] : mockMarkers,
  );

  const [showSearchHere, setShowSearchHere] = useState(false);

  const toMarkerQueryFromBounds = useCallback(
    (
      b: { minLat: number; minLng: number; maxLat: number; maxLng: number },
      opt?: { keyword?: string; type?: string; limit?: number },
    ) => {
      // 혹시 min/max가 뒤집힐 가능성까지 방어
      const swLat = Math.min(b.minLat, b.maxLat);
      const neLat = Math.max(b.minLat, b.maxLat);
      const swLng = Math.min(b.minLng, b.maxLng);
      const neLng = Math.max(b.minLng, b.maxLng);

      return {
        swLat,
        swLng,
        neLat,
        neLng,
        keyword: opt?.keyword,
        type: opt?.type,
        limit: opt?.limit ?? 20,
      };
    },
    [],
  );

  const fetchMarkersByCurrentBounds = useCallback(
    async (opt?: { keyword?: string; type?: string; limit?: number }) => {
      const bounds = mapHandleRef.current?.getBounds();
      if (!bounds) return;

      // 서버 호출
      const params = toMarkerQueryFromBounds(bounds, opt);
      const res = await mapApi.getMarkers(params);
      const serverMarkers = res.data.data.stores ?? [];

      setAllMarkers(serverMarkers);
      setMarkers(serverMarkers);
    },
    [toMarkerQueryFromBounds],
  );

  useEffect(() => {
    if (!ENABLE_SERVER) return;

    let cancelled = false;

    const run = async () => {
      try {
        // 지도 준비될 때까지 아주 짧게 재시도
        for (let i = 0; i < 10; i++) {
          if (cancelled) return;
          const b = mapHandleRef.current?.getBounds();
          if (b) break;
          await new Promise((r) => setTimeout(r, 150));
        }
        if (cancelled) return;

        await fetchMarkersByCurrentBounds();
      } catch (e) {
        console.error(e);
        // 서버 실패 시 fallback
        setAllMarkers(mockMarkers);
        setMarkers(mockMarkers);
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [fetchMarkersByCurrentBounds]);

  const filterByBounds = useCallback(
    (
      list: StoreMarker[],
      b: { minLat: number; minLng: number; maxLat: number; maxLng: number },
    ) => {
      return list.filter((m) => {
        const inLat = m.lat >= b.minLat && m.lat <= b.maxLat;
        const inLng = m.lng >= b.minLng && m.lng <= b.maxLng;
        return inLat && inLng;
      });
    },
    [],
  );

  const onSearchHere = useCallback(async () => {
    const bounds = mapHandleRef.current?.getBounds();
    if (!bounds) return;

    // 서버 모드: 서버에 bounds로 요청
    if (ENABLE_SERVER) {
      try {
        await fetchMarkersByCurrentBounds();
        setShowSearchHere(false);
        return;
      } catch (e) {
        console.error(e);
        // 서버 실패 시 프론트 필터 fallback
      }
    }

    // 목업/실패 fallback: 프론트 필터
    const filtered = filterByBounds(allMarkers, bounds);
    setMarkers(filtered);
    setShowSearchHere(false);
  }, [ENABLE_SERVER, fetchMarkersByCurrentBounds, filterByBounds, allMarkers]);

  const [selectedStore, setSelectedStore] = useState<StoreDetail | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const isDetailMode = selectedStore !== null;
  const [openInfoStoreId, setOpenInfoStoreId] = useState<number | null>(null);

  const handleMarkerClick = useCallback((storeId: number) => {
    const store =
      storeDetailMocks.find(
        (s) => Number(s.id.replace("store_", "")) === storeId,
      ) ?? null;

    setSelectedStore(store);
    setSheetOpen(true);
    setOpenInfoStoreId(storeId);
  }, []);

  const selectedStoreNumericId = useMemo(() => {
    if (!selectedStore) return null;
    return Number(selectedStore.id.replace("store_", ""));
  }, [selectedStore]);

  const getCenterOffsetPx = useCallback(() => {
    const vh = isDetailMode ? 53 : 38;
    const sheetPx = (window.innerHeight * vh) / 100;
    return sheetPx / 2;
  }, [isDetailMode]);

  const [currentSheetState, setCurrentSheetState] = useState<SheetState>(
    sheetOpen ? "half" : "collapsed",
  );

  // ✅ 상세로 이동할 때 restore를 만들어서 전달
  const onGoDetail = useCallback(() => {
    if (!selectedStoreNumericId) return;

    const cam = mapHandleRef.current?.getCamera() ?? undefined;

    const restore: HomeRestoreState = {
      selectedStoreId: selectedStoreNumericId,
      openInfoStoreId: selectedStoreNumericId,
      sheetOpen: true,
      sheetState: currentSheetState,
      mapCamera: cam,
      filteredStoreIds: markers.map((m) => m.storeId), // 필터 유지용
      showSearchHere,
    };

    navigate(`/stores/${selectedStoreNumericId}`, {
      state: {
        from: "home",
        restore,
      },
    });
  }, [
    selectedStoreNumericId,
    currentSheetState,
    markers,
    showSearchHere,
    navigate,
  ]);

  // ✅ 상세에서 home으로 돌아왔을 때 복원
  const didRestoreRef = useRef(false);

  useEffect(() => {
    if (didRestoreRef.current) return;

    const st = location.state as HomeLocationState | null;
    const restore = st?.restoreFromDetail;
    if (!restore) return;

    didRestoreRef.current = true;

    // 1) 지도 카메라 복원
    if (restore.mapCamera) {
      setTimeout(() => {
        mapHandleRef.current?.setCamera(restore.mapCamera!);
      }, 0);
    }

    // 2) 마커 필터 복원(원하면 유지, 아니면 이 블록 삭제)
    startTransition(() => {
      if (restore.filteredStoreIds && restore.filteredStoreIds.length > 0) {
        setMarkers(
          allMarkers.filter((m) =>
            restore.filteredStoreIds!.includes(m.storeId),
          ),
        );
      }

      // 3) 선택 가게/시트 복원
      if (typeof restore.selectedStoreId === "number") {
        const store =
          storeDetailMocks.find(
            (s) =>
              Number(s.id.replace("store_", "")) === restore.selectedStoreId,
          ) ?? null;
        setSelectedStore(store);
      } else {
        setSelectedStore(null);
      }

      const nextOpen = !!restore.sheetOpen;
      setSheetOpen(nextOpen);
      setCurrentSheetState(
        restore.sheetState ?? (nextOpen ? "half" : "collapsed"),
      );
      setShowSearchHere(!!restore.showSearchHere);

      setOpenInfoStoreId(restore.openInfoStoreId ?? null);
    });

    // 4) 복원 끝 -> state 제거(중복 복원 방지)
    setTimeout(() => {
      navigate(location.pathname, { replace: true, state: null });
    }, 0);
  }, [location.state, location.pathname, navigate, allMarkers]);

  const searchPlaces: SearchPlace[] = useMemo(() => {
    // 1) 마커 기반 (서버든 목업이든 allMarkers가 source)
    // 2) address는 상세 mock에서 붙임(지금 단계에서)
    return allMarkers.map((m) => {
      const detail =
        storeDetailMocks.find(
          (s) => Number(s.id.replace("store_", "")) === m.storeId,
        ) ?? null;

      return {
        id: m.storeId,
        name: m.name,
        address: detail?.fullAddress ?? detail?.shortAddress ?? "",
        lat: m.lat,
        lng: m.lng,
      };
    });
  }, [allMarkers]);

  return (
    <GuestLayout>
      {/* 지도 영역 */}
      <div className="absolute inset-0">
        <NaverMap
          ref={mapHandleRef}
          markers={markers}
          selectedStoreId={selectedStoreNumericId} // ✅ 선택 마커 zIndex만 위로
          openInfoStoreId={openInfoStoreId}
          onMarkerClick={handleMarkerClick}
          onMapClick={() => {
            setSelectedStore(null);
            setSheetOpen(false);
            setOpenInfoStoreId(null);
          }}
          getCenterOffsetPx={getCenterOffsetPx}
          onMapMoved={() => {
            if (suppressMapMovedRef.current) {
              suppressMapMovedRef.current = false; // 1번만 무시
              return;
            }
            setShowSearchHere(true);
          }}
        />

        {showSearchHere && (
          <button
            type="button"
            onClick={onSearchHere}
            className="
              absolute left-1/2 -translate-x-1/2
              bottom-[150px] z-40 h-[40px] px-[15px]
              rounded-full bg-white
              shadow-[0px_2px_4px_0px_rgba(0,0,0,0.25)]
              flex items-center gap-[10px]
            "
          >
            <img src={SearchArrowIcon} alt="재검색" className="h-[20px]" />
            <p className="typo-14-semibold text-primary-01">
              {" "}
              현 지도에서 검색
            </p>
          </button>
        )}
      </div>

      {/* 페이드 오버레이*/}
      <div className="pointer-events-none absolute inset-0 z-10">
        {/* 상단 페이드 */}
        <div
          className="absolute top-0 left-0 right-0 h-[120px]
                        bg-gradient-to-b from-white/80 via-white/20 to-transparent
                        backdrop-blur-[1px]"
        />
      </div>

      {/* 상단 검색 바 */}
      <div className="absolute top-4 left-4 right-4 z-30">
        <SearchContainer
          places={searchPlaces}
          onSelectPlace={(place) => {
            // 프로그램 이동에서는 "현 지도에서 검색" 버튼 뜨지 않게
            suppressMapMovedRef.current = true;
            // 1) 지도 이동
            if (place.lat && place.lng) {
              mapHandleRef.current?.panToWithOffset({
                lat: place.lat,
                lng: place.lng,
                zoom: 16,
                // offsetYPx를 안 넣으면 NaverMap 내부에서 getCenterOffsetPxRef로 계산해서 사용
                // 확실히 하고 싶으면 아래처럼 넣어도 됨:
                // offsetYPx: getCenterOffsetPx(),
              });
            }

            // 2) 마커 클릭과 동일하게 시트 열기
            handleMarkerClick(place.id);
          }}
        />{" "}
      </div>

      {/* 카테고리 칩 */}
      <div className="absolute top-[72px] mt-[10px] left-0 right-0 z-20">
        <CategoryChipBar />
      </div>

      {/* Bottom Sheet */}
      <BottomSheet
        initialState={sheetOpen ? "half" : "collapsed"}
        halfHeight={isDetailMode ? "53vh" : "38vh"}
        disableScrollOnHalf={isDetailMode}
        onStateChange={(state) => {
          setCurrentSheetState(state);

          if (state === "collapsed") {
            setSheetOpen(false);
          }
        }}
        showSortBar={!isDetailMode}
        disableExpanded={isDetailMode}
        onExpandedIntent={onGoDetail}
        popularContent={
          isDetailMode && selectedStore ? (
            <div className="bg-white">
              <StoreDetailBody
                store={selectedStore}
                headerOffset={64}
                hideSectionNav={currentSheetState === "collapsed"}
                onClose={() => {
                  setSheetOpen(false);
                  setSelectedStore(null);
                }}
                px={0}
              />
            </div>
          ) : (
            <PopularPlaces />
          )
        }
        expandedContent={
          <>
            <PlaceList places={mockPlaces} />
            <BottomSheetFooter />
          </>
        }
      />
    </GuestLayout>
  );
}
