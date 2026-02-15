import { useRef, useState } from "react";
import NumberPad from "../../Guest/Coupon/NumberPad";
import { http } from "../../../api/http"; // axios 인스턴스

interface Props {
  couponId: number;
  onSuccess: () => void;
}

export default function CouponVerify({ couponId, onSuccess }: Props) {
  const [code, setCode] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  /* 숫자 입력 */
  const handlePress = (num: string) => {
    if (code.length >= 4) return;
    setIsError(false);
    setCode((prev) => prev + num);
  };

  /* 한 글자 삭제 */
  const handleDelete = () => {
    setIsError(false);
    setCode((prev) => prev.slice(0, -1));
  };

  /** 전체 삭제 */
  const handleClear = () => {
    setIsError(false);
    setCode("");
  };

  /* 완료 버튼 눌렀을 때 서버에 검증 요청 */
  const handleComplete = async () => {
    if (code.length !== 4) {
      setIsError(true);
      return;
    }

    try {
      setIsLoading(true);
      setIsError(false);

      const res = await http.post(`/coupons/${couponId}/redeem`, {
        couponPin: code,
      });

      if (res.data?.isSuccess) {
        onSuccess();
        return;
      }

      // 성공 아니면 무조건 에러
      setIsError(true);
    } catch {
      // 네트워크 에러, 401, 403, 500 전부 동일 처리
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 mt-[60px]">
      {/* 상태 동기화용 input */}
      <input
        ref={inputRef}
        type="tel"
        value={code}
        readOnly
        className="absolute opacity-0 pointer-events-none"
      />

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

        {/* 에러 메시지 */}
        <div className="h-[30px] flex items-center pt-[12px]">
          {isError && (
            <p className="text-primary-01 typo-12-medium text-center">
              <span>
                인증 번호 불일치.
                <br />
                올바른 인증 번호를 입력하십시오.
              </span>
            </p>
          )}
        </div>
      </div>

      {/* 완료 버튼 */}
      <div className="flex justify-end items-center mb-[22px] mt-[88px] w-full">
        <button
          onClick={handleComplete}
          disabled={isLoading}
          className="flex items-center justify-center cursor-pointer gap-[10px] w-[84px] h-[39px] rounded-full border border-primary-01 disabled:opacity-50"
        >
          <span className="typo-16-regular text-primary-01">
            완료
          </span>
        </button>
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
