import PencilIcon from "../../../assets/Owner/Home/Pencil.svg";
import CouponIcon from "../../../assets/Owner/Home/Coupon.svg";

type Action = {
  label: string;
  onClick?: () => void;
};

type Props = {
  left: Action;
  right: Action;
};

export default function QuickActions({ left, right }: Props) {
  return (
    <section className="rounded-[8px] border border-neutrals-04 overflow-hidden bg-white">
      <div className="grid grid-cols-2">
        <button
          type="button"
          onClick={left.onClick}
          className="
            h-[72px] ml-[18px] mr-[13px] my-[11px] px-[36.5px] pb-[9px]
            flex flex-col
            items-center justify-center
            gap-[18px]
          "
        >
          <img src={PencilIcon} alt="고민 올리기" className="h-[36px]" />
          <span className="text-black text-center text-[14px] font-medium leading-[20px] tracking-[0.1px]">
            {left.label}
          </span>
        </button>

        <button
          type="button"
          onClick={right.onClick}
          className="
            h-[72px] ml-[13px] mr-[17px] my-[11px] pt-[17px] pb-[10px]
            flex flex-col
            items-center justify-center
            gap-[18px]
          "
        >
          <img src={CouponIcon} alt="쿠폰 관리" className="h-[16px]" />
          <span className="text-black text-center text-[14px] font-medium leading-[20px] tracking-[0.1px]">
            {right.label}
          </span>
        </button>
      </div>

      {/* 중앙선 */}
      <div
        aria-hidden
        className="
      pointer-events-none
      absolute
      top-[236px] h-[81px]
      left-1/2
      w-px
      -translate-x-1/2
      bg-neutrals-04
    "
      />
    </section>
  );
}
