import { useMemo, useEffect, useState } from "react";
import MemoTypeSection from "../../../components/Guest/Posit/MemoTypeSection";
import MemoTextArea from "../../../components/Guest/Posit/MemoTextArea";
import PhotoAddCard from "../../../components/Guest/Posit/PhotoAddCard";
import SubmitBar from "../../../components/Guest/Posit/SubmitBar";
import NoticeBanner from "../../../components/Guest/Posit/NoticeBanner";
import TitleInput from "../../../components/Guest/Posit/TitleInput";
import SuccessModal from "../../../components/Common/SuccessModal";
import BottomToast from "../../../components/Guest/Posit/BottomToast";
import ModalHeader from "../../../components/Guest/Posit/ModalHeader";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { createStoreMemo } from "../../../api/posit";
import type { FreeType } from "../../../types/posit";
import { getPresignedUrlWithKey, uploadToS3 } from "../../../api/image";

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

  const [toast, setToast] = useState({ open: false, message: "" });
  const MAX_LEN = 150;

  const showToast = (msg: string) => {
    setToast({ open: true, message: msg });
    window.setTimeout(() => setToast({ open: false, message: "" }), 1000);
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
    if (!Number.isFinite(sid)) return showToast("storeId가 올바르지 않아요.");

    try {
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

      await createStoreMemo(sid, payload);
      setSuccessOpen(true);
    } catch (e: unknown) {
      if (e instanceof Error) showToast(e.message);
      else showToast("등록 중 오류가 발생했어요.");
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
          onChange={setSelectedType}
        />

        {/* 제목 */}
        <TitleInput
          value={title}
          onChange={setTitle}
          placeholder="제목을 입력해주세요."
        />

        {/* 입력 박스 */}
        <MemoTextArea
          value={content}
          onChange={setContent}
          maxLength={MAX_LEN}
          placeholder="여러분의 POSiT을 작성해주세요."
        />

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
          // TODO: 확인 누르면 어디로 갈지 (일단은 가게 상세로 구현)
          navigate(`/stores/${sid}`);
        }}
      />

      {/* 하단 안내 배너 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white">
        <div className="flex justify-center px-4 py-3">
          <NoticeBanner storeName={storeName} />
        </div>
      </div>

      {/* 토스트 메시지 */}
      <BottomToast open={toast.open} message={toast.message} />
    </div>
  );
}
