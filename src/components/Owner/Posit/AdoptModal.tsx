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

const coupons = [
  "아이스 아메리카노 1잔 무료",
  "디저트 20% 할인 쿠폰",
  "아이스티 1잔 무료",
];

export default function AdoptModal({ onClose }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const [sendMessage, setSendMessage] = useState(false);
  const [message, setMessage] = useState("");

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white w-[343px] h-[461px] rounded-[16px] p-[16px] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center">
          <p className="mt-[8px] ml-[6px] typo-sub-title">쿠폰 지급하기</p>
          <img
            src={closeIcon}
            onClick={onClose}
            className="w-[15px] cursor-pointer"
          />
        </div>

        {/* Coupon list */}
        <div className="mt-[26px] pl-[5px] flex flex-col gap-[16px]">
          {coupons.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-[20px] cursor-pointer"
              onClick={() => setSelected(idx)}
            >
              <img
                src={selected === idx ? circleChecked : circleUnchecked}
                className="w-[20px]"
              />
              <p className="typo-15-regular text-neutrals-07">{item}</p>
            </div>
          ))}
        </div>

        {/* Send message checkbox */}
        <div
          className="mt-[35px] ml-[5px] flex items-center gap-[12px] cursor-pointer"
          onClick={() => {
            setSendMessage((prev) => !prev);
            if (sendMessage) setMessage(""); // 체크 해제 시 메시지 초기화
          }}
        >
          <img
            src={sendMessage ? squareChecked : squareUnchecked}
            className="w-[20px]"
          />
          <p className="typo-15-regular text-neutrals-09">
            감사 메시지 보내기
          </p>
        </div>

        {/* Message */}
        <div className="relative mx-auto mt-[18px] w-[293px]">
        <textarea
            className="w-[293px] h-[126px] border rounded-[9px] p-[12px] pb-[28px]"
            maxLength={150}
            disabled={!sendMessage}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
        />

        <p className="absolute bottom-[11px] right-[15px] typo-12-light ">
            {message.length}/150자
        </p>
        </div>


        {/* Bottom Button */}
        <Button
          variant="primary"
          disabled={selected === null}
          className="mt-[16px]"
        >
          확인
        </Button>
      </div>
    </div>
  );
}
