import BottomSheet, {
  type SheetState,
} from "../../../components/Guest/Main/BottomSheet";
import PopularPlaces from "../../../components/Guest/Main/PopularPlaces";
import PlaceList from "../../../components/Guest/Main/PlaceList";
import BottomSheetFooter from "../../../components/Guest/Main/BottomSheetFooter";
import CategoryChipBar, {
  type CategoryTypeCode,
} from "../../../components/Guest/Main/CategoryChipBar";
import NaverMap, {
  type NaverMapHandle,
  type MapCamera,
} from "../../../components/Map/NaverMap";
import SearchContainer from "../../../components/Common/SearchContainer";
import GuestLayout from "../../../layouts/GuestLayout";
import {
  mapApi,
  mapStoreDetailDtoToStoreDetail,
  type StoreMarker,
} from "../../../api/map";
import {
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { StoreDetail } from "../../../types/store";
import type { Place } from "../../../types/place";
import { useLocation, useNavigate } from "react-router-dom";
import SearchArrowIcon from "../../../assets/Guest/Main/SearchArrow.svg";
import StoreDetailBody from "../../../components/Guest/Store/StoreDetailBody";

type HomeRestoreState = {
  selectedStoreId?: number | null;
  sheetOpen?: boolean;
  sheetState?: SheetState;
  mapCamera?: MapCamera;
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

  const [keyword, setKeyword] = useState("");
  const [typeCode, setTypeCode] = useState<CategoryTypeCode | null>(null);

  const [allMarkers, setAllMarkers] = useState<StoreMarker[]>([]);
  const [markers, setMarkers] = useState<StoreMarker[]>([]);

  const [showSearchHere, setShowSearchHere] = useState(false);

  const [selectedStore, setSelectedStore] = useState<StoreDetail | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [openInfoStoreId, setOpenInfoStoreId] = useState<number | null>(null);

  const isDetailMode = selectedStore !== null;

  const [currentSheetState, setCurrentSheetState] = useState<SheetState>(
    sheetOpen ? "half" : "collapsed",
  );

  // bounds -> marker query
  const toMarkerQueryFromBounds = useCallback(
    (
      b: { minLat: number; minLng: number; maxLat: number; maxLng: number },
      opt?: { keyword?: string; type?: string; limit?: number },
    ) => {
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

      const params = toMarkerQueryFromBounds(bounds, opt);

      const res = await mapApi.getMarkers(params);
      if (!res.data.isSuccess) throw new Error("markers isSuccess=false");

      const serverMarkers = res.data.data.stores ?? [];
      setAllMarkers(serverMarkers);
      setMarkers(serverMarkers);
    },
    [toMarkerQueryFromBounds],
  );

  // 초기 마커 fetch
  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        // 지도 준비될 때까지 잠깐 대기
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
        // 서버만 쓰기로 했으니 실패하면 빈 상태 유지
        setAllMarkers([]);
        setMarkers([]);
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [fetchMarkersByCurrentBounds]);

  // "현 지도에서 검색"
  const onSearchHere = useCallback(async () => {
    try {
      await fetchMarkersByCurrentBounds({
        keyword: keyword.trim() || undefined,
        type: typeCode ?? undefined,
        limit: 20,
      });
    } catch (e) {
      console.error(e);
    } finally {
      setShowSearchHere(false);
    }
  }, [fetchMarkersByCurrentBounds, keyword, typeCode]);

  // ✅ 서버 상세 조회 + 선택 상태 세팅
  const fetchAndSelectStore = useCallback(async (storeId: number) => {
    const res = await mapApi.getStoreDetail(storeId);
    if (!res.data.isSuccess) throw new Error("detail isSuccess=false");

    const store = mapStoreDetailDtoToStoreDetail(res.data.data);

    setSelectedStore(store);
    setSheetOpen(true);
    setOpenInfoStoreId(storeId);
  }, []);

  const selectedStoreNumericId = useMemo(() => {
    if (!selectedStore) return null;
    return Number(selectedStore.id.replace("store_", ""));
  }, [selectedStore]);

  // 바텀시트 높이 기반 오프셋
  const getCenterOffsetPx = useCallback(() => {
    const vh = isDetailMode ? 53 : 38;
    const sheetPx = (window.innerHeight * vh) / 100;
    return sheetPx / 2;
  }, [isDetailMode]);

  // 상세로 이동 (restore 전달)
  const onGoDetail = useCallback(() => {
    if (!selectedStoreNumericId) return;

    const cam = mapHandleRef.current?.getCamera() ?? undefined;

    const restore: HomeRestoreState = {
      selectedStoreId: selectedStoreNumericId,
      openInfoStoreId: selectedStoreNumericId,
      sheetOpen: true,
      sheetState: currentSheetState,
      mapCamera: cam,
      filteredStoreIds: markers.map((m) => m.storeId),
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

  // 상세에서 home으로 돌아왔을 때 복원
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

    startTransition(() => {
      // 2) 마커 필터 복원
      if (restore.filteredStoreIds && restore.filteredStoreIds.length > 0) {
        setMarkers(
          allMarkers.filter((m) =>
            restore.filteredStoreIds!.includes(m.storeId),
          ),
        );
      }

      // 3) 시트/버튼 상태 복원
      const nextOpen = !!restore.sheetOpen;
      setSheetOpen(nextOpen);
      setCurrentSheetState(
        restore.sheetState ?? (nextOpen ? "half" : "collapsed"),
      );
      setShowSearchHere(!!restore.showSearchHere);
      setOpenInfoStoreId(restore.openInfoStoreId ?? null);
    });

    // 4) 선택 가게 복원은 "서버 재조회"로
    if (typeof restore.selectedStoreId === "number") {
      void fetchAndSelectStore(restore.selectedStoreId);
    } else {
      setSelectedStore(null);
    }

    // state 제거
    setTimeout(() => {
      navigate(location.pathname, { replace: true, state: null });
    }, 0);
  }, [
    location.state,
    location.pathname,
    navigate,
    allMarkers,
    fetchAndSelectStore,
  ]);

  // SearchContainer에 넣을 데이터(주소 없음)
  const searchPlaces: SearchPlace[] = useMemo(() => {
    return allMarkers.map((m) => ({
      id: m.storeId,
      name: m.name,
      address: "", // markers API에 주소가 없어서 빈값
      lat: m.lat,
      lng: m.lng,
    }));
  }, [allMarkers]);

  const searchDebounceRef = useRef<number | null>(null);

  const refetchWithCurrentFilters = useCallback(
    async (opt?: { keyword?: string; type?: CategoryTypeCode }) => {
      await fetchMarkersByCurrentBounds({
        keyword: (opt?.keyword ?? keyword.trim()) || undefined,
        type: opt?.type ?? typeCode ?? undefined,
        limit: 20,
      });
    },
    [fetchMarkersByCurrentBounds, keyword, typeCode],
  );

  // PlaceList에 넣을 데이터(서버에서 없는 값은 기본값)
  const placesForList: Place[] = useMemo(() => {
    return markers.map((m) => ({
      id: m.storeId,
      name: m.name,
      description: "", // 서버에 없으면 빈값
      status: "영업 중", // 임시 기본값 (서버 statusCode 연동되면 변환)
      address: "", // 서버에 없으면 빈값
      images: [], // 서버에 없으면 빈 배열 (PlaceHeader가 안전처리 필요할 수 있음)
    }));
  }, [markers]);

  return (
    <GuestLayout>
      {/* 지도 영역 */}
      <div className="absolute inset-0">
        <NaverMap
          ref={mapHandleRef}
          markers={markers}
          selectedStoreId={selectedStoreNumericId}
          openInfoStoreId={openInfoStoreId}
          onMarkerClick={(id) => {
            void fetchAndSelectStore(id);
          }}
          onMapClick={() => {
            setSelectedStore(null);
            setSheetOpen(false);
            setOpenInfoStoreId(null);
          }}
          getCenterOffsetPx={getCenterOffsetPx}
          onMapMoved={() => {
            if (suppressMapMovedRef.current) {
              suppressMapMovedRef.current = false;
              return;
            }
            setShowSearchHere(true);
          }}
        />

        {showSearchHere && (
          <button
            type="button"
            onClick={() => void onSearchHere()}
            className="
              absolute left-1/2 -translate-x-1/2
              bottom-[150px] z-40 h-[40px] px-[15px]
              rounded-full bg-white
              shadow-[0px_2px_4px_0px_rgba(0,0,0,0.25)]
              flex items-center gap-[10px]
            "
          >
            <img src={SearchArrowIcon} alt="재검색" className="h-[20px]" />
            <p className="typo-14-semibold text-primary-01">현 지도에서 검색</p>
          </button>
        )}
      </div>

      {/* 페이드 오버레이 */}
      <div className="pointer-events-none absolute inset-0 z-10">
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
          onKeywordChange={(v) => {
            setKeyword(v);

            if (searchDebounceRef.current)
              window.clearTimeout(searchDebounceRef.current);
            searchDebounceRef.current = window.setTimeout(() => {
              void refetchWithCurrentFilters({ keyword: v });
            }, 300);
          }}
          onSelectPlace={(place) => {
            suppressMapMovedRef.current = true;

            if (place.lat && place.lng) {
              mapHandleRef.current?.panToWithOffset({
                lat: place.lat,
                lng: place.lng,
                zoom: 16,
              });
            }

            void fetchAndSelectStore(place.id);
          }}
        />
      </div>

      {/* 카테고리 칩 */}
      <div className="absolute top-[72px] mt-[10px] left-0 right-0 z-20">
        <CategoryChipBar
          value={typeCode}
          onChange={(next) => {
            setTypeCode(next);
            void refetchWithCurrentFilters({ type: next ?? undefined });
          }}
        />
      </div>

      {/* Bottom Sheet */}
      <BottomSheet
        initialState={sheetOpen ? "half" : "collapsed"}
        halfHeight={isDetailMode ? "53vh" : "38vh"}
        disableScrollOnHalf={isDetailMode}
        onStateChange={(state) => {
          setCurrentSheetState(state);
          if (state === "collapsed") setSheetOpen(false);
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
            <PlaceList places={placesForList} />
            <BottomSheetFooter />
          </>
        }
      />
    </GuestLayout>
  );
}
