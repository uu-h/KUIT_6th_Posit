import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AnswerCard from "../../../components/Guest/Posit/AnswerCard";
import AppBar from "../../../components/Common/AppBar";
import BottomBar from "../../../components/BottomBar/BottomBar";
import { http } from "../../../api/http";

// 서버 쿼리 타입
type ApiType = "ANSWER" | "FREE";
type ApiStatus = "REVIEWING" | "ADOPTED" | "REJECTED";

// 프론트에서 쓸 타입
type AnswerType = "answer" | "memo";

interface Answer {
  id: number;
  type: AnswerType;
  title: string;
  content: string;
  cafeName?: string;
  createdAt: string;
  isRead: boolean;
}

// 서버 응답 타입 (대충 형태 맞춘 것)
interface ApiMemo {
  memoId: number;
  category: "ANSWER" | "FREE";
  title?: string;
  content: string;
  storeName?: string;
  createdAt: string;
  read: boolean;
}

interface ApiResponse {
  isSuccess: boolean;
  data: {
    memos: ApiMemo[];
    meta?: {
      nextCursorId?: number;
      hasNext?: boolean;
    };
  };
}

export default function GuestPositSelectedAnswer() {
  const navigate = useNavigate();

  const [selectedType, setSelectedType] = useState<AnswerType>("answer");
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState<boolean>(false);



  const formatKoreanDate = (iso: string) => {
    const d = new Date(iso);
    const month = d.getMonth() + 1;
    const day = d.getDate();
      return `${month}월 ${day}일`;
};

  const fetchAnswers = async (
    type: ApiType,
    status: ApiStatus,
    size = 10,
    cursorId?: number
  ) => {
    try {
      setLoading(true);

      const params: Record<string, string | number> = {
        type,
        status,
        size,
      };
      if (cursorId) params.cursorId = cursorId;

      const res = await http.get<ApiResponse>("/memos/me", { params });

      if (res.data.isSuccess && res.data.data?.memos) {
        const fetched: Answer[] = res.data.data.memos.map((memo) => ({
          id: memo.memoId,
          type: memo.category === "FREE" ? "memo" : "answer",
          title: memo.title ?? memo.content,
          content: memo.content,
          cafeName: memo.storeName,
          createdAt: memo.createdAt,
          isRead: memo.read,
        }));

        setAnswers(fetched);

      }
    } catch (err) {
      console.error("API LOAD FAIL", err);
      alert("API LOAD FAIL");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedType === "answer") {
      fetchAnswers("ANSWER", "REVIEWING", 10);
    } else {
      fetchAnswers("FREE", "REVIEWING", 10);
    }
  }, [selectedType]);

  const counts = {
    answer: answers.filter((a) => a.type === "answer").length,
    memo: answers.filter((a) => a.type === "memo").length,
  };

  return (
    <div className="flex flex-col h-screen">
      <AppBar title="대기 중인 답변" layout="left" leftType="left" />

      {/* 토글 */}
      <div className="flex justify-center">
        {(["answer", "memo"] as AnswerType[]).map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`typo-14-medium w-[187.5px] pb-[18px] mt-[27px] h-[40px] ${
              selectedType === type
                ? "border-b-2"
                : "text-neutrals-07 border-b border-neutrals-07"
            }`}
          >
            {type === "answer" ? "고민 답변" : "자유 메모함"} {counts[type]}
          </button>
        ))}
      </div>

      {/* 리스트 */}
      <div className="flex-1 overflow-y-auto flex flex-col no-scrollbar gap-[8px] pt-[20px] pb-[110px] px-[16px]">
        {loading && <div className="text-center">로딩 중...</div>}

        {!loading &&
          answers
            .filter((a) => a.type === selectedType)
            .map((answer) => (
              <AnswerCard
                key={answer.id}
                type={answer.type}
                title={answer.title}
                cafeName={answer.cafeName}
                createdAt={formatKoreanDate(answer.createdAt)}
                isRead={answer.isRead}
                onClick={() =>
                  navigate(`/guest/posit/selected/${answer.id}`, {
                    state: answer,
                  })
                }
              />
            ))}
        {/* 이부분은 확인용임! 지워야함 */}
        {!loading && answers.length === 0 && (
          <div className="text-center mt-[300px] text-neutrals-07">
            아직 대기중인 답변이 없어요 🥲
          </div>
        )}
      </div>

      <BottomBar active="posit" onChange={() => {}} />
    </div>
  );
}
