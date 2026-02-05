import { useRef } from "react";

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
  const containerRef = useRef<HTMLDivElement>(null);

  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const onMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
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
    <div className="flex flex-col gap-4">
      {/* 텍스트 영역 */}
      <div className="flex flex-col gap-2">
        <h1 className="typo-16-bold text-black">{name}</h1>

        {/* 구분선 */}
        <div className="w-[123px] border-t border-neutrals-05 border-[0.5px]" />

        <p className="typo-14-regular text-black">{description}</p>

        <p className="typo-14-regular text-black">
          <span className="typo-14-semibold">{status}</span>
          <span className="mx-1">·</span>
          <span className="typo-14-regular">{address}</span>
        </p>
      </div>

      {/* 이미지 리스트 */}
      <div className="-mx-4">
        <div
          ref={containerRef}
          className="
            flex gap-3
            overflow-x-auto overflow-y-hidden
            no-scrollbar
            px-4
            cursor-grab active:cursor-grabbing
          "
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseLeave}
          onMouseMove={onMouseMove}
          onTouchStart={(e) => e.stopPropagation()}
        >
          {images.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`place-image-${index}`}
              className="
                w-[92px] h-[92px]
                rounded-[8px]
                object-cover
                shrink-0
                pointer-events-none
                select-none
              "
            />
          ))}
        </div>
      </div>
    </div>
  );
}
