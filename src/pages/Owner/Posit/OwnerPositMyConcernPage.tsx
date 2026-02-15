import { useState } from "react";
import AppBar from "../../../components/Common/AppBar";
import ConcernTextareaCard from "../../../components/Owner/Posit/ConcernTextareaCard";
import Divider from "../../../components/Owner/Posit/Divider";
import CouponSection from "../../../components/Owner/Posit/CouponSection";
import Button from "../../../components/Button";
import SuccessModal from "../../../components/Common/SuccessModal";
import { createOwnerConcern } from "../../../api/ownerConcern";
import { useNavigate } from "react-router-dom";

import type { CouponOption } from "../../../components/Owner/Posit/CouponRadioGroup"; // 경로 맞게

export default function OwnerPositMyConcernPage() {
  const navigate = useNavigate();

  const [content, setContent] = useState("");
  const [coupon, setCoupon] = useState<CouponOption | "">("");
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(
    null,
  );

  const [openSuccess, setOpenSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const MAX_LEN = 150;

  const isEnabled =
    content.trim().length > 0 &&
    content.trim().length <= MAX_LEN &&
    coupon !== "" &&
    selectedTemplateId !== null &&
    !submitting;

  const handleClickConfirm = async () => {
    if (!isEnabled || selectedTemplateId === null) return;

    try {
      setSubmitting(true);

      const payload = {
        content: content.trim(),
        templateId: selectedTemplateId,
      };

      const result = await createOwnerConcern(payload);

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
    setContent("");
    setCoupon("");
    setSelectedTemplateId(null);
    navigate(-1);
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

        <CouponSection
          value={coupon}
          onChange={setCoupon}
          onTemplateIdChange={setSelectedTemplateId}
        />
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
