import { useState } from "react";
import AppBar from "../../../components/Common/AppBar";
import ConcernTextareaCard from "../../../components/Owner/Posit/ConcernTextareaCard";
import Divider from "../../../components/Owner/Posit/Divider";
import CouponSection from "../../../components/Owner/Posit/CouponSection";
import Button from "../../../components/Button";
import SuccessModal from "../../../components/Common/SuccessModal";
import { createOwnerConcern } from "../../../api/ownerConcern";

type CouponOption = "americano" | "dessert" | "icetea";

// templateId 매핑
const COUPON_TO_TEMPLATE_ID: Record<CouponOption, number> = {
  americano: 1,
  dessert: 2,
  icetea: 3,
};

export default function OwnerPositMyConcernPage() {
  const [content, setContent] = useState("");
  const [coupon, setCoupon] = useState<CouponOption | "">("");
  const [openSuccess, setOpenSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const MAX_LEN = 150;

  const isEnabled =
    content.trim().length > 0 &&
    content.trim().length <= MAX_LEN &&
    coupon !== "" &&
    !submitting;

  const handleClickConfirm = async () => {
    if (!isEnabled) return;

    try {
      setSubmitting(true);

      const templateId = COUPON_TO_TEMPLATE_ID[coupon as CouponOption];
      const payload = {
        content: content.trim(),
        templateId,
      };

      const result = await createOwnerConcern(payload);

      // 응답 형식이 항상 isSuccess를 준다고 했으니 체크
      if (!result.isSuccess) {
        throw new Error("고민 등록에 실패했어요.");
      }

      setOpenSuccess(true);
    } catch (e) {
      alert(e instanceof Error ? e.message : "요청 중 오류가 발생했어요.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleModalConfirm = () => {
    setOpenSuccess(false);

    // 원하면 성공 후 입력 초기화
    setContent("");
    setCoupon("");

    // 또는 등록 완료 후 다른 페이지로 이동이 필요하면 여기서 navigate 처리
  };

  return (
    <div className="min-h-dvh w-full px-[16px] bg-white flex flex-col">
      <AppBar title="나의 고민거리" layout="left" leftType="left" />

      <main className="flex-1">
        <ConcernTextareaCard
          value={content}
          onChange={setContent}
          maxLength={MAX_LEN}
        />

        <Divider className="mt-[22px]" />

        <CouponSection value={coupon} onChange={setCoupon} />
      </main>

      <div className="pt-[65px]">
        <Button
          disabled={!isEnabled}
          onClick={handleClickConfirm}
          height="h-[43px]"
        >
          {submitting ? "업로드 중..." : "확인"}
        </Button>
      </div>

      <SuccessModal
        open={openSuccess}
        onConfirm={handleModalConfirm}
        description={`고민거리가 업로드 되었어요!\n채택될 경우 알려드릴게요.`}
      />
    </div>
  );
}
