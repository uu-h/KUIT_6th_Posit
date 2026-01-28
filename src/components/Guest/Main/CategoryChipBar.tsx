import { useRef, useState } from "react";
import CategoryChip from "./CategoryChip";

export default function CategoryChipBar() {
  const [active, setActive] = useState<string | null>(null);
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
        <CategoryChip
          label="내 위치"
          selected={active === "내 위치"}
          onClick={() => setActive("내 위치")}
        />
        <CategoryChip
          label="스터디 카페"
          selected={active === "스터디 카페"}
          onClick={() => setActive("스터디 카페")}
        />
        <CategoryChip
          label="책방"
          selected={active === "책방"}
          onClick={() => setActive("책방")}
        />
        <CategoryChip
          label="브런치 카페"
          selected={active === "브런치 카페"}
          onClick={() => setActive("브런치 카페")}
        />
        <CategoryChip
          label="디저트 카페"
          selected={active === "디저트 카페"}
          onClick={() => setActive("디저트 카페")}
        />
      </div>
    </div>
  );
}
