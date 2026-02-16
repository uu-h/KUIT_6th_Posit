import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AppBar from "../../../components/Common/AppBar";
import ConcernReadonlyCard from "../../../components/Owner/Posit/ConcernReadonlyCard";

import { getMemoDetail } from "../../../api/posit";

export default function OwnerMyConcerAnswerPage() {
  // URL: /owner/home/concerns/:concernId/answer/:memoId
  const { memoId } = useParams();
  const id = Number(memoId);

  const [memoDetail, setMemoDetail] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 이미지 처리
  const S3_BASE = "https://posit-deploy.s3.ap-northeast-2.amazonaws.com/";

  const imageUrl = memoDetail?.images?.[0]
    ? `${S3_BASE}${memoDetail.images[0]}`
    : undefined;

  useEffect(() => {
    if (!id || Number.isNaN(id)) return;

    const fetchMemo = async () => {
      try {
        const memo = await getMemoDetail(id);
        setMemoDetail(memo);
      } catch (e) {
        console.error("메모 상세 조회 실패", e);
      } finally {
        setLoading(false);
      }
    };

    fetchMemo();
  }, [id]);

  if (!id || Number.isNaN(id)) {
    return <div className="p-4">memoId가 전달되지 않았습니다.</div>;
  }

  if (loading) {
    return <div className="p-4">불러오는 중...</div>;
  }

  return (
    <div className="min-h-dvh bg-white">
      <AppBar layout="left" leftType="left" />

      <main className="px-[16px] pb-[24px]">
        <h1 className="typo-sub-title">받은 답변</h1>

        {memoDetail && (
          <ConcernReadonlyCard
            name={memoDetail.writer?.name ?? ""}
            profile={memoDetail.writer?.profile}
            title={memoDetail.title}
            date={memoDetail.createdAt}
            content={memoDetail.content}
            imageUrl={imageUrl}
          />
        )}
      </main>
    </div>
  );
}
