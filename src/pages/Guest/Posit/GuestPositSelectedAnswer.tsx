import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AnswerCard from "../../../components/Guest/Posit/AnswerCard";
import AppBar from "../../../components/Common/AppBar";
import BottomBar from "../../../components/BottomBar/BottomBar";

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
//시간 나중에 api받을때 바꿔야함

export default function GuestPositSelectedAnswer() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] =
    useState<AnswerType>("answer");

//api 대체 부분
  const answers: Answer[] = [
    {
      id: 1,
      type: "answer",
      title: "배달 음료 얼음이 너무 많이 들어가서 양이 적어요.",
      content: "배달 음료 얼음이 너무 많아요.. 빨리 녹기도 하는 편이고 배달 오는 동안 얼음이 녹아 음료가 싱거워져서 아쉬워요... 배달용은 얼음 양을 조금 줄여도 좋을거 같아요!!",
      cafeName: "테라 커피",
      createdAt: "10월 22일",
      isRead: true,
    },
    {
      id: 2,
      type: "answer",
      title: "매장 안 음악이 조금 커서 대화하기어려워요.",
      content:"음악 볼륨을 조금만 줄이면 좋을거같아요! 대화하는데 약간 방해되는 거같아요ㅠㅠ",
      cafeName: "카페 언필드",
      createdAt: "1일 전",
      isRead: false,
    },
    {
      id: 3,
      type: "answer",
      title: "배달 음료 얼음이 너무 많이 들어가서 양이 적어요.",
      content: "배달 음료 얼음이 너무 많아요.. 빨리 녹기도 하는 편이고 배달 오는 동안 얼음이 녹아 음료가 싱거워져서 아쉬워요... 배달용은 얼음 양을 조금 줄여도 좋을거 같아요!!",
      cafeName: "테라 커피",
      createdAt: "10월 22일",
      isRead: true,
    },
    {
      id: 4,
      type: "answer",
      title: "매장 안 음악이 조금 커서 대화하기어려워요.",
      content:"음악 볼륨을 조금만 줄이면 좋을거같아요! 대화하는데 약간 방해되는 거같아요ㅠㅠ",
      cafeName: "카페 언필드",
      createdAt: "1일 전",
      isRead: false,
    },
    {
      id: 5,
      type: "memo",
      title: "배달 음료 얼음이 너무 많이 들어가서 양이 적어요.",
      content: "배달 음료 얼음이 너무 많아요.. 빨리 녹기도 하는 편이고 배달 오는 동안 얼음이 녹아 음료가 싱거워져서 아쉬워요... 배달용은 얼음 양을 조금 줄여도 좋을거 같아요!!",
      cafeName: "테라 커피",
      createdAt: "10월 22일",
      isRead: true,
    },
    {
      id: 6,
      type: "memo",
      title: "매장 안 음악이 조금 커서 대화하기어려워요.",
      content:"음악 볼륨을 조금만 줄이면 좋을거같아요! 대화하는데 약간 방해되는 거같아요ㅠㅠ",
      cafeName: "카페 언필드",
      createdAt: "1일 전",
      isRead: false,
    },
    {
      id: 7,
      type: "answer",
      title: "배달 음료 얼음이 너무 많이 들어가서 양이 적어요.",
      content: "배달 음료 얼음이 너무 많아요.. 빨리 녹기도 하는 편이고 배달 오는 동안 얼음이 녹아 음료가 싱거워져서 아쉬워요... 배달용은 얼음 양을 조금 줄여도 좋을거 같아요!!",
      cafeName: "테라 커피",
      createdAt: "10월 22일",
      isRead: true,
    },
  ];

  const filteredAnswers = answers.filter(
    (a) => a.type === selectedType
  );

  const counts = {
    answer: answers.filter((a) => a.type === "answer").length,
    memo: answers.filter((a) => a.type === "memo").length,
  };


  return (
    <div className="flex flex-col h-screen">
        <AppBar title="채택 된 답변" layout="left" leftType="left"/>

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
        <div className="flex-1 overflow-y-auto flex flex-col no-scrollbar gap-[44px] pt-[20px] pb-[200px] px-[16px]">
        {filteredAnswers.map((answer) => (
            <AnswerCard
                key={answer.id}
                type={answer.type}
                title={answer.title}
                cafeName={answer.cafeName}
                createdAt={answer.createdAt}
                isRead={answer.isRead}
                onClick={() =>
                    navigate(`/posit/selected/${answer.id}`, {
                    state: answer,
                })
                }
            />
        ))}
        </div>

        <BottomBar active="posit" onChange={() => {}}></BottomBar>
    </div>
  );
}
