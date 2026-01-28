import { useEffect, useRef, useState } from "react";
import Lottie from "lottie-react";
import type { LottieRefCurrentProps } from "lottie-react";
import splashAnim from "../../assets/lottie/splash.json";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";

export default function SplashPage() {
  const navigate = useNavigate(); 

  const lottieRef = useRef<LottieRefCurrentProps | null>(null);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      lottieRef.current?.setSpeed(0.8);
      lottieRef.current?.play();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`
        relative h-dvh w-full overflow-hidden
        bg-[#FFECEA]
        bg-[image:var(--gradient-radial)]
      `}
    >
      {/* 건너뛰기 버튼
      <button
        type="button"
        className={`
          absolute right-5 top-6 z-30
          text-[#4D4D4D] text-[16px] font-normal leading-normal
        `}
        onClick={() => {
          // TODO: navigate
        }}
      >
        건너뛰기
      </button> */}

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center">
        {/* Title (1s) */}
        <div className="mt-[92px] text-center anim-fade-up [animation-delay:1s]">
          <h1 className="text-black typo-title">
            오늘 다녀온 가게,
            <br />
            하고 싶은 말이 있나요?
          </h1>
        </div>

        {/* Subtitle (2s) */}
        <p className="mt-[16px] text-center text-neutrals-08 typo-16-medium anim-fade-up [animation-delay:2s]">
          좋은 아이디어를 남기고 쿠폰을 받아보세요 !
        </p>

        {/* Lottie (3s) */}
        <div className="pointer-events-none absolute left-0 right-0 top-[9px] z-0 anim-fade-up [animation-delay:3s]">
          <div className="mx-auto w-full max-w-[390px]">
            <Lottie
              lottieRef={lottieRef}
              animationData={splashAnim}
              autoplay={false}
              loop={false}
              onComplete={() => {
                setShowButton(true);
              }}
              className="h-full w-full"
            />
          </div>
        </div>

        {/* 다음 버튼 (lottie 종료 후 fade-in) */}
        {showButton && (
          <div className="mt-auto flex w-full justify-center pb-8 anim-fade-up">
            <Button
              variant="primary"
              fullWidth={false}
              className="w-[343px]"
              height="h-[52px]"
              onClick={() => {
                navigate("/type", { replace: true })
              }}
            >
              다음
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
