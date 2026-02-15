import AppBar from "../../../components/Common/AppBar";
import ConcernDetailHeader from "../../../components/Owner/Home/ConcernDetailHeader";
import AnswerListCard from "../../../components/Owner/Home/AnswerListCard";
import { useParams } from "react-router-dom";
import { useMemo } from "react";
import { timeAgo } from "../../../utils/timeAgo";
import { useConcernDetail } from "../../../hooks/useConcernDetail";

type Answer = {
  id: number | string;
  author: string;
  content: string;
  createdAt: string;
};

export default function OwnerMyConcernDetailPage() {
  const { concernId } = useParams();
  const { data, isLoading, isError, refetch } = useConcernDetail(concernId);

  const title = useMemo(() => {
    return data?.data.concernContent ?? "";
  }, [data]);

  const answers: Answer[] = useMemo(() => {
    const memos = data?.data.memos ?? [];
    return memos.map((m) => ({
      id: m.memoId,
      author: m.writerName,
      content: m.content,
      createdAt: timeAgo(m.createdAt),
    }));
  }, [data]);

  return (
    <div className="min-h-dvh bg-white">
      <AppBar layout="left" leftType="left" />

      <main className="px-[16px] pt-[12px] pb-[24px]">
        {isLoading && <p className="typo-14-regular">불러오는 중...</p>}

        {isError && (
          <div className="py-4">
            <p className="typo-14-regular">상세를 불러오지 못했어요.</p>
            <button
              type="button"
              className="typo-14-semibold"
              onClick={() => refetch()}
            >
              다시 시도
            </button>
          </div>
        )}

        {!isLoading && !isError && (
          <>
            <ConcernDetailHeader concernTitle={title} />
            <AnswerListCard answers={answers} />
          </>
        )}
      </main>
    </div>
  );
}
