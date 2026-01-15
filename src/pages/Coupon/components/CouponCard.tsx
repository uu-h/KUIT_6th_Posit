interface CouponCardProps {
  brand: string;
  menu: string;
  expiration: string;
  brandImg: string;
  selectedTab: "available" | "used";
}

export default function CouponCard({ brand, menu, expiration, brandImg, selectedTab }: CouponCardProps) {
  const isUsed = selectedTab === "used";

  return (
    <div className="w-[343px] h-[109px] shadow-[0_0_5px_0_rgba(0,0,0,0.25)] rounded-[16px] overflow-hidden flex justify-between">
      <div className="flex items-center gap-[15px] p-[12px]">
        <img src={brandImg} alt="브랜드 이미지" className="w-[56px] h-[56px]"/>
        <div className="flex flex-col justify-around gap-[4px] h-[65px]">
          <span className="typo-13-semibold">{brand}</span>
          <span className="typo-16-semibold">{menu}</span>
          <span className="text-neutrals-08 typo-13-regular">{expiration}</span>
        </div>
      </div>

      {/* 나중에 상태 받으면 다르게 구현할 부분*/}
      {isUsed ? (
        <div className="bg-corals-000 flex items-center justify-center w-[68px]">
          <span className="typo-13-regular">사용 완료</span>
        </div>
      ) : (
        <section className="bg-corals-000 flex flex-col items-center justify-center w-[68px] gap-[10px]">
          <img src="src/assets/Guest/Coupon/Download.svg" alt="다운로드 아이콘"/>
          <span className="typo-13-regular">다운로드</span>
        </section>
      )}
    </div>
  );
}
