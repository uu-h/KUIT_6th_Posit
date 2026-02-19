import { useNavigate, useLocation } from "react-router-dom";
import Button from "../../../components/Button";

export default function SignupComplete() {
  const navigate = useNavigate();
  const location = useLocation();

  // 회원가입 페이지에서 넘어온 couponPin
  const couponPin = location.state?.couponPin;


  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="h-16" />

      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <h1 className="typo-sub-title mb-5">
          가입이 완료되었어요!
        </h1>
        <p className="typo-14-regular text-[#383838] leading-[150%]">
          이제 사업자 등록을 하면 서비스를<br />
          이용할 수 있어요.
        </p>
      </div>

      <div className="px-6 pb-6">
        <Button
          onClick={() =>
            navigate("/owner/store/register", {
              state: { couponPin },
            })
          }
          height="h-[48px]"
        >
          등록하기
        </Button>
      </div>
    </div>
  );
}
