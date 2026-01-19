import { useState } from "react"; 
import BottomBar from "../../../components/BottomBar/BottomBar";
import Coupons from "../../../components/Guest/Coupon/Coupons";
import CouponDescription from "../../../components/Guest/Coupon/CouponDescription";
import AppBar from "../../../components/Common/AppBar";

export default function CouponPage() {
  const [isUsed, setIsUsed] = useState(false);

  const handleUseCoupon = () => {
    // 버튼을 누르면 상태를 true로 변경 해놨는데 나중에 라우팅 해야함
    setIsUsed(true);
    console.log("쿠폰 사용 완료");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <AppBar title="쿠폰" layout="left" leftType="left" />

      <div className="flex flex-col px-[16px] w-full gap-[26px]">
    
        <h1 className="text-[24px] font-semibold leading-[130%] mt-[13px] h-[62px]">
          {isUsed ? (
            "사용이 완료되었어요."
          ) : (
            <>사용할 때<br />점원에게 보여주세요.</>
          )}
        </h1>


        <Coupons used={isUsed} onUse={handleUseCoupon} />

        {isUsed ? (
          <div className="pt-[37px] typo-sub-title text-primary-01 text-center">
            다음 POSiT!도 기대할게요!
          </div>
        ) : (
          <CouponDescription />
        )}
      </div>
      
      <div className="mt-auto">
        <BottomBar active="coupon" onChange={() => {}} />
      </div>
    </div>
  );
}