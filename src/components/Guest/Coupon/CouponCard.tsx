interface CouponCardProps {
  brand: string;
  menu: string;
  expiration: string;
  brandImg: string;
  isUsed: boolean;
}

export default function CouponCard({
  brand,
  menu,
  expiration,
  brandImg,
  isUsed,
}: CouponCardProps) {
  return (
    <div className="w-[343px] h-[109px] shadow-[0_0_5px_rgba(0,0,0,0.25)] rounded-[16px] flex justify-between overflow-hidden">
      <div className="flex items-center gap-[15px] p-[12px]">
        <img src={brandImg} className="w-[56px] h-[56px]" />
        <div className="flex flex-col gap-[4px]">
          <span className="typo-13-semibold">{brand}</span>
          <span className="typo-16-semibold">{menu}</span>
          <span className="typo-13-regular text-neutrals-08">{expiration}</span>
        </div>
      </div>

      {isUsed ? (
        <div className="bg-corals-000 w-[68px] flex items-center justify-center">
          <span className="typo-13-regular">사용 완료</span>
        </div>
      ) : (
        <div className="bg-corals-000 w-[68px] flex flex-col items-center justify-center gap-[10px]">
          <img src="src/assets/Guest/Coupon/Download.svg" />
          <span className="typo-13-regular">다운로드</span>
        </div>
      )}
    </div>
  );
}
