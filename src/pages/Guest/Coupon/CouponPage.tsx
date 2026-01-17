import BottomBar from "../../../components/BottomBar/BottomBar";
import Coupons from "../../../components/Guest/Coupon/Coupons";
import CouponDescription from "../../../components/Guest/Coupon/CouponDescription";
import AppBar from "../../../components/Common/AppBar";


export default function CouponPage() {
  const handleUseCoupon = () => {
    // 나중에 navigate("/coupon/verify")
    console.log("go to verify page");
  };

  return (
    <div className="flex flex-col min-h-screen">
      
      <AppBar title="쿠폰" layout="left" leftType="left"></AppBar>

      <div className="flex flex-col px-[16px] w-full gap-[26px]">
        <h1 className="text-[24px] font-semibold leading-[130%] mt-[13px]">
          사용할 때<br />점원에게 보여주세요.
        </h1>

        <Coupons used={false} onUse={handleUseCoupon} />

        <CouponDescription />
      </div>
      
      <div className="mt-auto">
        <BottomBar active="coupon" onChange={() => {}} />
      </div>
    
    </div>
  );
}
