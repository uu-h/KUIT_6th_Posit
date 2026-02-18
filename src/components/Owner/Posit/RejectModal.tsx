import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/Button";
import closeIcon from "../../../assets/Owner/Posit/close.svg";

import circleChecked from "../../../assets/Owner/Posit/checkbox_circle_checked.svg";
import circleUnchecked from "../../../assets/Owner/Posit/checkbox_circle_unchecked.svg";
import squareChecked from "../../../assets/Owner/Posit/checkbox_square_checked.svg";
import squareUnchecked from "../../../assets/Owner/Posit/checkbox_square_unchecked.svg";

import { rejectAnswer } from "../../../api/posit";
import type { RejectCode } from "../../../api/posit";
import { normalizeApiError } from "../../../api/apiError";
import { emitToast } from "../../../utils/toastBus";

type Props = {
  memoId: number;
  onClose: () => void;
};

const reasons = [
  "예산 문제",
  "현실적 제약으로 반영이 어려움",
  "동일하거나 유사한 의견이 이미 반영됨",
  "기타",
];

const rejectCodeMap: RejectCode[] = ["BUDGET", "REALISTIC", "ALREADY", "ECT"];

export default function RejectModal({ memoId, onClose }: Props) {
  const navigate = useNavigate();

  const [selected, setSelected] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const ETC_INDEX = reasons.length - 1;

  const isConfirmDisabled =
    selected === null ||
    (selected === ETC_INDEX && message.trim().length === 0) ||
    isLoading;

  const handleConfirm = async () => {
    if (selected === null) return;

    try {
      setIsLoading(true);

      await rejectAnswer(memoId, {
        rejectCode: rejectCodeMap[selected],
        message: message.trim(),
      });

      // 거절 성공 후 inbox로 이동
      navigate("/owner/inbox");
    } catch (error) {
      const e = normalizeApiError(error);
      const msg = e.message ?? "답변 거절에 실패했습니다.";

      // 409: 이미 처리됨 -> inbox로
      if (e.errorCode === "MEMO_DECISION_DUPLICATE") {
        emitToast({ message: msg });
        onClose();
        navigate("/owner/inbox");
        return;
      }

      // 403 / 404: 접근 불가 -> inbox로
      if (
        e.errorCode === "MEMO_STORE_FORBIDDEN" ||
        e.errorCode === "STORE_NOT_FOUND"
      ) {
        emitToast({ message: msg });
        onClose();
        navigate("/owner/inbox");
        return;
      }

      // 기본: 서버 message 그대로
      emitToast({ message: msg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white w-[343px] h-[461px] rounded-[12px] p-[16px]">
        {/* Header */}
        <div className="flex justify-between items-center">
          <p className="typo-sub-title mt-[8px] ml-[6px]">
            거절 사유를 선택해주세요.
          </p>
          <img
            src={closeIcon}
            onClick={onClose}
            className="w-[15px] cursor-pointer"
            alt="닫기"
          />
        </div>

        {/* Reason list */}
        <div className="mt-[26px] pl-[5px] flex flex-col gap-[16px]">
          {reasons.map((item, idx) => (
            <div
              key={idx}
              className={`
                flex items-center gap-[10px] cursor-pointer
                ${idx === ETC_INDEX ? "mt-[18px]" : ""}
              `}
              onClick={() => {
                setSelected(idx);
                if (idx !== ETC_INDEX) setMessage("");
              }}
            >
              <img
                src={
                  idx === ETC_INDEX
                    ? selected === idx
                      ? squareChecked
                      : squareUnchecked
                    : selected === idx
                      ? circleChecked
                      : circleUnchecked
                }
                className="w-[20px]"
                alt="선택 아이콘"
              />
              <p className="typo-15-regular text-neutrals-07">{item}</p>
            </div>
          ))}
        </div>

        {/* Message (기타 선택 시에만 활성화) */}
        <div className="relative mx-auto mt-[17px] w-[293px]">
          <textarea
            className="w-full h-[126px] border rounded-[8px] p-[12px] pb-[28px] resize-none disabled:bg-gray-100"
            maxLength={150}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={selected !== ETC_INDEX}
            placeholder={
              selected === ETC_INDEX ? "거절 사유를 입력해주세요." : ""
            }
          />
          <p className="absolute bottom-[11px] right-[15px] typo-12-light">
            {message.length}/150자
          </p>
        </div>

        {/* Confirm Button */}
        <Button
          variant="primary"
          disabled={isConfirmDisabled}
          className="mt-[16px]"
          onClick={handleConfirm}
        >
          {isLoading ? "처리 중..." : "확인"}
        </Button>
      </div>
    </div>
  );
}
