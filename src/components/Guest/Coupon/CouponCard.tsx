import DownloadIcon from "../../../assets/Guest/Coupon/Download.svg";

interface CouponCardProps {
  id: number;           // optional? 필요하면 넣어도 ok
  brand: string;
  menu: string;
  expiration: string;
  brandImg: string;
  isUsed: boolean;
  onClick: () => void;
}

export default function CouponCard({
  brand,
  menu,
  expiration,
  brandImg,
  isUsed,
  onClick, 
}: CouponCardProps) {
  return (
    <div 
      onClick={isUsed ? undefined : onClick} 
      className={`w-[343px] h-[109px] shadow-[0_0_5px_rgba(0,0,0,0.25)] rounded-[16px] flex justify-between overflow-hidden cursor-pointer`}
    >
      <div className="flex items-center gap-[15px] p-[12px]">
        <img src={brandImg} className="w-[56px] h-[56px]" alt={brand} />
        <div className="flex flex-col gap-[4px]">
          <span className="typo-13-semibold">{brand}</span>
          <span className="typo-16-semibold">{menu}</span>
          <span className="typo-13-regular text-neutrals-08">{expiration}까지</span>
        </div>
      </div>

      {isUsed ? (
        <div className="bg-corals-000 w-[68px] flex items-center justify-center">
          <span className="typo-13-regular">사용 완료</span>
        </div>
      ) : (
        <div className="bg-corals-000 w-[68px] flex flex-col items-center justify-center gap-[10px]">
          <img src={DownloadIcon} alt="download" />
          <span className="typo-13-regular">다운로드</span> 
        </div>
      )}
    </div>
  );
}