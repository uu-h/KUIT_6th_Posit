import PlaceHeader from "./PlaceHeader";
import type { Place } from "../../../types/place";

type Props = {
  places: Place[];
  onSelect?: (placeId: number) => void;
};

export default function PlaceList({ places, onSelect }: Props) {
  return (
    <div className="flex flex-col gap-[20px]">
      {places.map((place) => (
        <button
          key={place.id}
          type="button"
          onClick={() => onSelect?.(place.id)}
          className="text-left"
        >
          <PlaceHeader
            name={place.name}
            description={place.description}
            status={place.status}
            address={place.address}
            images={place.images}
          />
        </button>
      ))}
    </div>
  );
}
