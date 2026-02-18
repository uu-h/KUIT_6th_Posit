import { useState } from "react";
import AppBar from "../../../components/Common/AppBar";
import ConcernTextareaCard from "../../../components/Owner/Posit/ConcernTextareaCard";
import Divider from "../../../components/Owner/Posit/Divider";
import Button from "../../../components/Button";
import SuccessModal from "../../../components/Common/SuccessModal";
import { createOwnerConcern } from "../../../api/ownerConcern";
import { useNavigate } from "react-router-dom";
import InfoLine from "../../../components/Owner/Posit/InfoLine";

import { normalizeApiError, toFieldErrorMap } from "../../../api/apiError";
import { emitToast } from "../../../utils/toastBus";

export default function OwnerPositMyConcernPage() {
  const navigate = useNavigate();

  const [content, setContent] = useState("");

  const [openSuccess, setOpenSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // DTO field 에러 표시용
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const MAX_LEN = 150;

  const isEnabled =
    content.trim().length > 0 &&
    content.trim().length <= MAX_LEN &&
    !submitting;

  const clearFieldError = (key: string) => {
    setFieldErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const handleClickConfirm = async () => {
    if (!isEnabled) return;

    try {
      // 제출 시 이전 field 에러 초기화
      setFieldErrors({});
      setSubmitting(true);

      await createOwnerConcern({
        content: content.trim(),
      });

      setOpenSuccess(true);
    } catch (err: unknown) {
      const n = normalizeApiError(err);

      // 기본은 서버 message
      let msg = n.message ?? "요청 중 오류가 발생했어요.";

      // DTO validation이면 errors[].message를 우선 노출 + field 에러 세팅
      if (n.errorCode === "DTO_VALIDATION_FAILED") {
        setFieldErrors(toFieldErrorMap(n.errors));
        if (n.errors?.length) msg = n.errors[0].message;
      }

      switch (n.errorCode) {
        case "DTO_VALIDATION_FAILED":
          break;

        default:
          emitToast({
            message: msg,
          });
          break;
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleModalConfirm = () => {
    setOpenSuccess(false);
    setContent("");
    navigate(-1);
  };

  return (
    <div className="min-h-dvh w-full px-[16px] bg-white flex flex-col">
      <AppBar title="나의 고민거리" layout="left" leftType="left" />

      <main className="flex-1">
        <ConcernTextareaCard
          value={content}
          onChange={(v) => {
            setContent(v);
            clearFieldError("content");
          }}
          maxLength={MAX_LEN}
        />
        {/* content DTO 에러 표시 */}
        {fieldErrors.content && (
          <p className="mt-1 typo-12-regular text-primary-01">
            {fieldErrors.content}
          </p>
        )}

        <Divider className="mt-[22px]" />
        <InfoLine
          className="mt-[20px]"
          text="고민거리를 상세하게 작성할수록, 더욱 효과적인 게스트의 답변을 받을 수 있어요!"
        />
      </main>

      <div className="pt-[65px] mb-[10px]">
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
