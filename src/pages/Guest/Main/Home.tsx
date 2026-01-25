import BottomSheet from "../../../components/Guest/Main/BottomSheet";
import PopularPlaces from "../../../components/Guest/Main/PopularPlaces";
import BottomBar from "../../../components/BottomBar/BottomBar";
import SearchBar from "../../../components/Common/SearchBar";

export default function Home() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* 지도 영역 */}
      <div className="absolute inset-0 bg-neutrals-02" />

      {/* 상단 검색 바 */}
      <div className="absolute top-4 left-4 right-4 z-20">
        <SearchBar />
      </div>

      {/* Bottom Sheet */}
      <BottomSheet>
        <PopularPlaces />
      </BottomSheet>

      {/* Bottom Bar */}
      <BottomBar active="home" />
    </div>
  );
}
