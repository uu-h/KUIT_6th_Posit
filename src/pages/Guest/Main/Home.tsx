import BottomSheet, {
  type SheetState,
} from "../../../components/Guest/Main/BottomSheet";
import PopularPlaces from "../../../components/Guest/Main/PopularPlaces";
import PlaceList from "../../../components/Guest/Main/PlaceList";
import type { Place } from "../../../types/place";
import BottomSheetFooter from "../../../components/Guest/Main/BottomSheetFooter"; //수정!!
import CategoryChipBar from "../../../components/Guest/Main/CategoryChipBar";
import NaverMap from "../../../components/Map/NaverMap";
import SearchContainer from "../../../components/Common/SearchContainer";
import GuestLayout from "../../../layouts/GuestLayout";
import { mapApi, type StoreMarker } from "../../../api/map";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { StoreDetail } from "../../../types/store";
import { storeDetailMocks } from "../Store/store.mock";
import StoreDetailBody from "../../../components/Guest/Store/StoreDetailBody";
import { useNavigate } from "react-router-dom";

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

// 임시 마커(목업)
const mockMarkers: StoreMarker[] = [
  { storeId: 1, name: "카페 레이지아워", lat: 37.54312, lng: 127.071253 },
  { storeId: 2, name: "마이 디어 버터하우스", lat: 37.544966, lng: 127.069126 },
  { storeId: 3, name: "도우터", lat: 37.542712, lng: 127.070158 },
  { storeId: 4, name: "cafe 462", lat: 37.543181, lng: 127.06788 },
  { storeId: 5, name: "카페 언필드", lat: 37.542093, lng: 127.06594 },
];

const ENABLE_SERVER = false;

export default function Home() {
  const navigate = useNavigate();

  // 서버 안 쓰면 초기값을 mock으로
  const [markers, setMarkers] = useState<StoreMarker[]>(
    ENABLE_SERVER ? [] : mockMarkers,
  );

  // 서버 seed 넣으면 고치기

  // const [markers, setMarkers] = useState<StoreMarker[]>([]);

  // useEffect(() => {
  //   const run = async () => {
  //     try {
  //       const res = await mapApi.getMarkers();
  //       if (!res.data.isSuccess) return;
  //       setMarkers(res.data.data.stores);
  //     } catch (e) {
  //       console.error(e);
  //     }
  //   };
  //   void run();
  // }, []);

  useEffect(() => {
    // 서버 켤 때만 effect 실행, 목업 사용 용
    if (!ENABLE_SERVER) return;

    const run = async () => {
      try {
        const res = await mapApi.getMarkers();
        const serverMarkers = res.data.data.stores ?? [];
        setMarkers(serverMarkers.length > 0 ? serverMarkers : mockMarkers);
      } catch (e) {
        console.error(e);
        setMarkers(mockMarkers);
      }
    };

    void run();
  }, []);

  // 선택된 가게 상세
  const [selectedStore, setSelectedStore] = useState<StoreDetail | null>(null);

  // 바텀시트 열림 여부
  const [sheetOpen, setSheetOpen] = useState(false);

  const isDetailMode = selectedStore !== null;

  const handleMarkerClick = useCallback((storeId: number) => {
    const store =
      storeDetailMocks.find(
        (s) => Number(s.id.replace("store_", "")) === storeId,
      ) ?? null;

    setSelectedStore(store);
    setSheetOpen(true); // 마커 클릭하면 무조건 시트 열기
  }, []);

  // 페이지 전환용 id (mock "store_001" -> 1)
  const selectedStoreNumericId = useMemo(() => {
    if (!selectedStore) return null;
    return Number(selectedStore.id.replace("store_", ""));
  }, [selectedStore]);

  const getCenterOffsetPx = useCallback(() => {
    // halfHeight가 "38vh" or "53vh" 같은 문자열이니까
    // 실제 px로 바꿔야 함.
    const vh = isDetailMode ? 53 : 38;
    const sheetPx = (window.innerHeight * vh) / 100;
    return sheetPx / 2; // 가려진 영역의 절반만큼 위로
  }, [isDetailMode]);

  const [currentSheetState, setCurrentSheetState] = useState<SheetState>(
    sheetOpen ? "half" : "collapsed",
  );
  return (
    <GuestLayout>
      {/* 지도 영역 */}
      <div className="absolute inset-0">
        <NaverMap
          markers={markers}
          onMarkerClick={handleMarkerClick}
          onMapClick={() => {
            setSelectedStore(null);
            setSheetOpen(false);
          }}
          getCenterOffsetPx={getCenterOffsetPx}
        />
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
        <SearchContainer />
      </div>

      {/* 카테고리 칩 */}
      <div className="absolute top-[72px] mt-[10px] left-0 right-0 z-20">
        <CategoryChipBar />
      </div>

      {/* Bottom Sheet */}
      <BottomSheet
        // 기본은 collapsed, 마커 클릭-> sheetOpen이면 half로 시작
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
        onExpandedIntent={() => {
          if (!selectedStoreNumericId) return;
          navigate(`/stores/${selectedStoreNumericId}`);
        }}
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
