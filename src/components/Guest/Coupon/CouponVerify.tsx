import { useRef, useState } from "react";

const CORRECT_CODE = "1234";

interface Props {
  onSuccess: () => void;
}

export default function CouponVerify({ onSuccess }: Props) {
  const [code, setCode] = useState("");
  const [isError, setIsError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="relative w-full mt-[85px] h-[50px]"> 
        <input
            ref={inputRef}
            type="tel"
            maxLength={4}
            value={code}
            onKeyDown={(e) => {

            if (e.key === "Backspace") {
                setIsError(false); // 삭제 시 에러 상태 초기화
            }
             }}
            onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "");
    
            setCode(value);

            if (value.length === 4) {
                if (value === CORRECT_CODE) {
                setIsError(false);
                onSuccess();
            } else {
                setIsError(true);
            }
            } else {
                setIsError(false);
            }
            }}
            autoFocus
            className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-default"
        />

        <div className="flex justify-center gap-[24px] relative z-0">
            {[0, 1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col items-center">
                    <div className="w-[48px] h-[48px] flex items-center justify-center">
                        <span className={`text-[32px] font-semibold ${isError ? "text-red-500" : "text-black"}`}>
                            {code[i] || ""}
                        </span>
                    </div>
                <div
                    className={`w-[48px] h-[3px] ${
                    isError ? "bg-red-500" : code[i] ? "bg-black" : "bg-[#BABABA]"
                    }`}
                />
                </div>
            ))}
        </div>
    </div>
  );
}
