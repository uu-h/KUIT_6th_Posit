import CouponIcon from "../../../assets/Guest/Coupon/Coffee.png"
interface Props {
  used: boolean;
  onUse: () => void;
}

export default function Coupon({ used, onUse }: Props) {
  return (
    <div className="w-[343px] h-[370px] flex flex-col rounded-[16px] overflow-hidden shadow-[0_0_5px_0_rgba(0,0,0,0.25)]">
      <div className="h-[225px] bg-gray-100">
        <img src={CouponIcon} alt="쿠폰 이미지" className="w-full h-full object-cover" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-[14px]">
        <h3 className="text-[16px] font-semibold text-neutrals-09">
          아메리카노 1잔 무료 쿠폰
        </h3>

        <button
          disabled={used}
          onClick={onUse}
          className={`
            typo-sub-title p-[10px] rounded-[8px]
            text-white
            ${used ? "bg-neutrals-08 cursor-default" : "bg-primary-01"} 
          `}
        >
          {used ? "사용완료" : "사용하기"}
        </button>
      </div>
    </div>
  );
}