import { COUPON_META } from "../../../constants/coupon";
import type { CouponItem } from "../../../types/coupon.types";
import ButtonIcon from "../../../assets/Guest/Posit/RightBlack.svg";

type Props = {
  coupon: CouponItem;
  onDetailClick?: () => void;
};

export default function CouponCard({ coupon, onDetailClick }: Props) {
  const meta = COUPON_META[coupon.couponType];

  const statusText = coupon.status === "USED" ? "사용완료" : "미사용";
  const statusClass =
    coupon.status === "USED" ? "text-[#FF0004]" : "text-black";

  return (
    <div
      className="
        w-full
        rounded-[8px]
        bg-white
        shadow-[0px_4px_10px_0px_rgba(69, 69, 69, 0.05)]
        p-[16px] pt-[10px]
      "
    >
      <div className="flex items-center justify-between">
        <p className="typo-14-medium">{coupon.receiverName}</p>

        <button
          type="button"
          onClick={onDetailClick}
          className="typo-12-medium text-neutrals-08 flex items-center gap-[4px]"
        >
          상세보기
          <img src={ButtonIcon} alt="상세보기" className="h-[8px]" />
        </button>
      </div>
      <div className="-mx-[16px] mt-[10px] h-[1px] bg-[#F5F5F5]" />

      <div className="mt-[16px] flex gap-[16px]">
        <img
          src={meta.imageUrl}
          alt={meta.title}
          className="w-[74px] h-[74px] rounded-[4px] object-cover bg-neutrals-02"
        />

        <div className="min-w-0 flex-1">
          <p className="typo-13-semibold line-clamp-1">{meta.title}</p>

          <p className="mt-[5px] typo-13-medium text-[#B3B3B3]">
            수량 {coupon.quantity}개
          </p>

          <p className={`mt-[5px] typo-12-regular ${statusClass}`}>
            {statusText}
          </p>
        </div>
      </div>
    </div>
  );
}
