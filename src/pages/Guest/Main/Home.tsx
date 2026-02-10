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
  type StoreDetailDto,
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

/** restore state */
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

/** 거리 계산 + 내 위치 */
type LatLng = { lat: number; lng: number };

function haversineKm(a: LatLng, b: LatLng) {
  const R = 6371;
  const toRad = (x: number) => (x * Math.PI) / 180;

  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;

  return 2 * R * Math.asin(Math.min(1, Math.sqrt(s)));
}

function getMyLocationOnce(): Promise<LatLng | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) return resolve(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => resolve(null),
      { enableHighAccuracy: true, timeout: 6000, maximumAge: 60_000 },
    );
  });
}

type PopularItem = {
  storeId: number;
  name: string;
  lat: number;
  lng: number;
  distanceKm?: number;
  imageUrl?: string | null;
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

  const [myLoc, setMyLoc] = useState<LatLng | null>(null);

  /** 인기 Top3 */
  const [popularTop3, setPopularTop3] = useState<PopularItem[]>([]);

  /** expanded 리스트(거리순) */
  const [placesForList, setPlacesForList] = useState<Place[]>([]);

  /** 상세 캐시: Top3 이미지 채우기용 */
  const detailCacheRef = useRef<
    Map<number, { imageUrl: string | null; name?: string }>
  >(new Map());

  /** PlaceList 캐시: 상세 반복 호출 방지 */
  const placeCacheRef = useRef<Map<number, Place>>(new Map());

  /** Top3 비동기 경쟁 방지 */
  const popularReqIdRef = useRef(0);

  /** PlaceList 비동기 경쟁 방지 */
  const listReqIdRef = useRef(0);

  /** bounds -> marker query */
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

  /** statusCode -> "영업 중/영업 종료" (서버 enum 확정되면 여기만 바꾸면 됨) */
  const statusTextFromStatusCode = useCallback(
    (statusCode?: string | null): Place["status"] => {
      if (!statusCode) return "영업 중";
      if (statusCode === "CLOSE" || statusCode === "CLOSED") return "영업 종료";
      // UNKNOWN 포함 기본은 영업 중으로 처리
      return "영업 중";
    },
    [],
  );

  /** detail dto -> PlaceHeader용 Place로 변환 */
  const mapDetailDtoToPlace = useCallback(
    (dto: StoreDetailDto): Place => {
      const images: string[] = Array.isArray(dto.images)
        ? dto.images
            .slice()
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
            .map((img) => img.thumbnailUrl ?? img.imageUrl)
            .filter((v): v is string => Boolean(v))
        : [];

      const road = dto.address?.road ?? "";
      const lot = dto.address?.lot ?? "";
      const address = road || lot || "";

      return {
        id: dto.storeId,
        name: dto.name ?? "",
        description: dto.description ?? "",
        status: statusTextFromStatusCode(dto.statusCode),
        address,
        images,
      };
    },
    [statusTextFromStatusCode],
  );

  /** 인기 Top3 계산 + (상세 3개 병렬 호출로) 이미지 채우기 */
  const buildPopularTop3 = useCallback(
    async (serverMarkers: StoreMarker[]) => {
      const reqId = ++popularReqIdRef.current;

      // 1) 내 위치 확보(없으면 1번만 시도)
      let loc = myLoc;
      if (!loc) {
        loc = await getMyLocationOnce();
        setMyLoc(loc);
      }

      // 2) Top3 선정
      const baseTop3: PopularItem[] = loc
        ? serverMarkers
            .map((m) => ({
              storeId: m.storeId,
              name: m.name,
              lat: m.lat,
              lng: m.lng,
              distanceKm: haversineKm(loc!, { lat: m.lat, lng: m.lng }),
            }))
            .sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0))
            .slice(0, 3)
        : serverMarkers
            .slice()
            .sort((a, b) => a.storeId - b.storeId)
            .slice(0, 3)
            .map((m) => ({
              storeId: m.storeId,
              name: m.name,
              lat: m.lat,
              lng: m.lng,
            }));

      setPopularTop3(baseTop3);

      // 3) 상세 3개 병렬 호출해서 imageUrl 채우기 (캐시 활용)
      const enriched = await Promise.all(
        baseTop3.map(async (it) => {
          const cached = detailCacheRef.current.get(it.storeId);
          if (cached) {
            return {
              ...it,
              imageUrl: cached.imageUrl,
              name: cached.name ?? it.name,
            };
          }

          try {
            const res = await mapApi.getStoreDetail(it.storeId);
            if (!res.data.isSuccess) throw new Error("detail isSuccess=false");

            const dto = res.data.data;
            const store = mapStoreDetailDtoToStoreDetail(dto);
            const imageUrl = store.images?.[0] ?? null;

            detailCacheRef.current.set(it.storeId, {
              imageUrl,
              name: store.name,
            });
            return { ...it, imageUrl, name: store.name };
          } catch (e) {
            console.error("[popular detail fetch failed]", it.storeId, e);
            detailCacheRef.current.set(it.storeId, { imageUrl: null });
            return { ...it, imageUrl: null };
          }
        }),
      );

      if (popularReqIdRef.current !== reqId) return;
      setPopularTop3(enriched);
    },
    [myLoc],
  );

  /** expanded 리스트(거리순) 만들기: markers -> (상세 n개) -> Place[] */
  const buildDistanceSortedPlaceList = useCallback(
    async (serverMarkers: StoreMarker[], limit = 20) => {
      const reqId = ++listReqIdRef.current;

      let loc = myLoc;
      if (!loc) {
        loc = await getMyLocationOnce();
        setMyLoc(loc);
      }

      const sorted = loc
        ? serverMarkers
            .map((m) => ({
              ...m,
              dist: haversineKm(loc!, { lat: m.lat, lng: m.lng }),
            }))
            .sort((a, b) => (a.dist ?? 0) - (b.dist ?? 0))
        : serverMarkers.slice().sort((a, b) => a.storeId - b.storeId);

      const targets = sorted.slice(0, limit);

      // 캐시된 것만이라도 먼저 보여주기(UX)
      const cached = targets
        .map((m) => placeCacheRef.current.get(m.storeId))
        .filter(Boolean) as Place[];
      if (cached.length > 0) setPlacesForList(cached);

      const results = await Promise.all(
        targets.map(async (m) => {
          const cachedPlace = placeCacheRef.current.get(m.storeId);
          if (cachedPlace) return cachedPlace;

          const res = await mapApi.getStoreDetail(m.storeId);
          if (!res.data.isSuccess) throw new Error("detail isSuccess=false");

          const dto = res.data.data as StoreDetailDto;
          const place = mapDetailDtoToPlace(dto);
          placeCacheRef.current.set(m.storeId, place);
          return place;
        }),
      );

      if (listReqIdRef.current !== reqId) return;
      setPlacesForList(results);
    },
    [myLoc, mapDetailDtoToPlace],
  );

  /** 현재 bounds 기준 마커 fetch (+ Top3 + expanded 리스트 갱신) */
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

      // ✅ 같은 bounds 결과로 Top3 + expanded 리스트 둘 다 갱신
      void buildPopularTop3(serverMarkers);
      void buildDistanceSortedPlaceList(serverMarkers, 20);
    },
    [toMarkerQueryFromBounds, buildPopularTop3, buildDistanceSortedPlaceList],
  );

  /** 초기 마커 fetch */
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
        setAllMarkers([]);
        setMarkers([]);
        setPopularTop3([]);
        setPlacesForList([]);
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [fetchMarkersByCurrentBounds]);

  /** "현 지도에서 검색" */
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

  /** 서버 상세 조회 + 선택 상태 세팅 */
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

  /** Top3 클릭 핸들러 */
  const onClickPopular = useCallback(
    async (storeId: number) => {
      suppressMapMovedRef.current = true;

      const it = popularTop3.find((p) => p.storeId === storeId);

      if (it?.lat && it?.lng) {
        mapHandleRef.current?.panToWithOffset({
          lat: it.lat,
          lng: it.lng,
          zoom: 16,
        });
      }

      await fetchAndSelectStore(storeId);
    },
    [popularTop3, fetchAndSelectStore],
  );

  /** 가게 리스트 클릭 핸들러 */
  const onClickStoreFromList = useCallback(
    async (storeId: number) => {
      suppressMapMovedRef.current = true;

      // 1) markers에서 좌표 찾기 (현재 bounds 결과 리스트 기준)
      const m = markers.find((x) => x.storeId === storeId);

      // 2) 좌표가 있으면 중앙으로 이동
      if (m) {
        mapHandleRef.current?.panToWithOffset({
          lat: m.lat,
          lng: m.lng,
          zoom: 16,
        });
      }

      // 3) 상세 조회 + half 열기 + 선택 마커/인포윈도우
      await fetchAndSelectStore(storeId);
    },
    [markers, fetchAndSelectStore],
  );

  /** 바텀시트 높이 기반 오프셋 */
  const getCenterOffsetPx = useCallback(() => {
    const vh = isDetailMode ? 53 : 38;
    const sheetPx = (window.innerHeight * vh) / 100;
    return sheetPx / 2;
  }, [isDetailMode]);

  /** 상세로 이동 (restore 전달) */
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
      state: { from: "home", restore },
    });
  }, [
    selectedStoreNumericId,
    currentSheetState,
    markers,
    showSearchHere,
    navigate,
  ]);

  /** 상세에서 home으로 돌아왔을 때 복원 */
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

    // 2) 마커/시트 UI 복원
    startTransition(() => {
      if (restore.filteredStoreIds && restore.filteredStoreIds.length > 0) {
        setMarkers(
          allMarkers.filter((m) =>
            restore.filteredStoreIds!.includes(m.storeId),
          ),
        );
      }

      const nextOpen = !!restore.sheetOpen;
      setSheetOpen(nextOpen);
      setCurrentSheetState(
        restore.sheetState ?? (nextOpen ? "half" : "collapsed"),
      );
      setShowSearchHere(!!restore.showSearchHere);
      setOpenInfoStoreId(restore.openInfoStoreId ?? null);
    });

    // 3) 선택 가게 복원은 서버 재조회
    if (typeof restore.selectedStoreId === "number") {
      void fetchAndSelectStore(restore.selectedStoreId);
    } else {
      setSelectedStore(null);
    }

    // 4) state 제거
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

  /** SearchContainer에 넣을 데이터(주소 없음) */
  const searchPlaces: SearchPlace[] = useMemo(() => {
    return allMarkers.map((m) => ({
      id: m.storeId,
      name: m.name,
      address: "",
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

  return (
    <GuestLayout>
      {/* 지도 영역 */}
      <div className="absolute inset-0">
        <NaverMap
          ref={mapHandleRef}
          markers={markers}
          selectedStoreId={selectedStoreNumericId}
          openInfoStoreId={openInfoStoreId}
          onMarkerClick={(id) => void fetchAndSelectStore(id)}
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
            <PopularPlaces
              items={popularTop3}
              onClickItem={(storeId) => void onClickPopular(storeId)}
              showDistance={false}
            />
          )
        }
        expandedContent={
          <>
            <PlaceList
              places={placesForList}
              onSelect={(storeId) => {
                void onClickStoreFromList(storeId);
              }}
            />
            <BottomSheetFooter />
          </>
        }
      />
    </GuestLayout>
  );
}
