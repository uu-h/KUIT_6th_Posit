import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/Button";
import closeIcon from "../../../assets/Owner/Posit/close.svg";

import circleChecked from "../../../assets/Owner/Posit/checkbox_circle_checked.svg";
import circleUnchecked from "../../../assets/Owner/Posit/checkbox_circle_unchecked.svg";
import squareChecked from "../../../assets/Owner/Posit/checkbox_square_checked.svg";
import squareUnchecked from "../../../assets/Owner/Posit/checkbox_square_unchecked.svg";

import { adoptAnswer } from "../../../api/posit";
import { getOwnerCouponTemplates } from "../../../api/coupon";

type Props = {
  memoId: number;
  onClose: () => void;
};

type CouponTemplate = {
  templateId: number;
  title: string;
  description: string;
  validDays: number;
};

export default function AdoptModal({ memoId, onClose }: Props) {
  const navigate = useNavigate();

  const [coupons, setCoupons] = useState<CouponTemplate[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [sendMessage, setSendMessage] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const data = await getOwnerCouponTemplates();
        setCoupons(data);
      } catch (error) {
        alert("쿠폰 목록을 불러오지 못했어요.");
      } finally {
        setFetching(false);
      }
    };

    fetchCoupons();
  }, []);

  const handleConfirm = async () => {
    if (selected === null) return;

    try {
      setLoading(true);

      await adoptAnswer(memoId, {
        couponTemplateId: coupons[selected].templateId,
        message: sendMessage ? message.trim() : "",
      });

      // 채택 성공 후 이동
      navigate(`/owner/inbox/${memoId}/adopted`);
    } catch (error) {
      alert("채택 처리에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white w-[343px] h-[461px] rounded-[16px] p-[16px] flex flex-col">
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <p className="mt-[8px] ml-[6px] typo-sub-title">
            쿠폰 지급하기
          </p>
          <img
            src={closeIcon}
            onClick={onClose}
            className="w-[15px] cursor-pointer"
            alt="닫기"
          />
        </div>

        {/* 쿠폰 목록 */}
        <div className="mt-[26px] pl-[5px] flex flex-col gap-[16px] overflow-y-auto">
          {fetching ? (
            <p className="typo-14-regular text-neutrals-06">
              불러오는 중...
            </p>
          ) : coupons.length === 0 ? (
            <p className="typo-14-regular text-neutrals-06">
              등록된 쿠폰이 없습니다.
            </p>
          ) : (
            coupons.map((item, idx) => (
              <div
                key={item.templateId}
                className="flex items-center gap-[20px] cursor-pointer"
                onClick={() => setSelected(idx)}
              >
                <img
                  src={
                    selected === idx
                      ? circleChecked
                      : circleUnchecked
                  }
                  className="w-[20px]"
                  alt="선택"
                />
                <p className="typo-15-regular text-neutrals-07">
                  {item.title}
                </p>
              </div>
            ))
          )}
        </div>

        {/* 메시지 체크박스 */}
        <div
          className="mt-[20px] ml-[5px] flex items-center gap-[12px] cursor-pointer"
          onClick={() => {
            setSendMessage((prev) => !prev);
            if (sendMessage) setMessage("");
          }}
        >
          <img
            src={sendMessage ? squareChecked : squareUnchecked}
            className="w-[20px]"
            alt="체크"
          />
          <p className="typo-15-regular text-neutrals-09">
            감사 메시지 보내기
          </p>
        </div>

        {/* 메시지 입력 */}
        <div className="relative mx-auto mt-[18px] w-[293px]">
          <textarea
            className="w-[293px] h-[100px] border rounded-[9px] p-[12px] pb-[28px] disabled:bg-gray-100"
            maxLength={150}
            disabled={!sendMessage}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <p className="absolute bottom-[11px] right-[15px] typo-12-light">
            {message.length}/150자
          </p>
        </div>

        {/* 하단 버튼 */}
        <Button
          variant="primary"
          disabled={
            selected === null || loading || coupons.length === 0
          }
          className="mt-auto"
          onClick={handleConfirm}
        >
          {loading ? "처리 중..." : "확인"}
        </Button>
      </div>
    </div>
  );
}
