export default function SplashPage() {
  return (
    <div
      className={`
        relative h-dvh w-full overflow-hidden
        bg-[#FFECEA]
        bg-[radial-gradient(73.63%_38.33%_at_50%_54.31%,rgba(255,122,110,0.75)_0%,rgba(255,255,255,0.75)_100%)]
      `}
    >
      {/* 건너뛰기 버튼 */}
      <button
        type="button"
        className={`
          absolute right-5 top-6 z-20
          text-[#4D4D4D] text-[16px] font-normal leading-normal
        `}
        onClick={() => {
          // TODO: navigate
        }}
      >
        건너뛰기
      </button>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center px-6">
        {/* Title */}
        <div className="mt-[92px] text-center">
          <h1 className="text-black text-center text-[24px] font-bold leading-normal">
            오늘 다녀온 가게,
            <br />
            하고 싶은 말이 있나요?
          </h1>
          <p className="mt-3 text-[#484848] text-[14px] font-medium leading-normal">
            좋은 아이디어를 남기고 쿠폰을 받아보세요 !
          </p>
        </div>

        {/* Lottie placeholder (Lottie 올릴 자리) */}
        <div className="pointer-events-none absolute inset-x-0 top-[160px] mx-auto w-full max-w-[390px]">
          <div className="h-[520px] w-full rounded-2xl border border-white/30 bg-white/10" />
        </div>

        {/* 다음 버튼 */}
        <div className="mt-auto flex w-full justify-center pb-8">
          <button
            type="button"
            className={`
              flex w-[364px] h-[56px]
              justify-center items-center
              rounded-xl bg-[#FF7B73]
              shadow-[0_10px_30px_rgba(0,0,0,0.12)]
              active:scale-[0.99]
            `}
            onClick={() => {
              // TODO: navigate
            }}
          >
            <span className="whitespace-nowrap text-white text-[20px] font-bold leading-normal">
              다음
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
