import AppBar from "../../../components/Common/AppBar";
import ConcernDetailHeader from "../../../components/Owner/Home/ConcernDetailHeader";
import AnswerListCard from "../../../components/Owner/Home/AnswerListCard";

type Answer = {
  id: number | string;
  author: string;
  content: string;
  createdAt: string;
};

const mockConcernTitle = "매장 조명을 조금 더 밝게 바꿔야 할까요?";

const mockAnswers: Answer[] = [
  {
    id: 1,
    author: "subin",
    content: "노란 조명 대신 따뜻한 화이트 톤 조명은 어떨까요?",
    createdAt: "1일 전",
  },
  {
    id: 2,
    author: "yeon",
    content:
      "사진 찍으면 음식이 조금 어둡게 나와요.\n조명만 살짝 밝아져도 훨씬 좋을 것 같아요.",
    createdAt: "1일 전",
  },
  {
    id: 3,
    author: "slowturtle",
    content: "지금 조명이 분위기 있어서 저는 오히려 좋아요!",
    createdAt: "2일 전",
  },
  {
    id: 4,
    author: "lattecloud",
    content:
      "저녁엔 지금처럼, 낮엔 조금 더 밝게 시간대별로 조절하는 것도 좋을 것 같아요.",
    createdAt: "3일 전",
  },
];

export default function OwnerMyConcernDetailPage() {
  return (
    <div className="min-h-dvh bg-white">
      <AppBar layout="left" leftType="left" />

      <main className="px-[16px] pt-[12px] pb-[24px]">
        <ConcernDetailHeader concernTitle={mockConcernTitle} />
        <AnswerListCard answers={mockAnswers} />
      </main>
    </div>
  );
}
