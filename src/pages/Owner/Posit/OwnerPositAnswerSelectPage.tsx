import { useState } from "react";
import { useParams } from "react-router-dom";
import AppBar from "../../../components/Common/AppBar";
import Button from "../../../components/Button";
import ConcernReadonlyCard from "../../../components/Owner/Posit/ConcernReadonlyCard";
import AdoptModal from "../../../components/Owner/Posit/AdoptModal";
import RejectModal from "../../../components/Owner/Posit/RejectModal";

//useParams 로 memoId 받기 수정
//type LocationState = {
  //memoId?: number;
//};

export default function OwnerPositAnswerSelectPage() {
  //memoId 받기 
  const { id } = useParams();
  const memoId = Number(id);

  const [openModal, setOpenModal] = useState<
    "adopt" | "reject" | null
  >(null);

  //memoId 받기
  //const location = useLocation();
  //const memoId = (location.state as LocationState)?.memoId;

  if (!memoId) {
    return (
      <div className="p-4">
        memoId가 전달되지 않았습니다.
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-white flex flex-col">
      {/* Header */}
      <AppBar title="답변 채택" layout="left" leftType="left" />

      {/* Body */}
      <main className="px-[16px] flex-1">
        <p className="mt-[12px] typo-16-bold text-black">
          나의 고민거리
        </p>

        <p className="mt-[12px] typo-15-medium text-neutrals-08">
          매장 조명을 조금 더 밝게 바꿔야 할까요?
        </p>

        <div className="mt-[20px] flex justify-between items-center">
          <p className="typo-16-bold text-black">고민 답변</p>
        </div>

        <div className="mt-[20px]">
          <ConcernReadonlyCard
            name="김하윤"
            gender="여성"
            age={21}
            title="노란 조명 대신 따뜻한 화이트 톤 조명 어떨까요?"
            date="2025-10-17 13:00 PM"
            content={`지금 조명이 노란 빛이라 음식 사진이 실제보다 덜 맛있게 나와요 ㅠ 조명 톤을 따뜻한 화이트로 바꾸면 사진도 더 잘 나오고, 공간도 훨씬 깔끔해 보일 것 같아요! 특히 저녁 시간대엔 은은한 조도로 분위기도 살릴 수 있을 것 같아요!`}
          />
        </div>
      </main>

      {/* Bottom Buttons */}
      <div className="px-[16px] pt-[20px] pb-[24px] flex gap-[10px]">
        <Button
          variant="primary"
          onClick={() => setOpenModal("adopt")}
        >
          채택하기
        </Button>
        <Button
          variant="outline"
          onClick={() => setOpenModal("reject")}
        >
          거절하기
        </Button>
      </div>

      {/* Modals */}
      {openModal === "adopt" && (
        <AdoptModal
          memoId={memoId}
          onClose={() => setOpenModal(null)}
        />
      )}

      {openModal === "reject" && (
        <RejectModal
          memoId={memoId}
          onClose={() => setOpenModal(null)}
        />
      )}
    </div>
  );
}
