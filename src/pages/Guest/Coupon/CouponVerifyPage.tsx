import { useParams, useNavigate, useLocation } from "react-router-dom";
import type { Coupon } from "./couponData"; // API로 대체 할거임!!!!
import CouponVerify from "../../../components/Guest/Coupon/CouponVerify";
import AppBar from "../../../components/Common/AppBar";

export default function CouponVerifyPage() {
  const { couponId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const coupon = location.state?.coupon as Coupon;

  // 데이터가 없을 경우 예외 처리
  if (!coupon) return <div className="p-4">잘못된 접근입니다.</div>;

  const handleSuccess = () => {
   
    navigate(`/guest/coupon/${couponId}`, {
      state: { 
        usedCouponId: couponId,
        coupon: { ...coupon, isUsed: true } // 업데이트된 데이터도 같이 보내기
      },
      replace: true 
    });
  };

  return (
    <div className="w-full min-h-screen flex flex-col">
      <AppBar layout="center" leftType="left" onBack={() => navigate(-1)} />
      
      <div className="w-full flex-1 flex flex-col pt-[13px] px-[16px]">
        <div className="flex flex-col gap-[24px] mb-[40px]">
          <h1 className="typo-sub-title h-[48px]">
            사용할 때<br />점원에게 보여주세요.
          </h1>
          <h3 className="text-16-regular text-[#5D5D5D]">
            비밀번호 4자리를 입력해주세요.
          </h3>
        </div>
        
        <CouponVerify
          correctPassword={String(coupon.password)}
          onSuccess={handleSuccess}
        />
      </div>
    </div>
  );
}
