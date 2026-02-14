import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AnswerCard from "../../../components/Guest/Posit/AnswerCard";
import AppBar from "../../../components/Common/AppBar";
import BottomBar from "../../../components/BottomBar/BottomBar";
import { http } from "../../../api/http";

// ======================
// UI에서 쓸 타입
// ======================
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

// ======================
// 서버 응답 타입
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

// ======================
// 날짜 포맷
// ======================
function formatDate(iso: string) {
  const d = new Date(iso);
  const month = d.getMonth() + 1;
  const day = d.getDate();
  return `${month}월 ${day}일`;
}

// ======================
// 컴포넌트
// ======================
export default function GuestPositWaitingAnswer() {
  const navigate = useNavigate();

  const [selectedType, setSelectedType] = useState<AnswerType>("ANSWER");
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [counts, setCounts] = useState<{ ANSWER: number; FREE: number }>({
    ANSWER: 0,
    FREE: 0,
  });

  const fetchAnswers = async (type: AnswerType, onlyCount = false) => {
    try {
      const res = await http.get<ApiResponse>("/memos/me", {
        params: {
          type,    
          status: "REVIEWING",
          size: 20,
        },
      });

      if (res.data.isSuccess && res.data.data?.memos) {
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
      } else {
        setCounts((prev) => ({ ...prev, [type]: 0 }));
        if (!onlyCount) setAnswers([]);
      }
    } catch (err) {
      console.error("API LOAD FAIL", err);
      setCounts((prev) => ({ ...prev, [type]: 0 }));
      if (!onlyCount) setAnswers([]);
    }
  };

  // ======================
  // 최초 마운트: 두 타입 다 미리 불러서 카운트 채우기
  // ======================
  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchAnswers("ANSWER"),        
      fetchAnswers("FREE", true),   
    ]).finally(() => setLoading(false));
  }, []);

  // ======================
  // 토글 클릭
  // ======================
  const handleToggle = async (type: AnswerType) => {
    setSelectedType(type);
    setLoading(true);
    await fetchAnswers(type); // 해당 타입 리스트 다시 로드
    setLoading(false);
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
      <div className="flex-1 overflow-y-auto flex flex-col no-scrollbar gap-[8px] pt-[20px] pb-[110px] px-[16px]">
        {loading && <div className="text-center"></div>}

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
                navigate(`/guest/posit/waiting/${answer.id}`, {
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
