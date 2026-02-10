import { useMemo, useRef } from "react";

type PopularItem = {
  storeId: number;
  name: string;
  // 서버에서 이미지가 없으니 optional
  imageUrl?: string | null;
  // 거리 표시하고 싶으면 optional
  distanceKm?: number;
};

type Props = {
  items: PopularItem[];
  onClickItem?: (storeId: number) => void;
  showDistance?: boolean;
};

// 가게 이름 축약 함수
const truncateText = (text: string, maxLength = 9) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "…";
};

export default function PopularPlaces({
  items,
  onClickItem,
  showDistance,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  // ✅ 드래그 중 클릭 방지용
  const draggedRef = useRef(false);

  const onMouseDown = (e: React.MouseEvent) => {
    isDown.current = true;
    draggedRef.current = false;
    startX.current = e.pageX;
    scrollLeft.current = containerRef.current!.scrollLeft;
  };

  const onMouseUp = () => {
    isDown.current = false;
  };

  const onMouseLeave = () => {
    isDown.current = false;
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDown.current) return;
    e.preventDefault();

    const x = e.pageX;
    const walk = x - startX.current;

    // 일정 픽셀 이상 움직이면 드래그로 간주
    if (Math.abs(walk) > 6) draggedRef.current = true;

    containerRef.current!.scrollLeft = scrollLeft.current - walk;
  };

  const normalized = useMemo(() => {
    return (items ?? []).slice(0, 3).map((it) => ({
      id: it.storeId,
      name: it.name,
      image: it.imageUrl ?? null,
      distanceKm: it.distanceKm,
    }));
  }, [items]);

  return (
    <>
      <h2 className="typo-16-bold mb-4">
        내 주변 인기 장소 <span className="text-primary-01">Top 3</span>
      </h2>

      <div
        ref={containerRef}
        className="
          flex gap-3
          overflow-x-auto
          snap-x snap-mandatory
          no-scrollbar
          cursor-grab active:cursor-grabbing
        "
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        onMouseMove={onMouseMove}
      >
        {normalized.length === 0 ? (
          <div className="typo-14-regular text-neutrals-05 py-6">
            주변에 표시할 장소가 없어요.
          </div>
        ) : (
          normalized.map((place) => (
            <button
              key={place.id}
              type="button"
              className="
                min-w-[110px]
                snap-start
                flex flex-col
                items-start
                shrink-0
                text-left
              "
              onClick={() => {
                // 드래그 중에는 클릭 무시
                if (draggedRef.current) return;
                onClickItem?.(place.id);
              }}
            >
              {/* 이미지 */}
              <div
                className="
                  w-[110px]
                  h-[110px]
                  rounded-[8px]
                  overflow-hidden
                  bg-neutrals-02
                "
              >
                {place.image ? (
                  <img
                    src={place.image}
                    alt={place.name}
                    className="w-full h-full object-cover pointer-events-none"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center typo-12-regular text-neutrals-05">
                    이미지 없음
                  </div>
                )}
              </div>

              {/* 가게 이름 */}
              <div
                className="mt-1 typo-12-semibold text-black select-none"
                title={place.name}
              >
                {truncateText(place.name)}
              </div>

              {/* (선택) 거리 표시 */}
              {showDistance && typeof place.distanceKm === "number" && (
                <div className="typo-12-regular text-neutrals-06">
                  {place.distanceKm.toFixed(1)}km
                </div>
              )}
            </button>
          ))
        )}
      </div>
    </>
  );
}
