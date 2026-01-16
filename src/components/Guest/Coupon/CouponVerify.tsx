import { useEffect, useRef, useState } from "react";
import NumberPad from "../../Guest/Coupon/NumberPad";

const CORRECT_CODE = "1234";

interface Props {
  onSuccess: () => void;
}

export default function CouponVerify({ onSuccess }: Props) {
  const [code, setCode] = useState("");
  const [isError, setIsError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  /** 숫자 입력 */
  const handlePress = (num: string) => {
    if (code.length >= 4) return;
    setIsError(false);
    setCode((prev) => prev + num);
  };

  /** 한 글자 삭제 */
  const handleDelete = () => {
    setIsError(false);
    setCode((prev) => prev.slice(0, -1));
  };

  /** 전체 삭제 */
  const handleClear = () => {
    setIsError(false);
    setCode("");
  };

  /** 4자리 입력 완료 시 검증 */
  useEffect(() => {
    if (code.length === 4) {
      if (code === CORRECT_CODE) {
        onSuccess();
      } else {
        setIsError(true);
      }
    }
  }, [code]);

  return (
    <div className="flex flex-col flex-1 justify-between mt-[80px]">
      {/* 상태 동기화용 input (키보드 X) */}
      <input
        ref={inputRef}
        type="tel"
        value={code}
        readOnly
        className="absolute opacity-0 pointer-events-none"
      />

      {/* 비밀번호 표시 */}
      <div className="flex justify-center gap-[24px]">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="w-[48px] h-[48px] flex items-center justify-center">
              <span
                className={`text-[32px] font-normal mb-[2px] ${
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

      {/* 숫자 패드 */}
      <NumberPad
        onPress={handlePress}
        onDelete={handleDelete}
        onClear={handleClear}
      />
    </div>
  );
}
