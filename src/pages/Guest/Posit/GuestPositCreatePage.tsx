import { useMemo, useEffect, useState } from "react";
import MemoTypeSection from "../../../components/Guest/Posit/MemoTypeSection";
import MemoTextArea from "../../../components/Guest/Posit/MemoTextArea";
import PhotoAddCard from "../../../components/Guest/Posit/PhotoAddCard";
import SubmitBar from "../../../components/Guest/Posit/SubmitBar";
import NoticeBanner from "../../../components/Guest/Posit/NoticeBanner";
import TitleInput from "../../../components/Guest/Posit/TitleInput";
import SuccessModal from "../../../components/Common/SuccessModal";
import BottomToast from "../../../components/Guest/Posit/BottomToast";
import BackTopNavBar from "../../../components/Guest/Posit/BackTopNavBar";
import PageIntro from "../../../components/Guest/Posit/PageIntro";

const MEMO_TYPES = [
  "운영팁",
  "마케팅",
  "메뉴개발",
  "고객관리",
  "트렌드",
] as const;
type MemoType = (typeof MEMO_TYPES)[number];

export default function GuestPositCreatePage() {
  const [selectedType, setSelectedType] = useState<MemoType | null>(null);
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [successOpen, setSuccessOpen] = useState(false);
  const [toast, setToast] = useState<{
    open: boolean;
    message: string;
  }>({
    open: false,
    message: "",
  });
  const MAX_LEN = 150;

  const showToast = (msg: string) => {
    setToast({ open: true, message: msg });

    window.setTimeout(() => {
      setToast({ open: false, message: "" });
    }, 1000);
  };

  const canSubmit = useMemo(() => {
    const typeOk = selectedType !== null;
    const titleOk = title.trim().length > 0;
    const contentOk = content.trim().length > 0 && content.length <= MAX_LEN;

    return typeOk && titleOk && contentOk;
  }, [selectedType, title, content]);

  const handleClose = () => {
    // TODO: 라우팅 연결 (ex: navigate(-1))
    console.log("close");
  };

  const handleAddPhoto = (file: File) => setImage(file);
  const handleRemovePhoto = () => setImage(null);

  const handleSubmit = async () => {
    if (!canSubmit) return;

    // TODO: API 호출 성공 후
    setSuccessOpen(true);
  };

  useEffect(() => {
    if (successOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [successOpen]);

  return (
    <div className="min-h-dvh bg-white overflow-x-hidden">
      <div className="px-4 pt-[49px] pb-40">
        {/* 상단 뒤로가기 바 */}
        <BackTopNavBar onBack={handleClose} />

        {/* 타이틀 */}
        <PageIntro title={"사장님께 어떤 이야기를\n전하고 싶으신가요?"} />

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
          // TODO: 확인 누르면 어디로 갈지 (뒤로가기/리스트로 이동 등)
          // navigate(-1)
        }}
      />

      {/* 하단 안내 배너 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white">
        <div className="flex justify-center px-4 py-3">
          <NoticeBanner
            storeName="카페 레이저아워"
            menu="아이스 아메리카노 한 잔 무료"
          />
        </div>
      </div>

      {/* 토스트 메시지 */}
      <BottomToast open={toast.open} message={toast.message} />
    </div>
  );
}
