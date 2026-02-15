import { useParams, useNavigate } from "react-router-dom";
import AppBar from "../../../components/Common/AppBar";
import CouponVerify from "../../../components/Guest/Coupon/CouponVerify";

export default function CouponVerifyPage() {
  const { id } = useParams(); // /coupons/:id/verify
  const navigate = useNavigate();

  if (!id) return <div className="p-4">잘못된 접근입니다.</div>;

  const handleSuccess = () => {
    // 사용 성공하면 다시 상세로
    navigate(`/guest/coupon/${id}`, { 
      replace: true,
      state: { used: true },
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
          couponId={Number(id)}
          onSuccess={handleSuccess}
        />
      </div>
    </div>
  );
}
