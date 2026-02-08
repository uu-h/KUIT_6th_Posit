import placePinIcon from "../../assets/Common/PlacePin.svg";

export type Place = {
  id: number;
  name: string;
  address: string;
  distance?: string; // 이제 서버/계산 여부에 따라 optional 추천
};

type Props = {
  places: Place[];
  onClickPlace?: (place: Place) => void;
};

export default function SearchResultList({ places, onClickPlace }: Props) {
  return (
    <div
      className="
        bg-shades-01
        rounded-b-[8px]
        overflow-hidden
      "
    >
      {places.map((place, index) => (
        <div key={place.id}>
          {/* 아이템 */}
          <button
            type="button"
            onClick={() => onClickPlace?.(place)}
            className={`
              w-full text-left
              flex items-center
              px-4
              ${index === 0 ? "pt-8 pb-3" : "py-3"}
              hover:bg-black/5 active:bg-black/10
            `}
          >
            <img
              src={placePinIcon}
              alt="place pin"
              className="w-6 h-6 mr-3 shrink-0"
            />

            <div className="flex-1 min-w-0">
              <div className="typo-14-semibold text-black truncate">
                {place.name}
              </div>
              <div className="typo-12-regular text-neutrals-09 truncate">
                {place.address}
              </div>
            </div>

            {!!place.distance && (
              <div className="typo-14-semibold text-neutrals-09 ml-3 shrink-0">
                {place.distance}
              </div>
            )}
          </button>

          {/* 구분선 (마지막은 빼고 싶으면 조건 추가 가능) */}
          <div className="flex justify-center">
            <div
              className="h-0"
              style={{
                width: "317px",
                borderTop: "0.5px solid #A8A8A8",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
