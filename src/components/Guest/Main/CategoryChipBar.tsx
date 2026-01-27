import { useState } from "react";
import CategoryChip from "./CategoryChip";

export default function CategoryChipBar() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar">
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
    </div>
  );
}
