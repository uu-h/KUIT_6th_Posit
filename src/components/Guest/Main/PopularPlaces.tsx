import { useRef } from "react";

type Place = {
  id: number;
  name: string;
  image: string;
};

const places: Place[] = [
  { id: 1, name: "더이퀄리브리엄커피", image: "/images/place1.jpg" },
  { id: 2, name: "카페 레이지아워", image: "/images/place2.jpg" },
  { id: 3, name: "카페 언필드", image: "/images/place3.jpg" },
];

// 가게 이름 축약 함수
const truncateText = (text: string, maxLength = 9) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "…";
};

export default function PopularPlaces() {
  const containerRef = useRef<HTMLDivElement>(null);

  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const onMouseDown = (e: React.MouseEvent) => {
    isDown.current = true;
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
    containerRef.current!.scrollLeft = scrollLeft.current - walk;
  };

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
        {places.map((place) => (
          <div
            key={place.id}
            className="
              min-w-[110px]
              snap-start
              flex flex-col
              items-start
              shrink-0
            "
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
              <img
                src={place.image}
                alt={place.name}
                className="w-full h-full object-cover pointer-events-none"
              />
            </div>

            {/* 가게 이름 */}
            <div
              className="mt-1 typo-12-semibold text-black select-none"
              title={place.name}
            >
              {truncateText(place.name)}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
