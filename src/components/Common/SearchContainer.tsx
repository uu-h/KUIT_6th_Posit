import { useState, useRef, useMemo } from "react";
import SearchBar from "./SearchBar";
import SearchResultList from "./SearchResultList";

export type SearchPlace = {
  id: number;
  name: string;
  address: string;
  distance?: string; // 나중에 서버에서 주거나 계산할 때
  lat?: number;
  lng?: number;
};

type Props = {
  places: SearchPlace[];
  onSelectPlace?: (place: SearchPlace) => void;
};

const PAGE_SIZE = 4;

export default function SearchContainer({ places, onSelectPlace }: Props) {
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(0);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const filteredPlaces = useMemo(() => {
    const q = keyword.trim();
    if (!q) return [];
    // 초성검색까지는 나중에, 일단 includes
    return places.filter((p) => p.name.includes(q));
  }, [places, keyword]);

  // 페이지 계산
  const totalPages = Math.ceil(filteredPlaces.length / PAGE_SIZE);

  const pages = useMemo(() => {
    return Array.from({ length: totalPages }, (_, i) =>
      filteredPlaces.slice(i * PAGE_SIZE, (i + 1) * PAGE_SIZE),
    );
  }, [filteredPlaces, totalPages]);

  return (
    <div className="relative">
      <SearchBar
        value={keyword}
        onChange={(v) => {
          setKeyword(v);
          setPage(0); // 검색어 바뀌면 첫 페이지로
          if (scrollRef.current) scrollRef.current.scrollTo({ left: 0 });
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
              <div key={pageIndex} className="w-full shrink-0 snap-start">
                {/* 리스트 */}
                <SearchResultList
                  places={pagePlaces}
                  onClickPlace={(place) => {
                    onSelectPlace?.(place);
                    setKeyword(""); // 선택 후 닫고 싶으면
                  }}
                />
                {/* 페이지 인디케이터 (각 페이지 하단에 고정) */}
                {totalPages > 1 && (
                  <div
                    className="
                  flex justify-center 
                  gap-1 
                  -mt-2 
                  pt-4 
                  py-2 
                  bg-shades-01 
                  rounded-b-[8px] 
                  box-shadow: 0 8px 16px rgba(0,0,0,0.12);
"
                  >
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
                          page === idx ? "text-neutrals-09" : "text-neutrals-06"
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
