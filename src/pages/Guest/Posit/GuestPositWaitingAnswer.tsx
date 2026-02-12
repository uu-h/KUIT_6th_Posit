import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AnswerCard from "../../../components/Guest/Posit/AnswerCard";
import AppBar from "../../../components/Common/AppBar";
import BottomBar from "../../../components/BottomBar/BottomBar";
import { http } from "../../../api/http";

// ======================
// 프론트에서 쓸 타입
// ======================
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

// ======================
// 서버 응답 타입 (실제 응답 기준)
// ======================
type ApiCategory = "고민 답변" | "자유 메모";
type ApiStatus = "REVIEWING" | "ADOPTED" | "REJECTED";

interface ApiMemo {
  memoId: number;
  storeName?: string;
  category: ApiCategory;
  content: string;
  status: ApiStatus;
  createdAt: string;
  read: boolean;
}

interface ApiResponse {
  isSuccess: boolean;
  data: {
    memos: ApiMemo[];
    nextCursorId: number | null;
    hasNext: boolean;
  };
}

// ======================
// 컴포넌트
// ======================
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

  const fetchAnswers = async () => {
    try {
      setLoading(true);

      const res = await http.get<ApiResponse>("/memos/me", {
        params: {
          status: "REVIEWING", // 필요하면 바꿔
          size: 20,
        },
      });

      console.log("memos api response:", res.data); // 🔥 디버깅용

      if (res.data.isSuccess && res.data.data?.memos) {
        const fetched: Answer[] = res.data.data.memos.map((memo) => ({
          id: memo.memoId,
          type: memo.category === "자유 메모" ? "memo" : "answer",
          title: memo.content, // 서버에 title 없음
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
    fetchAnswers();
  }, []);

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
                  navigate(`/guest/posit/waiting/${answer.id}`, {
                    state: answer,
                  })
                }
              />
            ))}

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
