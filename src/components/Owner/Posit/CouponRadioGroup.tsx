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
      {items.map((item) => (
        <label
          key={item.value}
          className="flex items-center gap-[9px] cursor-pointer select-none"
        >
          <input
            type="radio"
            name="coupon"
            checked={value === item.value}
            onChange={() => onChange(item.value)}
            className="h-[20px] w-[20px]"
          />
          <span className="text-[14px] font-normal leading-[120%] text-neutrals-09">
            {item.label}
          </span>
        </label>
      ))}
    </div>
  );
}
