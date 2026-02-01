import { useParams, useNavigate, useLocation } from "react-router-dom";
import type { Coupon } from "./couponData";
import Coupons from "../../../components/Guest/Coupon/Coupons";
import CouponDescription from "../../../components/Guest/Coupon/CouponDescription";
import AppBar from "../../../components/Common/AppBar";
import GuestLayout from "../../../layouts/GuestLayout";

export default function CouponPage() {
  const { couponId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const rawCoupon = location.state?.coupon as Coupon;
  const successId = location.state?.usedCouponId;

  const isUsed =
    rawCoupon?.isUsed || (successId && Number(successId) === Number(couponId));

  const coupon = rawCoupon ? { ...rawCoupon, isUsed } : null;

  if (!coupon) return <div>쿠폰 정보를 불러올 수 없습니다.</div>;

  const handleUseCoupon = () => {
    navigate(`/guest/coupon/${couponId}/verify`, { state: { coupon } });
  };

  return (
    <GuestLayout active="coupon">
      <div className="flex flex-col min-h-screen px-[16px]">
        <AppBar
          title="쿠폰"
          layout="left"
          leftType="left"
          onBack={() => navigate("/guest/coupon")}
        />

        <div className="flex flex-col items-center w-full gap-[26px]">
          <h1 className="typo-sub-title leading-[130%] my-[13px] h-[48px] w-full text-left">
            {isUsed ? (
              "사용이 완료되었어요."
            ) : (
              <>
                사용할 때<br />
                점원에게 보여주세요.
              </>
            )}
          </h1>

          <Coupons used={isUsed} onUse={handleUseCoupon} />

          {isUsed ? (
            <div className="pt-[37px] typo-sub-title text-primary-01 text-center">
              다음 POSiT!도 기대할게요!
            </div>
          ) : (
            <CouponDescription
              expiration={coupon.expiration}
              brand={coupon.brand}
            />
          )}
        </div>
      </div>
    </GuestLayout>
  );
}
