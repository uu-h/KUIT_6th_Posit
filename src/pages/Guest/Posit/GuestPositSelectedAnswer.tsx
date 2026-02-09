import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AnswerCard from "../../../components/Guest/Posit/AnswerCard";
import AppBar from "../../../components/Common/AppBar";
import BottomBar from "../../../components/BottomBar/BottomBar";
import { http } from "../../../api/http";

// UI에서 쓸 타입
type AnswerType = "answer" | "memo";

// API 쪽 타입
type ApiCategory = "ANSWER" | "FREE";
type ApiStatus = "REVIEWING" | "ADOPTED" | "REJECTED";

interface ApiMemo {
  memoId: number;
  storeName: string;
  category: ApiCategory;
  content: string;
  status: ApiStatus;
  createdAt: string;
  read: boolean;
}

interface Answer {
  id: number;
  type: AnswerType;
  title: string;
  content: string;
  cafeName?: string;
  createdAt: string;
  isRead: boolean;
}

// 날짜 포맷: "10월 22일"
function formatDate(iso: string) {
  const d = new Date(iso);
  const month = d.getMonth() + 1;
  const day = d.getDate();
  return `${month}월 ${day}일`;
}

export default function GuestPositSelectedAnswer() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<AnswerType>("answer");
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAnswers = async () => {
      try {
        const res = await http.get("/memos/me", {
          params: {
            status: "ADOPTED", 
            size: 20,
            cursorId: 0,
          },
        });

        const data = res.data;

        if (data.isSuccess && data.data.memos) {
          const mapped: Answer[] = data.data.memos.map((memo: ApiMemo) => ({
            id: memo.memoId,
            type: memo.category === "ANSWER" ? "answer" : "memo",
            title: memo.content,
            content: memo.content,
            cafeName: memo.storeName,
            createdAt: formatDate(memo.createdAt),
            isRead: memo.read,
          }));

          setAnswers(mapped);
        }
      } catch (error) {
        console.error("채택된 답변 불러오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnswers();
  }, []);

  const filteredAnswers = answers.filter(
    (a) => a.type === selectedType
  );

  const counts = {
    answer: answers.filter((a) => a.type === "answer").length,
    memo: answers.filter((a) => a.type === "memo").length,
  };

  if (loading) {
    return <div className="p-4">로딩 중...</div>;
  }

  return (
  <div className="flex flex-col h-screen">
    <AppBar title="채택 된 답변" layout="left" leftType="left" />

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

    {/* 카드 리스트 */}
    <div className="flex-1 overflow-y-auto flex flex-col no-scrollbar gap-[8px] pt-[20px] pb-[110px] px-[16px]">
      {loading && (
        <div className="flex justify-center items-center h-full text-neutrals-07">
          로딩 중...
        </div>
      )}

      {!loading && filteredAnswers.length === 0 && (
        <div className="flex justify-center items-center h-full text-neutrals-07">
          아직 채택된 답변이 없어요 🥲
        </div>
      )}

      {!loading &&
        filteredAnswers.length > 0 &&
        filteredAnswers.map((answer) => (
          <AnswerCard
            key={answer.id}
            type={answer.type}
            title={answer.title}
            cafeName={answer.cafeName}
            createdAt={answer.createdAt}
            isRead={answer.isRead}
            onClick={() =>
              navigate(`/guest/posit/selected/${answer.id}`, {
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
