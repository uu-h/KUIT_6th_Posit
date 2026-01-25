import PlaceHeader from "./PlaceHeader";
import type { Place } from "../../../types/place";

type Props = {
  places: Place[];
};

export default function PlaceList({ places }: Props) {
  return (
    <div className="flex flex-col gap-[20px]">
      {places.map((place) => (
        <PlaceHeader
          key={place.id}
          name={place.name}
          description={place.description}
          status={place.status}
          address={place.address}
          images={place.images}
        />
      ))}
    </div>
  );
}
