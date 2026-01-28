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

// 가게 이름 축약 함수 (공백 포함 9글자 기준)
const truncateText = (text: string, maxLength = 9) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "…";
};

export default function PopularPlaces() {
  return (
    <>
      <h2 className="typo-16-bold mb-4">
        내 주변 인기 장소 <span className="text-primary-01">Top 3</span>
      </h2>

      <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory no-scrollbar">
        {places.map((place) => (
          <div
            key={place.id}
            className="
              min-w-[110px]
              snap-start
              flex flex-col
              items-start
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
                className="w-full h-full object-cover"
              />
            </div>

            {/* 가게 이름 */}
            <div
              className="mt-1 typo-12-semibold text-black"
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
