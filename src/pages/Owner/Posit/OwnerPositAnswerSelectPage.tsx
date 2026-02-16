import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AppBar from "../../../components/Common/AppBar";
import Button from "../../../components/Button";
import ConcernReadonlyCard from "../../../components/Owner/Posit/ConcernReadonlyCard";
import AdoptModal from "../../../components/Owner/Posit/AdoptModal";
import RejectModal from "../../../components/Owner/Posit/RejectModal";

import { getMemoDetail, getMemoAdoption } from "../../../api/posit";
import type { MemoType } from "../../../types/posit";

export default function OwnerPositAnswerSelectPage() {
  //memoId 받기 
  const { id } = useParams();
  const memoId = Number(id);

  const [memoType, setMemoType] = useState<MemoType | null>(null);
  const [memoDetail, setMemoDetail] = useState<any>(null);
  const [isAdopted, setIsAdopted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState<
    "adopt" | "reject" | null
  >(null);

  useEffect(() => {
    if (!memoId || Number.isNaN(memoId)) return;

    const fetchData = async () => {
      try {
        // 먼저 메모 상세 조회
        const memo = await getMemoDetail(memoId);

        setMemoDetail(memo);
        setMemoType(memo.memoType);

        // status가 ADOPTED일 때만 adoption API 호출
        if (memo.status === "ADOPTED") {
          try {
            await getMemoAdoption(memoId);
            setIsAdopted(true);
          } catch {
            setIsAdopted(false);
          }
        } else {
          setIsAdopted(false);
        }
      } catch (e) {
        console.error("메모 조회 실패", e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [memoId]);

  if (!memoId || Number.isNaN(memoId)) {
    return <div className="p-4">memoId가 전달되지 않았습니다.</div>;
  }

  if (loading) {
    return <div className="p-4">불러오는 중...</div>;
  }

  const headerTitle =
    memoType === "FREE" ? "자유 메모" : "나의 고민거리";

  return (
    <div className="min-h-dvh bg-white flex flex-col">
      {/* 채택 여부에 따라 제목 변경 */}
      <AppBar
        title={isAdopted ? "답변 채택 완료" : "답변 채택"}
        layout="left"
        leftType="left"
      />
      {/* Body */}
      <main className="px-[16px] flex-1">
        <p className="mt-[12px] typo-16-bold text-black">
          {headerTitle}
        </p>

        <div className="mt-[20px]">
          {memoDetail && (
            <ConcernReadonlyCard
              name={memoDetail.writer?.name ?? ""}
              profile={memoDetail.writer?.profile}
              title={memoDetail.title}
              date={memoDetail.createdAt}
              content={memoDetail.content}
              imageUrl={memoDetail.images?.[0]}
            />
          )}
        </div>
      </main>

      {/* 채택 완료면 버튼 숨김 */}
      {!isAdopted && (
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
      )}
      
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
