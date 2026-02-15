import { useState } from "react";
import NumberPad from "../../Guest/Coupon/NumberPad";

type Step = "check" | "change";

/** mock 기존 비밀번호 */
const MOCK_PASSWORD = "1234";

interface Props {
  step: Step;
  onStepChange: (step: Step) => void;
  onComplete: (newPassword: string) => void;
}

export default function CouponPasswordChange({
  step,
  onStepChange,
  onComplete,
}: Props) {
  const [code, setCode] = useState("");
  const [isError, setIsError] = useState(false);

  const handlePress = (num: string) => {
    if (code.length >= 4) return;
    setIsError(false);
    setCode((prev) => prev + num);
  };

  const handleDelete = () => {
    setIsError(false);
    setCode((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    setIsError(false);
    setCode("");
  };

  const handleComplete = () => {
    if (code.length !== 4) {
      setIsError(true);
      return;
    }

    if (step === "check") {
      if (code === MOCK_PASSWORD) {
        onStepChange("change");
        setCode("");
        setIsError(false);
      } else {
        setIsError(true);
      }
      return;
    }

    // change step
    onComplete(code);
    setCode("");
  };

  return (
    <div className="flex flex-col flex-1">
      {/* 비밀번호 표시 */}
      <div className="flex flex-col items-center gap-[17px]">
        <div className="flex justify-center gap-[24px]">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-[46px] h-[46px] flex items-center justify-center">
                <span
                  className={`typo-title mb-[4px] ${
                    isError ? "text-primary-01" : "text-black"
                  }`}
                >
                  {code[i] || ""}
                </span>
              </div>
              <div
                className={`w-[48px] h-[3px] ${
                  isError
                    ? "bg-primary-01"
                    : code[i]
                    ? "bg-black"
                    : "bg-[#BABABA]"
                }`}
              />
            </div>
          ))}
        </div>

        {/* 에러 */}
        <div className="h-[30px] pt-[12px]">
          {isError && step === "check" && (
            <p className="text-primary-01 typo-12-medium text-center">
              <span>
                비밀 번호 불일치.
                <br />
                올바른 비밀 번호를 입력하십시오.
              </span>
            </p>
          )}
        </div>
      </div>

      {/* 완료 버튼 */}
      <div className="flex justify-end mt-[88px] mb-[22px]">
        <button
          onClick={handleComplete}
          className="flex justify-center items-center gap-[10px] w-[84px] h-[39px] rounded-full border border-primary-01"
        >
          <span className="typo-16-regular text-primary-01">완료</span>
        </button>
      </div>

      <NumberPad
        onPress={handlePress}
        onDelete={handleDelete}
        onClear={handleClear}
      />
    </div>
  );
}
