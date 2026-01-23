import { useState } from "react";
import Button from "../../../components/Button";
import closeIcon from "../../../assets/Owner/Posit/close.svg";

import circleChecked from "../../../assets/Owner/Posit/checkbox_circle_checked.svg";
import circleUnchecked from "../../../assets/Owner/Posit/checkbox_circle_unchecked.svg";
import squareChecked from "../../../assets/Owner/Posit/checkbox_square_checked.svg";
import squareUnchecked from "../../../assets/Owner/Posit/checkbox_square_unchecked.svg";

type Props = {
  onClose: () => void;
};

const reasons = [
  "예산 문제",
  "현실적 제약으로  반영이 어려움",
  "동일하거나 유사한 의견이 이미 반영됨",
  "기타",
];

export default function RejectModal({ onClose }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  const ETC_INDEX = reasons.length - 1;

  const isConfirmDisabled =
    selected === null ||
    (selected === ETC_INDEX && message.trim().length === 0);

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
            className="w-full h-[126px] border rounded-[8px] p-[12px] pb-[28px] resize-none"
            maxLength={150}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={selected !== ETC_INDEX}
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
        >
          확인
        </Button>
      </div>
    </div>
  );
}
