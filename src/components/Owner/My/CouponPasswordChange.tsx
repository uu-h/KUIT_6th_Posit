import { useState } from "react";
import NumberPad from "../../Guest/Coupon/NumberPad";
import { http } from "../../../api/http";

type Step = "check" | "change";

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
  const [currentPin, setCurrentPin] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePress = (num: string) => {
    if (code.length >= 4 || loading) return;
    setIsError(false);
    setCode((prev) => prev + num);
  };

  const handleDelete = () => {
    if (loading) return;
    setIsError(false);
    setCode((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    if (loading) return;
    setIsError(false);
    setCode("");
  };

  const handleComplete = async () => {
    if (code.length !== 4 || loading) {
      setIsError(true);
      return;
    }

    try {
      setLoading(true);
      setIsError(false);

      if (step === "check") {
        await http.post("/owner/coupon-pin/verify", {
          currentPin: code,
        });

        setCurrentPin(code);
        setCode("");
        onStepChange("change");
        return;
      }

      await http.patch("/owner/coupon-pin", {
        currentPin,
        pin: code,
      });

      onComplete(code);
      setCode("");
    } catch {
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1">
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

        <div className="h-[30px] pt-[12px]">
          {isError && (
            <p className="text-primary-01 typo-12-medium text-center">
              {step === "check"
                ? "비밀번호가 올바르지 않습니다."
                : "비밀번호 변경에 실패했습니다."}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end mt-[88px] mb-[22px]">
        <button
          onClick={handleComplete}
          disabled={loading}
          className="flex justify-center items-center gap-[10px] w-[84px] h-[39px] rounded-full border border-primary-01 disabled:opacity-50"
        >
          <span className="typo-16-regular text-primary-01">
            완료
          </span>
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
