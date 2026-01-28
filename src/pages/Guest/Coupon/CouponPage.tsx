import { useState, useEffect } from "react"; 
import { useNavigate, useLocation } from "react-router-dom";
import BottomBar from "../../../components/BottomBar/BottomBar";
import Coupons from "../../../components/Guest/Coupon/Coupons";
import CouponDescription from "../../../components/Guest/Coupon/CouponDescription";
import AppBar from "../../../components/Common/AppBar";

export default function CouponPage() {
  const [isUsed, setIsUsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleUseCoupon = () => {
    navigate("verify");
  };

  // VerifyPage에서 돌아올 때 state.used 확인
  useEffect(() => {
    if (location.state?.used) {
      setIsUsed(true);
      // 선택적으로 state 초기화
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, location.pathname, navigate]);

  return (
    <div className="flex flex-col min-h-screen px-[16px]">
      <AppBar title="쿠폰" layout="left" leftType="left" />

      <div className="flex flex-col items-center">
      <div className="flex flex-col w-full gap-[26px]">
        <h1 className="typo-sub-title leading-[130%] my-[13px] h-[48px]">
          {isUsed ? "사용이 완료되었어요." : <>사용할 때<br />점원에게 보여주세요.</>}
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
      </div>
  
      <BottomBar active="coupon" onChange={() => {}} />
    </div>
  );
}
