import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { http } from "../../../api/http";
import Coupons from "../../../components/Guest/Coupon/Coupons";
import CouponDescription from "../../../components/Guest/Coupon/CouponDescription";
import AppBar from "../../../components/Common/AppBar";
import GuestLayout from "../../../layouts/GuestLayout";

interface CouponDetail {
  couponId: number;
  storeId: number;
  title: string;
  condition: string;
  expiredAt: string;
  imageUrl: string;
}

export default function CouponPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const usedFromVerify = location.state?.used === true;

  const [coupon, setCoupon] = useState<CouponDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUsed, setIsUsed] = useState(false);

  useEffect(() => {
    if (usedFromVerify) {
      setIsUsed(true);
    }
  }, [usedFromVerify]);

  useEffect(() => {
    const fetchCoupon = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const res = await http.get(`/coupons/${id}`);
        if (res.data?.isSuccess) {
          setCoupon(res.data.data);
        }
      } catch (err) {
        console.error("쿠폰 상세 로딩 에러:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCoupon();
  }, [id]);

  if (loading) return <div className="p-10 text-center">로딩중...</div>;
  if (!coupon) return <div className="p-10 text-center">쿠폰 정보가 없습니다.</div>;

  return (
    <GuestLayout active="coupon">
      <div className="h-dvh w-full flex flex-col bg-white">
        <AppBar
          title="쿠폰"
          layout="left"
          leftType="left"
          onBack={() => navigate("/guest/coupon")}
        />

        <div className="px-[16px] flex-1 overflow-y-auto">
          <div className="flex flex-col items-center w-full pt-[13px] pb-10">
            <h1 className="typo-sub-title w-full mb-[30px] text-left leading-tight">
              {isUsed ? (
                <>사용이 완료되었어요.</>
              ) : (
                <>
                  사용할 때<br />
                  점원에게 보여주세요.
                </>
              )}
            </h1>

            <Coupons
              used={isUsed}
              onUse={() => {
                if (!isUsed) {
                  navigate(`/guest/coupon/${id}/verify`);
                }
              }}
              title={coupon.condition}
            />

            {isUsed ? (
              <h1 className="mt-[63px] typo-sub-title text-primary-01">다음 POSiT!도 기대할게요!</h1>
            ) : (
              <CouponDescription
                expiration={coupon.expiredAt.slice(0, 10)}
                brand={coupon.title}
                />
            )}
          </div>
        </div>
      </div>
    </GuestLayout>
  );
}
