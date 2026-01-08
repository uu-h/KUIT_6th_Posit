import Lottie from "lottie-react";
import splashAnim from "../assets/lottie/splash.json";

export default function SplashPage() {
  return (
    <div
      className={`
        relative h-dvh w-full overflow-hidden
        bg-[#FFECEA]
        bg-[image:var(--gradient-radial)]
      `}
    >
      {/* 건너뛰기 버튼 (즉시 노출)
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
      <div className="relative z-10 flex h-full flex-col items-center px-6">
        {/* Title (1s) */}
        <div className="mt-[92px] text-center anim-fade-up [animation-delay:1s]">
          <h1 className="text-black typo-title">
            오늘 다녀온 가게,
            <br />
            하고 싶은 말이 있나요?
          </h1>
        </div>

        {/* Subtitle (2s) */}
        <p className="mt-3 text-center text-neutrals-08 typo-16-medium anim-fade-up [animation-delay:2s]">
          좋은 아이디어를 남기고 쿠폰을 받아보세요 !
        </p>

        {/* Lottie (3s) */}
        <div className="pointer-events-none absolute inset-0 z-0 anim-fade-up [animation-delay:3s]">
          <div className="mx-auto h-full w-full max-w-[390px]">
            <Lottie
              animationData={splashAnim}
              loop
              autoplay
              className="h-full w-full"
            />
          </div>
        </div>

        {/* 다음 버튼 (4s) */}
        <div className="mt-auto flex w-full justify-center pb-8 anim-fade-up [animation-delay:4s]">
          <button
            type="button"
            className={`
              flex items-center justify-center
              h-[56px] w-[364px]
              rounded-[8px] bg-primary-01
              active:scale-[0.99]
            `}
            onClick={() => {
              // TODO: navigate
            }}
          >
            <span className="whitespace-nowrap text-white typo-sub-title">
              다음
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
