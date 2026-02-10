import { useRef, useState } from "react";
import CategoryChip from "./CategoryChip";

export type CategoryTypeCode =
  | "DESSERT"
  | "HUGE"
  | "BRUNCH"
  | "ROASTERY"
  | "BOOK_CAFE"
  | "PET_FRIENDLY"
  | "STUDY_CAFE"
  | "TEA_HOUSE";

type ChipItem = {
  label: string;
  type?: CategoryTypeCode; // undefined면 "주변" 같은 의미
};

type Props = {
  value?: CategoryTypeCode | null;
  onChange?: (next: CategoryTypeCode | null) => void;
};

const CHIPS: ChipItem[] = [
  { label: "주변", type: undefined },
  { label: "스터디 카페", type: "STUDY_CAFE" },
  { label: "브런치 카페", type: "BRUNCH" },
  { label: "디저트 카페", type: "DESSERT" },
  // 필요하면 계속 추가
];

export default function CategoryChipBar({ value = null, onChange }: Props) {
  const [active, setActive] = useState<CategoryTypeCode | null>(value);
  const containerRef = useRef<HTMLDivElement>(null);

  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const onMouseDown = (e: React.MouseEvent) => {
    isDown.current = true;
    startX.current = e.pageX;
    scrollLeft.current = containerRef.current!.scrollLeft;
  };

  const onMouseLeave = () => {
    isDown.current = false;
  };

  const onMouseUp = () => {
    isDown.current = false;
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDown.current) return;
    e.preventDefault();

    const x = e.pageX;
    const walk = x - startX.current;
    containerRef.current!.scrollLeft = scrollLeft.current - walk;
  };

  const setNext = (next: CategoryTypeCode | null) => {
    setActive(next);
    onChange?.(next);
  };

  return (
    <div
      ref={containerRef}
      className="w-full overflow-x-auto no-scrollbar cursor-grab active:cursor-grabbing"
      onMouseDown={onMouseDown}
      onMouseLeave={onMouseLeave}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
    >
      <div className="flex w-max gap-2 px-4">
        {CHIPS.map((c) => {
          const code = c.type ?? null;
          return (
            <CategoryChip
              key={c.label}
              label={c.label}
              selected={active === code}
              onClick={() => setNext(code)}
            />
          );
        })}
      </div>
    </div>
  );
}
