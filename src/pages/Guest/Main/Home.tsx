import BottomSheet from "../../../components/Guest/Main/BottomSheet";
import PopularPlaces from "../../../components/Guest/Main/PopularPlaces";
import BottomBar from "../../../components/BottomBar/BottomBar";
import SearchBar from "../../../components/Common/SearchBar";
import PlaceList from "../../../components/Guest/Main/PlaceList";
import type { Place } from "../../../types/place";
import BottomSheetFooter from "../../../components/Guest/Main/BottomSheetFooter";
import CategoryChipBar from "../../../components/Guest/Main/CategoryChipBar";
import NaverMap from "../../../components/Map/NaverMap";
import { storeDetailMock } from "../Store/store.mock";

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

export default function Home() {
  const stores = [storeDetailMock]; // 여러개면 여기에 추가

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* 지도 영역 */}
      <div className="absolute inset-0">
        <NaverMap stores={stores} />{" "}
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
      <div className="absolute top-4 left-4 right-4 z-20">
        <SearchBar />
      </div>

      {/* 카테고리 칩 */}
      <div className="absolute top-[72px] mt-[10px] left-4 right-4 z-20">
        <CategoryChipBar />
      </div>

      {/* Bottom Sheet */}
      <BottomSheet
        popularContent={<PopularPlaces />}
        expandedContent={
          <>
            <PlaceList places={mockPlaces} />
            <BottomSheetFooter />
          </>
        }
      />

      {/* Bottom Bar */}
      <BottomBar active="home" />
    </div>
  );
}
