import { useMemo, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import ModalHeader from "../../../components/Guest/Posit/ModalHeader";
import MemoTextArea from "../../../components/Guest/Posit/MemoTextArea";
import PhotoAddCard from "../../../components/Guest/Posit/PhotoAddCard";
import SubmitBar from "../../../components/Guest/Posit/SubmitBar";
import NoticeBanner from "../../../components/Guest/Posit/NoticeBanner";
import SuccessModal from "../../../components/Common/SuccessModal";
import TitleInput from "../../../components/Guest/Posit/TitleInput";
import ConcernCard from "../../../components/Guest/Posit/ConcernCard";
import BottomToast from "../../../components/Guest/Posit/BottomToast";

import { createStoreMemo } from "../../../api/posit";
import { getPresignedUrlWithKey, uploadToS3 } from "../../../api/image";

import { normalizeApiError, toFieldErrorMap } from "../../../api/apiError";
import { emitToast } from "../../../utils/toastBus";

type LocationState = {
  storeName?: string;
  restore?: unknown;

  concern?: {
    id: number | string;
    title: string;
    content: string;
  };
};

export default function GuestPositOwnerConcernPage() {
  const navigate = useNavigate();
  const { storeId, concernId } = useParams();
  const sid = Number(storeId);
  const cid = Number(concernId);

  const location = useLocation();
  const state = location.state as LocationState | null;

  const storeName = state?.storeName ?? "";
  const concern = state?.concern;

  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [successOpen, setSuccessOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [createdMemoId, setCreatedMemoId] = useState<number | null>(null);

  // DTO field 에러 표시용
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [toast, setToast] = useState<{ open: boolean; message: string }>({
    open: false,
    message: "",
  });

  const MAX_LEN = 150;

  // 페이지 내 로컬 토스트(비활성 버튼/파라미터 사전검증 등)용
  const showToast = (msg: string) => {
    setToast({ open: true, message: msg });
    window.setTimeout(() => setToast({ open: false, message: "" }), 1000);
  };

  const clearFieldError = (key: string) => {
    setFieldErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const canSubmit = useMemo(() => {
    const titleOk = title.trim().length > 0;
    const contentOk = content.trim().length > 0 && content.length <= MAX_LEN;
    return titleOk && contentOk && !submitting;
  }, [title, content, submitting]);

  const handleClose = () => navigate(-1);

  const handleAddPhoto = (file: File) => setImage(file);
  const handleRemovePhoto = () => setImage(null);

  const handleSubmit = async () => {
    if (!canSubmit) return;

    if (!Number.isFinite(sid) || sid <= 0)
      return showToast("storeId가 올바르지 않아요.");
    if (!Number.isFinite(cid) || cid <= 0)
      return showToast("concernId가 올바르지 않아요.");

    try {
      // 제출 시 이전 field 에러 초기화
      setFieldErrors({});
      setSubmitting(true);

      let uploadedImageKey: string | null = null;

      // 1) 이미지 업로드
      if (image) {
        const { uploadUrl, imageKey } = await getPresignedUrlWithKey({
          purpose: "MEMO_IMAGE",
          files: [
            {
              fileName: image.name,
              contentType: image.type,
              contentLength: image.size,
            },
          ],
        });

        await uploadToS3(uploadUrl, image);
        uploadedImageKey = imageKey;
      }

      // 2) memo 등록 (ANSWER)
      const payload = {
        memoType: "ANSWER" as const,
        concernId: cid,
        title: title.trim(),
        content: content.trim(),
        images: uploadedImageKey
          ? [{ imageKey: uploadedImageKey, order: 0 }]
          : [],
      };

      const result = await createStoreMemo(sid, payload);

      setCreatedMemoId(result.memoId);
      setSuccessOpen(true);
    } catch (err: unknown) {
      const n = normalizeApiError(err);

      // 기본은 서버 message
      let msg = n.message ?? "등록 중 오류가 발생했어요.";

      // DTO validation이면 errors[].message를 우선 노출 + field 에러 세팅
      if (n.errorCode === "DTO_VALIDATION_FAILED") {
        setFieldErrors(toFieldErrorMap(n.errors));
        if (n.errors?.length) msg = n.errors[0].message;
      }

      switch (n.errorCode) {
        case "DTO_VALIDATION_FAILED":
          break;

        case "CONCERN_NOT_FOUND":
        case "CONCERN_STORE_MISMATCH":
        case "STORE_NOT_FOUND":
          emitToast({ message: msg });
          navigate("/guest/home");
          break;

        default:
          emitToast({ message: msg });
          break;
      }
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    document.body.style.overflow = successOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [successOpen]);

  // state 없이 직접 URL로 들어온 경우
  if (!concern) {
    return (
      <div className="min-h-dvh bg-white overflow-x-hidden">
        <div className="px-4 pt-[49px]">
          <ModalHeader title="사장님 고민 POSiT! 하기" onClose={handleClose} />
          <p className="typo-14-regular mt-4">고민 정보를 불러올 수 없어요.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-white overflow-x-hidden">
      <div className="px-4 pt-[49px] pb-40">
        {/* Header */}
        <ModalHeader title="사장님 고민 POSiT! 하기" onClose={handleClose} />

        {/* 사장님 고민 카드 */}
        <ConcernCard content={concern.content} />

        {/* 제목 */}
        <TitleInput
          value={title}
          onChange={(v) => {
            setTitle(v);
            clearFieldError("title");
          }}
          placeholder="제목을 입력해주세요."
        />
        {/* title DTO 에러 표시 */}
        {fieldErrors.title && (
          <p className="mt-1 typo-12-regular text-primary-01">
            {fieldErrors.title}
          </p>
        )}

        {/* 입력 박스 */}
        <MemoTextArea
          value={content}
          onChange={(v) => {
            setContent(v);
            clearFieldError("content");
          }}
          maxLength={MAX_LEN}
          placeholder="사장님 고민에 대한 POSiT을 작성해주세요."
        />
        {/* content DTO 에러도 내려오면 표시(옵션이지만 같이 넣어둠) */}
        {fieldErrors.content && (
          <p className="mt-1 typo-12-regular text-primary-01">
            {fieldErrors.content}
          </p>
        )}

        {/* 사진 추가 */}
        <div className="mt-4">
          <PhotoAddCard
            image={image}
            onAdd={handleAddPhoto}
            onRemove={handleRemovePhoto}
          />
        </div>

        {/* 보내기 버튼 */}
        <SubmitBar
          isEnabled={canSubmit}
          onSubmit={handleSubmit}
          onDisabledClick={() => showToast("모든 항목을 입력해주세요!")}
        />
      </div>

      <SuccessModal
        open={successOpen}
        onConfirm={() => {
          setSuccessOpen(false);
          // 가게 상세로 이동 + state 전달
          navigate(`/stores/${sid}`, {
            replace: true,
            state: {
              refreshPosit: true,
              memoId: createdMemoId,
              from: "home",
              restore: state?.restore,
            },
          });
        }}
      />

      {/* 하단 안내 배너 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white">
        <div className="flex justify-center px-4 py-3">
          <NoticeBanner storeName={storeName} variant="concernReply" />
        </div>
      </div>

      {/* 토스트 메시지 (로컬) */}
      <BottomToast open={toast.open} message={toast.message} />
    </div>
  );
}
