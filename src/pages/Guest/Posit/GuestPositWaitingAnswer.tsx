import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AnswerCard from "../../../components/Guest/Posit/AnswerCard";
import AppBar from "../../../components/Common/AppBar";
import BottomBar from "../../../components/BottomBar/BottomBar";
import { http } from "../../../api/http";

type AnswerType = "ANSWER" | "FREE";

interface Answer {
  id: number;
  type: AnswerType;
  title: string;
  content: string;
  cafeName?: string;
  createdAt: string;
  isRead?: boolean;
}

type ApiCategory = "고민 답변" | "자유 메모";
type ApiStatus = "REVIEWING" | "ADOPTED" | "REJECTED";

interface ApiMemo {
  memoId: number;
  storeName?: string;
  category: ApiCategory;
  content: string;
  status: ApiStatus;
  createdAt: string;
  read?: boolean;
}

interface ApiResponse {
  isSuccess: boolean;
  data: {
    memos: ApiMemo[];
    nextCursorId: number | null;
    hasNext: boolean;
  };
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getMonth() + 1}월 ${d.getDate()}일`;
}

export default function GuestPositWaitingAnswer() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const typeParam = searchParams.get("type") as AnswerType;
  const selectedType: AnswerType =
    typeParam === "FREE" ? "FREE" : "ANSWER";

  const [answers, setAnswers] = useState<Answer[]>([]);
  const [counts, setCounts] = useState<{ ANSWER: number; FREE: number }>({
    ANSWER: 0,
    FREE: 0,
  });
  const [loading, setLoading] = useState(false);

  const fetchAnswers = async (type: AnswerType, onlyCount = false) => {
    const res = await http.get<ApiResponse>("/memos/me", {
      params: {
        type,
        status: "REVIEWING",
        size: 20,
      },
    });

    if (!res.data.isSuccess) return;

    const mapped: Answer[] = res.data.data.memos.map((memo) => ({
      id: memo.memoId,
      type: memo.category === "자유 메모" ? "FREE" : "ANSWER",
      title: memo.content,
      content: memo.content,
      cafeName: memo.storeName,
      createdAt: formatDate(memo.createdAt),
      isRead: true,
    }));

    setCounts((prev) => ({
      ...prev,
      [type]: mapped.length,
    }));

    if (!onlyCount) {
      setAnswers(mapped);
    }
  };

  // 최초 마운트 시 카운트 채우기
  useEffect(() => {
    fetchAnswers("ANSWER", true);
    fetchAnswers("FREE", true);
  }, []);

  // selectedType 바뀔 때마다 리스트 로드
  useEffect(() => {
    setLoading(true);
    fetchAnswers(selectedType)
      .finally(() => setLoading(false));
  }, [selectedType]);

  const handleToggle = (type: AnswerType) => {
    setSearchParams({ type }); // 🔥 URL에 저장
  };

  return (
    <div className="flex flex-col h-screen">
      <AppBar title="대기 중인 답변" layout="left" leftType="left" />

      {/* 토글 */}
      <div className="flex justify-center">
        {(["ANSWER", "FREE"] as AnswerType[]).map((type) => (
          <button
            key={type}
            onClick={() => handleToggle(type)}
            className={`typo-14-medium w-[187.5px] pb-[18px] mt-[27px] h-[40px] ${
              selectedType === type
                ? "border-b-2"
                : "text-neutrals-07 border-b border-neutrals-07"
            }`}
          >
            {type === "ANSWER" ? "고민 답변" : "자유 메모함"} {counts[type]}
          </button>
        ))}
      </div>

      {/* 리스트 */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-[8px] pt-[20px] pb-[110px] px-[16px]">
        {loading && <div className="text-center">로딩중</div>}

        {!loading && answers.length === 0 && (
          <div className="flex justify-center items-center h-full text-neutrals-07">
            <span>비었음</span>
          </div>
        )}

        {!loading &&
          answers.map((answer) => (
            <AnswerCard
              key={answer.id}
              type={answer.type}
              title={answer.title}
              cafeName={answer.cafeName}
              createdAt={answer.createdAt}
              isRead={answer.isRead}
              onClick={() =>
                navigate(`/guest/posit/waiting/${answer.id}`,{
                  state: answer,
                })
              }
            />
          ))}
      </div>

      <BottomBar active="posit" onChange={() => {}} />
    </div>
  );
}
