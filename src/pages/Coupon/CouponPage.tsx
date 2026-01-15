import BottomBar from "../../components/BottomBar";
import Cupons from "../../components/Guest/Coupon/Coupon";
import CouponDescription from "../../components/Guest/Coupon/CouponDescription";

export default function CouponPage() {
  const handleUseCoupon = () => {
    // 나중에 navigate("/coupon/verify")
    console.log("go to verify page");
  };

  return (
    <div className="flex flex-col min-h-screen px-[16px] pt-[22px]">
      
      <header className="flex items-start gap-[12px] mb-[30px]">
        <img src="src/assets/Guest/Coupon/LeftArrow.svg" />
        <h1 className="typo-sub-title">쿠폰</h1>
      </header>

      <h1 className="text-[24px] font-semibold leading-[130%] mb-[26px]">
        사용할 때<br />점원에게 보여주세요.
      </h1>

      <Cupons used={false} onUse={handleUseCoupon} />

      <CouponDescription />

      <div className="mt-auto">
        <BottomBar active="coupon" onChange={() => {}} />
      </div>
    </div>
  );
}
