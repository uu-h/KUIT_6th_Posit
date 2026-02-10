import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LogoIcon from "../../assets/Guest/Onboarding/Logo.svg?url";

export default function Onboarding() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/splash", { replace: true });
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <div className="animate-fade-in">
        <img
          src={LogoIcon}
          alt="로고 이미지"
          className="block w-[139px] h-[139px]"
          decoding="async"
          loading="eager"
        />
      </div>

      <h1 className="text-shades-02 text-[34px] text-center font-bold mt-4">
        POSiT!
      </h1>

      <p className="typo-14-regular text-shades-02 text-center mt-2">
        post your idea .
      </p>
    </div>
  );
}
