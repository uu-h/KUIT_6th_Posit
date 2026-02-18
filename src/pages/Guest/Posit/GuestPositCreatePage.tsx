import { useMemo, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import MemoTypeSection from "../../../components/Guest/Posit/MemoTypeSection";
import MemoTextArea from "../../../components/Guest/Posit/MemoTextArea";
import PhotoAddCard from "../../../components/Guest/Posit/PhotoAddCard";
import SubmitBar from "../../../components/Guest/Posit/SubmitBar";
import NoticeBanner from "../../../components/Guest/Posit/NoticeBanner";
import TitleInput from "../../../components/Guest/Posit/TitleInput";
import SuccessModal from "../../../components/Common/SuccessModal";
import BottomToast from "../../../components/Guest/Posit/BottomToast";
import ModalHeader from "../../../components/Guest/Posit/ModalHeader";

import { createStoreMemo } from "../../../api/posit";
import type { FreeType } from "../../../types/posit";
import { getPresignedUrlWithKey, uploadToS3 } from "../../../api/image";

import { normalizeApiError, toFieldErrorMap } from "../../../api/apiError";
import { emitToast } from "../../../utils/toastBus";

const MEMO_TYPES = [
  "운영팁",
  "마케팅",
  "메뉴개발",
  "고객관리",
  "트렌드",
] as const;
type MemoTypeKorean = (typeof MEMO_TYPES)[number];

const FREE_TYPE_MAP: Record<MemoTypeKorean, FreeType> = {
  운영팁: "TIP",
  마케팅: "MARKETING",
  메뉴개발: "MENU_DEV",
  고객관리: "CUSTOMER_SERVICE",
  트렌드: "TREND",
};

export default function GuestPositCreatePage() {
  const navigate = useNavigate();
  const { storeId } = useParams();
  const sid = Number(storeId);

  const location = useLocation();
  const storeName = (location.state as { storeName?: string })?.storeName ?? "";

  const [selectedType, setSelectedType] = useState<MemoTypeKorean | null>(null);
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [successOpen, setSuccessOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [createdMemoId, setCreatedMemoId] = useState<number | null>(null);

  // DTO field 에러 표시용
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [toast, setToast] = useState({ open: false, message: "" });
  const MAX_LEN = 150;

  // 페이지 내 로컬 토스트(비활성 버튼 등)용
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
    const typeOk = selectedType !== null;
    const titleOk = title.trim().length > 0;
    const contentOk = content.trim().length > 0 && content.length <= MAX_LEN;
    return typeOk && titleOk && contentOk && !submitting;
  }, [selectedType, title, content, submitting]);

  const handleClose = () => navigate(-1);
  const handleAddPhoto = (file: File) => setImage(file);
  const handleRemovePhoto = () => setImage(null);

  const handleSubmit = async () => {
    if (!canSubmit) return;
    if (!Number.isFinite(sid) || sid <= 0)
      return showToast("storeId가 올바르지 않아요.");

    try {
      // 제출 시 이전 field 에러 초기화
      setFieldErrors({});
      setSubmitting(true);

      let uploadedImageKey: string | null = null;

      // 1) 이미지가 있으면 presigned 받고 S3 PUT 업로드
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

      // 2) memo 등록 (자유메모)
      const payload = {
        memoType: "FREE" as const,
        freeType: FREE_TYPE_MAP[selectedType!],
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
        if (n.errors?.length) msg = n.errors[0].message; // ex) "크기가 0에서 50 사이여야 합니다"
      }

      switch (n.errorCode) {
        case "DTO_VALIDATION_FAILED":
          break;

        case "FREE_TYPE_ESSENTIAL":
          emitToast({ message: msg });
          break;

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

  return (
    <div className="min-h-dvh bg-white overflow-x-hidden">
      <div className="px-4 pt-[49px] pb-40">
        {/* Header */}
        <ModalHeader
          title={
            <>
              사장님께 어떤 이야기를
              <br />
              전하고 싶으신가요?
            </>
          }
          onClose={handleClose}
        />

        {/* 메모 유형 */}
        <MemoTypeSection
          label="메모 유형을 선택해주세요."
          types={MEMO_TYPES}
          value={selectedType}
          onChange={(v) => {
            setSelectedType(v);
            clearFieldError("freeType");
          }}
        />
        {/* (옵션) freeType DTO 에러 표시 (서버가 field를 freeType으로 내려줄 때만) */}
        {fieldErrors.freeType && (
          <p className="mt-1 typo-12-regular text-primary-01">
            {fieldErrors.freeType}
          </p>
        )}

        {/* 제목 */}
        <TitleInput
          value={title}
          onChange={(v) => {
            setTitle(v);
            clearFieldError("title");
          }}
          placeholder="제목을 입력해주세요."
        />
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
          placeholder="여러분의 POSiT을 작성해주세요."
        />
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
          navigate(`/stores/${sid}`, {
            replace: true,
            state: {
              refreshPosit: true,
              memoId: createdMemoId,
              from: "home",
              restore: (location.state as any)?.restore,
            },
          });
        }}
      />

      {/* 하단 안내 배너 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white">
        <div className="flex justify-center px-4 py-3">
          <NoticeBanner storeName={storeName} />
        </div>
      </div>

      {/* 로컬 토스트: 비활성 버튼 안내 등 */}
      <BottomToast open={toast.open} message={toast.message} />
    </div>
  );
}
