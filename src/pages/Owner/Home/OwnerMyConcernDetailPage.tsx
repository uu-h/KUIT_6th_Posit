import AppBar from "../../../components/Common/AppBar";
import ConcernDetailHeader from "../../../components/Owner/Home/ConcernDetailHeader";
import AnswerListCard from "../../../components/Owner/Home/AnswerListCard";
import { useNavigate, useParams } from "react-router-dom";
import { useMemo } from "react";
import { useConcernDetail } from "../../../hooks/useConcernDetail";

type Answer = {
  id: number | string;
  author: string;
  content: string;
  createdAt: string;
};

export default function OwnerMyConcernDetailPage() {
  const navigate = useNavigate();
  const { concernId } = useParams();
  const { data, isLoading, isError, refetch } =
    useConcernDetail(concernId);

  const title = useMemo(() => {
    return data?.data.concernContent ?? "";
  }, [data]);

  // 18시간 보정 + 상대시간 직접 계산
  const formatRelativeTime = (iso: string) => {
    const d = new Date(iso);

    // 18시간 수동 보정
    d.setHours(d.getHours() + 18);

    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffMin < 1) return "방금 전";
    if (diffMin < 60) return `${diffMin}분 전`;
    if (diffHour < 24) return `${diffHour}시간 전`;
    if (diffDay < 10) return `${diffDay}일 전`;

    return d.toLocaleDateString("ko-KR");
  };

  const answers: Answer[] = useMemo(() => {
    const memos = data?.data.memos ?? [];

    return memos.map((m) => ({
      id: m.memoId,
      author: m.writerName,
      content: m.content,
      createdAt: formatRelativeTime(m.createdAt),
    }));
  }, [data]);

  return (
    <div className="min-h-dvh bg-white">
      <AppBar layout="left" leftType="left" />

      <main className="px-[16px] pt-[12px] pb-[24px]">
        {isLoading && <p className="typo-14-regular">불러오는 중...</p>}

        {isError && (
          <div className="py-4">
            <p className="typo-14-regular">
              상세를 불러오지 못했어요.
            </p>
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

            {answers.length > 0 ? (
              <AnswerListCard
                answers={answers}
                onItemClick={(memoId) => {
                  navigate(
                    `/owner/home/concerns/${concernId}/answer/${memoId}`
                  );
                }}
              />
            ) : (
              <div className="flex flex-col pt-[34px] gap-[8px]">
                <span className="typo-16-bold">받은 답변</span>
                <div
                  className="
                    w-[343px] h-[85px] 
                    rounded-[16px] 
                    flex items-center justify-center 
                    text-neutrals-09 typo-14-regular
                    bg-white
                    shadow-[0px_0px_10px_0px_#D8D8D8]
                    border border-neutrals-03
                  "
                >
                  아직 등록된 답변이 없어요.
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
