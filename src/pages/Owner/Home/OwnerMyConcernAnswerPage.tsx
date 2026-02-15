import { useParams } from "react-router-dom";
import AppBar from "../../../components/Common/AppBar";
import ConcernReadonlyCard from "../../../components/Owner/Posit/ConcernReadonlyCard";

type AnswerDetailMock = {
  name: string;
  gender: string;
  age: number;
  title: string;
  date: string;
  content: string;
  imageUrl?: string;
};

const mockAnswerNoImage: AnswerDetailMock = {
  name: "subinn",
  gender: "여성",
  age: 21,
  title: "노란 조명 대신 따뜻한 화이트 톤 조명 어떨까요?",
  date: "2025-10-17 13:00 PM",
  content: `지금 조명이 노란 빛이라 음식 사진이 실제보다 덜 맛있게 나와요 ㅠ 조명 톤을 따뜻한 화이트로 바꾸면 사진도 더 잘 나오고, 공간도 훨씬 깔끔해 보일 것 같아요! 특히 저녁 시간대엔 은은한 조도로 분위기도 살릴 수 있을 것 같아요!`,
};

const mockAnswerWithImage: AnswerDetailMock = {
  ...mockAnswerNoImage,
  imageUrl: "/img/sample.jpg", // 나중에 API에서 내려주는 URL로 교체
};

export default function OwnerMyConcerAnswerPage() {
  const { memoId } = useParams();

  // 지금은 UI 테스트용으로 이미지 있는 버전/없는 버전 원하는 걸로 선택
  const data = mockAnswerWithImage; // 또는 mockAnswerNoImage
  // const data2 = mockAnswerNoImage;

  return (
    <div className="min-h-dvh bg-white">
      <AppBar layout="left" leftType="left" />

      <main className="px-[16px] pb-[24px]">
        {/*  타이틀 */}
        <h1 className="typo-sub-title">받은 답변</h1>

        <ConcernReadonlyCard {...data} />
      </main>
    </div>
  );
}
