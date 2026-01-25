type Props = {
  name: string;
  description: string;
  status: "영업 중" | "영업 종료";
  address: string;
  images: string[];
};

export default function PlaceHeader({
  name,
  description,
  status,
  address,
  images,
}: Props) {
  return (
    <div className="flex flex-col gap-4 px-4 ">
      {/* 텍스트 영역 */}
      <div className="flex flex-col gap-2">
        <h1 className="typo-16-bold text-black">
          {name}
        </h1>

        {/* 구분선 */}
        <div
          className="
            w-[123px]
            h-0
            border-t
            border-neutrals-05
            border-[0.5px]
          "
        />

        <p className="typo-14-regular text-black">
          {description}
        </p>

        <p className="typo-14-regular text-black">
          <span className="typo-14-semibold">
            {status}
          </span>
          <span className="mx-1">·</span>
          <span className="typo-14-regular">
            {address}
          </span>
        </p>
      </div>

      {/* 이미지 리스트 */}
      <div className="-mx-4">
        <div className="flex gap-3 overflow-x-auto no-scrollbar px-4">
          {images.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`place-image-${index}`}
              className="
                w-[92px] h-[92px]
                rounded-[8px]
                object-cover
                flex-shrink-0
              "
            />
          ))}
        </div>
      </div>
    </div>
  );
}
