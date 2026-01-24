type StoreSectionKey = "home" | "posit" | "menu";

type StoreSectionNavProps = {
  active: StoreSectionKey;
  onChange: (key: StoreSectionKey) => void;
};

const TABS: { key: StoreSectionKey; label: string }[] = [
  { key: "home", label: "홈" },
  { key: "posit", label: "POSiT" },
  { key: "menu", label: "대표 메뉴" },
];

export default function StoreSectionNav({
  active,
  onChange,
}: StoreSectionNavProps) {
  const activeIndex = Math.max(
    0,
    TABS.findIndex((t) => t.key === active),
  );

  return (
    <div className="bg-white">
      <div className="relative h-[59px]">
        <div className="h-full grid grid-cols-3">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => onChange(tab.key)}
              className={`h-full flex items-center justify-center typo-16-semibold
                ${active === tab.key ? "text-black" : "text-neutrals-06"}
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div
          className="absolute bottom-0 left-0 h-[2px] w-1/3 bg-black transition-transform duration-200"
          style={{ transform: `translateX(${activeIndex * 100}%)` }}
        />
      </div>

      <div className="h-[1px] -mx-4 bg-neutrals-07" />
    </div>
  );
}

export type { StoreSectionKey };
