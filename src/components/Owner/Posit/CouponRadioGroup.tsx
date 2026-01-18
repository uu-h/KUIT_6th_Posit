export type CouponOption = "americano" | "dessert" | "icetea";

type CouponItem = {
  value: CouponOption;
  label: string;
};

type CouponRadioGroupProps = {
  value: CouponOption | "";
  onChange: (value: CouponOption) => void;
  items?: CouponItem[];
};

const DEFAULT_ITEMS: CouponItem[] = [
  { value: "americano", label: "아이스 아메리카노 1잔 무료" },
  { value: "dessert", label: "디저트 20% 할인 쿠폰" },
  { value: "icetea", label: "아이스티 1잔 무료" },
];

export default function CouponRadioGroup({
  value,
  onChange,
  items = DEFAULT_ITEMS,
}: CouponRadioGroupProps) {
  return (
    <div className="mt-[10px] space-y-[8px]">
      {items.map((item) => {
        const checked = value === item.value;

        return (
          <label
            key={item.value}
            className="flex items-center gap-[9px] cursor-pointer select-none"
          >
            {/* 실제 input은 숨김 */}
            <input
              type="radio"
              name="coupon"
              checked={checked}
              onChange={() => onChange(item.value)}
              className="sr-only"
            />

            {/* 커스텀 라디오 */}
            <span
              className={[
                "relative  h-[20px] w-[20px] items-center justify-center rounded-full border",
                checked
                  ? "border-primary-01 bg-primary-01"
                  : "border-neutrals-07",
                "shrink-0",
              ].join(" ")}
            >
              {checked && (
                <span className="absolute left-1/2 top-1/2 h-[10px] w-[10px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
              )}
            </span>

            <span className="text-[14px] font-normal leading-[120%] text-neutrals-09">
              {item.label}
            </span>
          </label>
        );
      })}
    </div>
  );
}
