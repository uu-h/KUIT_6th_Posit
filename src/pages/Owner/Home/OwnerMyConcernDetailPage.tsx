import AppBar from "../../../components/Common/AppBar";
import ConcernDetailHeader from "../../../components/Owner/Home/ConcernDetailHeader";
import AnswerListCard from "../../../components/Owner/Home/AnswerListCard";
import { useNavigate, useParams } from "react-router-dom";
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
  const navigate = useNavigate();
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
            {/* 제목은 항상 표시 */}
            <ConcernDetailHeader concernTitle={title} />

            {/* 답변 여부에 따라 카드 또는 안내문구 */}
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
                <div className="
                  w-[343px] h-[85px] 
                  rounded-[16px] 
                  flex items-center justify-center 
                  text-neutrals-09 typo-14-regular
                  bg-white
                  shadow-[0px_0px_10px_0px_#D8D8D8]
                  border border-neutrals-03
                ">
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
