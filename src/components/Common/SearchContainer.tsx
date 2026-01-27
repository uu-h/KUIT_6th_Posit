import { useState, useRef } from "react";
import SearchBar from "./SearchBar";
import SearchResultList from "./SearchResultList";

type Place = {
  id: number;
  name: string;
  address: string;
  distance: string;
};

const PLACES: Place[] = [
  {
    id: 1,
    name: "카페 레이지아워",
    address: "서울 광진구 아차산로 33길 68 지하 1층",
    distance: "2km",
  },
  {
    id: 2,
    name: "카페 레이지아워",
    address: "서울 광진구 아차산로 33길 68 지하 1층",
    distance: "2km",
  },
  {
    id: 3,
    name: "카페 레이지아워",
    address: "서울 광진구 아차산로 33길 68 지하 1층",
    distance: "2km",
  },
  {
    id: 4,
    name: "카페 레이지아워",
    address: "서울 광진구 아차산로 33길 68 지하 1층",
    distance: "2km",
  },
  {
    id: 5,
    name: "카페 레이지아워",
    address: "서울 광진구 아차산로 33길 68 지하 1층",
    distance: "2km",
  },
  {
    id: 6,
    name: "카페 레이지아워",
    address: "서울 광진구 아차산로 33길 68 지하 1층",
    distance: "2km",
  },
    {
    id: 7,
    name: "카페 레이지아워",
    address: "서울 광진구 아차산로 33길 68 지하 1층",
    distance: "2km",
  },
    {
    id: 8,
    name: "카페 레이지아워",
    address: "서울 광진구 아차산로 33길 68 지하 1층",
    distance: "2km",
  },
    {
    id: 9,
    name: "카페 레이지아워",
    address: "서울 광진구 아차산로 33길 68 지하 1층",
    distance: "2km",
  },
    {
    id: 10,
    name: "카페 레이지아워",
    address: "서울 광진구 아차산로 33길 68 지하 1층",
    distance: "2km",
  },
    {
    id: 11,
    name: "카페 레이지아워",
    address: "서울 광진구 아차산로 33길 68 지하 1층",
    distance: "2km",
  },
    {
    id: 12,
    name: "카페 레이지아워",
    address: "서울 광진구 아차산로 33길 68 지하 1층",
    distance: "2km",
  },
    {
    id: 13,
    name: "카페 레이지아워",
    address: "서울 광진구 아차산로 33길 68 지하 1층",
    distance: "2km",
  },
];

const PAGE_SIZE = 4;

export default function SearchContainer() {
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(0);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // 검색 필터
  const filteredPlaces = PLACES.filter((place) =>
    place.name.includes(keyword)
  );

  // 페이지 계산
  const totalPages = Math.ceil(filteredPlaces.length / PAGE_SIZE);

  const pages = Array.from({ length: totalPages }, (_, i) =>
    filteredPlaces.slice(i * PAGE_SIZE, (i + 1) * PAGE_SIZE)
  );

  return (
    <div className="relative">
      <SearchBar
        value={keyword}
        onChange={(v) => {
          setKeyword(v);
          setPage(0); // 검색어 바뀌면 첫 페이지로
        }}
        onBack={() => setKeyword("")}
      />

      {keyword && filteredPlaces.length > 0 && (
        <div className="absolute left-0 right-0 top-full -mt-[10px] z-30">
          {/* 가로 스와이프 컨테이너 */}
          <div
            ref={scrollRef}
            className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar"
            onScroll={(e) => {
              const el = e.currentTarget;
              const index = Math.round(el.scrollLeft / el.clientWidth);
              setPage(index);
            }}
          >
            {pages.map((pagePlaces, pageIndex) => (
              <div
                key={pageIndex}
                className="w-full shrink-0 snap-start"
              >
                {/* 리스트 */}
                <SearchResultList places={pagePlaces} />

                {/* 페이지 인디케이터 (각 페이지 하단에 고정) */}
                {totalPages > 1 && (
                  <div className="
                  flex justify-center 
                  gap-1 
                  -mt-2 
                  pt-4 
                  py-2 
                  bg-shades-01 
                  rounded-b-[8px] 
                  box-shadow: 0 8px 16px rgba(0,0,0,0.12);
">
                    {Array.from({ length: totalPages }).map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          if (!scrollRef.current) return;
                          scrollRef.current.scrollTo({
                            left: idx * scrollRef.current.clientWidth,
                            behavior: "smooth",
                          });
                        }}
                        className={`typo-12-semibold ${
                          page === idx
                            ? "text-neutrals-09"
                            : "text-neutrals-06"
                        }`}
                      >
                        {idx + 1}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
