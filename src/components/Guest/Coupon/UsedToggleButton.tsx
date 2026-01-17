interface CouponTabProps {
  selectedTab: "available" | "used";
  onChange: (tab: "available" | "used") => void;
  availableCount: number;
  usedCount: number;
}

export default function UsedToggleButton({
  selectedTab,
  onChange,
  availableCount,
  usedCount,
}: CouponTabProps) {
  return (
    <div className="flex mt-[41px]">
      <button
        onClick={() => onChange("available")}
        className={`flex-1 pb-[14px] ${
          selectedTab === "available"
            ? "border-b-2 border-black text-black"
            : "border-b border-neutrals-07 text-neutrals-06"
        }`}
      >
        <span className="typo-16-semibold">사용가능 {availableCount}</span>
      </button>

      <button
        onClick={() => onChange("used")}
        className={`flex-1 pb-[14px] ${
          selectedTab === "used"
            ? "border-b-2 border-black text-black"
            : "border-b border-neutrals-07 text-neutrals-06"
        }`}
      >
        <span className="typo-16-semibold">사용완료 {usedCount}</span>
      </button>
    </div>
  );
}
