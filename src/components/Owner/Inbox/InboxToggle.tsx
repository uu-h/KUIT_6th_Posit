const TABS: { key: TabKey; label: string }[] = [
  { key: "answer", label: "고민 답변" },
  { key: "memo", label: "자유 메모함" },
  { key: "done", label: "채택 완료" },
];

const formatCount = (count?: number) => {
  if (!count || count <= 0) return null;
  if (count >= 10) return "10+";
  return count;
};

type TabKey = "answer" | "memo" | "done";

export default function InboxToggle({
  active,
  counts,
  onChange,
}: {
  active: TabKey;
  counts: Record<TabKey, number>;
  onChange: (key: TabKey) => void;
}) {
  return (
    <div className="w-full h-[44px] border-b border-[#CAC4D0] flex">
      {TABS.map((tab) => {
        const isActive = active === tab.key;
        const displayCount = formatCount(counts[tab.key]);

        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className="flex-1 flex flex-col items-center justify-center relative"
          >
            <div className="flex items-center gap-[6px]">
              <span
                className={`typo-14-medium ${
                  isActive ? "text-primary-01" : "text-[#49454F]"
                }`}
              >
                {tab.label}
              </span>

              {displayCount && (
                <span
                  className={`typo-14-medium ${
                    isActive ? "text-primary-01" : "text-[#49454F]"
                  }`}
                >
                  {displayCount}
                </span>
              )}
            </div>

            {isActive && (
              <div className="absolute bottom-0 w-[83px] h-[3px] bg-primary-01 rounded-t-full" />
            )}
          </button>
        );
      })}
    </div>
  );
}
