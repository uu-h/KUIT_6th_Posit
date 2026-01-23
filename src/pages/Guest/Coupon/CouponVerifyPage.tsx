import { useNavigate } from "react-router-dom";
import CouponVerify from "../../../components/Guest/Coupon/CouponVerify";
import AppBar from "../../../components/Common/AppBar";

export default function CouponVerifyPage() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  // 비밀번호 성공 시 CouponPage로 돌아가면서 used=true 전달
  const handleSuccess = () => {
    navigate("/couponpage", { state: { used: true } });
  };

  return (
    <div className="w-full min-h-screen flex flex-col">
      <AppBar leftType="left" onBack={handleBack} />
      <div className="w-full flex-1 flex flex-col px-[16px] mt-[13px]">
        <div className="flex flex-col gap-[30px]">
          <h1 className="typo-sub-title h-[48px]">
            사용할 때<br />점원에게 보여주세요.
          </h1>
          <h3 className="text-16-regular text-[#5D5D5D]">
            비밀번호 4자리를 입력해주세요.
          </h3>
        </div>
        <CouponVerify onSuccess={handleSuccess} />
      </div>
    </div>
  );
}
