import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import SelectedAnswerCard from "../../../components/Guest/Posit/SelectedAnswerCard";
import AppBar from "../../../components/Common/AppBar";
import BottomBar from "../../../components/BottomBar/BottomBar";
import { http } from "../../../api/http";

type AnswerType = "ANSWER" | "FREE";

interface Answer {
  id: number;
  type: AnswerType;
  title: string;
  cafeName?: string;
  createdAt: string;
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
}

interface ApiResponse {
  isSuccess: boolean;
  data: {
    memos: ApiMemo[];
    nextCursorId: number | null;
    hasNext: boolean;
  };
}

// 18시간 보정 적용
function formatDate(iso: string) {
  const d = new Date(iso);

  // 18시간 수동 보정
  d.setHours(d.getHours() + 18);

  return `${d.getMonth() + 1}월 ${d.getDate()}일`;
}

export default function GuestPositSelectedAnswer() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const typeParam = searchParams.get("type") as AnswerType;
  const selectedType: AnswerType = typeParam === "FREE" ? "FREE" : "ANSWER";

  const [answers, setAnswers] = useState<Answer[]>([]);
  const [counts, setCounts] = useState<{ ANSWER: number; FREE: number }>({
    ANSWER: 0,
    FREE: 0,
  });
  const [loading, setLoading] = useState(false);

  const fetchAnswers = async (type: AnswerType, onlyCount = false) => {
    try {
      const res = await http.get<ApiResponse>("/memos/me", {
        params: {
          type,
          status: "ADOPTED",
          size: 30,
        },
      });

      if (!res.data.isSuccess) return;

      const mapped: Answer[] = res.data.data.memos.map((memo) => ({
        id: memo.memoId,
        type: memo.category === "자유 메모" ? "FREE" : "ANSWER",
        title: memo.content,
        cafeName: memo.storeName,
        createdAt: formatDate(memo.createdAt), // 보정 적용
      }));

      setCounts((prev) => ({
        ...prev,
        [type]: mapped.length,
      }));

      if (!onlyCount) {
        setAnswers(mapped);
      }
    } catch (err) {
      console.error(err);
      setCounts((prev) => ({ ...prev, [type]: 0 }));
      if (!onlyCount) setAnswers([]);
    }
  };

  useEffect(() => {
    fetchAnswers("ANSWER", true);
    fetchAnswers("FREE", true);
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchAnswers(selectedType).finally(() => setLoading(false));
  }, [selectedType]);

  const handleToggle = (type: AnswerType) => {
    setSearchParams({ type });
  };

  return (
    <div className="flex flex-col h-screen">
      <AppBar
        title="채택 된 답변"
        layout="left"
        leftType="left"
        onBack={() => navigate("/guest/posit")}
      />

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

      <div className="flex-1 overflow-y-auto no-scrollbar-y flex flex-col gap-[8px] pt-[20px] pb-[110px] px-[16px]">
        {loading && <div className="text-center">로딩중</div>}

        {!loading && answers.length === 0 && (
          <div className="flex justify-center items-center typo-15-medium h-full text-center text-neutrals-09">
            <span>
              아직 보낸 답변이 없어요.
              <br />
              POSiT!으로 사장님께 의견을 전달해보세요!
            </span>
          </div>
        )}

        {!loading &&
          answers.map((answer) => (
            <SelectedAnswerCard
              key={answer.id}
              type={answer.type}
              title={answer.title}
              cafeName={answer.cafeName}
              createdAt={answer.createdAt}
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
