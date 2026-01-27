import placePinIcon from "../../assets/Common/PlacePin.svg";

type Place = {
  id: number;
  name: string;
  address: string;
  distance: string;
};

type Props = {
  places: Place[];
};

export default function SearchResultList({ places }: Props) {
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
          <div
            className={`
              flex items-center
              px-4
              ${index === 0 ? "pt-8 pb-3" : "py-3"}
            `}
          >
            <img
              src={placePinIcon}
              alt="place pin"
              className="w-6 h-6 mr-3"
            />

            <div className="flex-1">
              <div className="typo-14-semibold text-black">
                {place.name}
              </div>
              <div className="typo-12-regular text-neutrals-09">
                {place.address}
              </div>
            </div>

            <div className="typo-14-semibold text-neutrals-09">
              {place.distance}
            </div>
          </div>

          {/* 구분선 */}
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
