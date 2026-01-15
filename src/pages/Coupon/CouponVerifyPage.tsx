import CouponVerify from "../../components/Guest/Coupon/CouponVerify";

export default function CouponVerifyPage() {
  const handleSuccess = () => {
    // 나중에 navigate("/coupon?used=true")
    console.log("verify success");
  };

  const handleBack = () => {
    // 나중에 navigate(-1)
    console.log("go back");
  };

  return (
    <div className="w-full min-h-screen px-[16px] pt-[22px] flex flex-col">
      <header className="mb-[30px]">
        <img
          src="src/assets/Guest/Coupon/LeftArrow.svg"
          className="cursor-pointer"
          onClick={handleBack}
        />
      </header>

      <div className="w-full flex flex-col gap-[16px]">
        <h1 className="text-[24px] font-semibold leading-[130%] h-[62px]">
            사용할 때<br />점원에게 보여주세요.
        </h1>
        <h3 className="text-16-regular text-[#5D5D5D]">비밀번호 4자리를 입력해주세요.</h3>
      </div>

      <CouponVerify onSuccess={handleSuccess} />
    </div>
  );
}
