import { useState, useRef } from "react";
import BottomBar from "../../components/BottomBar";

export default function CouponPage() {
  const [step, setStep] = useState<"coupon" | "verify">("coupon");
  const [used, setUsed] = useState(false);
  const [code, setCode] = useState("");
  const [isError, setIsError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const CORRECT_CODE = "1234"; // 임시 비밀번호

  return (
    <div className="min-h-screen w-full flex flex-col mt-[22px] px-[16px]">
      {/* 쿠폰 화면 */}
      {step === "coupon" && (
        <header className="flex flex-col gap-[26px]">
          <header className="flex items-start justify-start gap-[12px]">
            <img src="src/assets/Guest/Coupon/LeftArrow.svg" alt="왼쪽 화살표" />
            <h1 className="typo-sub-title">쿠폰</h1>
          </header>

          <div className="h-[62px] pt-[4px]">
            <h1 className="text-[24px] font-semibold leading-[130%]">
              {used ? "사용이 완료되었어요." : (
                <>
                  사용할 때<br />점원에게 보여주세요.
                </>
              )}
            </h1>
          </div>

          <div className="w-[343px] h-[370px] flex flex-col rounded-[16px] overflow-hidden shadow-[0_0_5px_0_rgba(0,0,0,0.25)]">
            <div className="h-[225px]"><img src="src/assets/Guest/Coupon/Coffee.png" alt="쿠폰 이미지" /></div>
            <div className="flex-1 flex flex-col items-center justify-center gap-[14px]">
              <h3 className="text-[16px] font-semibold text-neutrals-09">아메리카노 1잔 무료 쿠폰</h3>
              <button
                disabled={used}
                className={`
                  text-neutrals-01
                  typo-sub-title
                  p-[10px]
                  rounded-[8px]
                  ${used ? "bg-neutrals-07 cursor-default" : "bg-primary-01 cursor-pointer"}
                `}
                onClick={() => setStep("verify")}
              >
                {used ? "사용완료" : "사용하기"}
              </button>
            </div>
            <BottomBar active="coupon" onChange={(key) => console.log(key)} />
          </div>

          <section
            className="
              flex flex-col gap-[20px]
              typo-15-semibold
              [&>div]:flex
              [&>div]:justify-between
              [&>div>span:first-child]:text-neutrals-07
              pt-[20px]
            "
          >
            <div><span>조건</span><span>교환 장소에 방문 후 쿠폰 제시</span></div>
            <div><span>유효기간</span><span>2025년 11월 24일</span></div>
            <div><span>쿠폰 사용처</span><span>카페 레이지아워</span></div>
          </section>
        </header>
      )}

      {/* 인증 화면 */}
      {step === "verify" && (
        <div className="flex flex-col gap-[26px] relative">
        
            <header className="flex items-start justify-start">
                <img
                    src="src/assets/Guest/Coupon/LeftArrow.svg"
                    alt="뒤로가기"
                    className="cursor-pointer"
                />
            </header>

            <div className="h-[62px] pt-[4px] flex flex-col gap-[16px]">
                <h1 className="text-[24px] font-semibold leading-[130%]">사용할 때<br />점원에게 보여주세요.</h1>
                <h3 className="text-[16px] font-normal text-[#5D5D5D]">비밀번호 4자리를 입력해주세요.</h3>
            </div>


          <input
            ref={inputRef}
            type="tel"
            pattern="\d*"
            maxLength={4}
            value={code}
            onChange={(e) => {
            const value = e.target.value.replace(/[^0-9]/g, "");
            setCode(value);

            if (value.length === 4) {
              if (value === CORRECT_CODE) {
                setUsed(true);
                setStep("coupon");
                setCode("");
                setIsError(false);
              } else {
                setIsError(true);
              }
              } else {
                setIsError(false);
              }
            }}
              autoFocus
              className="absolute opacity-0 w-full h-full cursor-default"
              style={{ caretColor: 'transparent' }}
          />

          <div 
            className="flex justify-center gap-[24px] cursor-text" 
            onClick={() => inputRef.current?.focus()}
          >
            {[0, 1, 2, 3].map((idx) => {
              const isFilled = code.length > idx;
              return (
                <div key={idx} className="flex flex-col items-center w-[40px] mt-[86px]">
                  <span className={`
                    text-[32px] font-normal h-[32px] leading-[38px] transition-colors
                    ${isError ? "text-red-500" : isFilled ? "text-black" : "text-black"}
                  `}>
                    {code[idx] || ""}
                  </span>
                  <div className={`
                    w-[48px] h-[3px] mt-[8px] transition-colors
                    ${isError ? "bg-red-500" : isFilled ? "bg-black" : "bg-[#BABABA]"}
                  `} />
                </div>
              );
            })}
          </div>
        </div> 
      )}
    </div>
  );
}
