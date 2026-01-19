import AppBar from "../../../components/Common/AppBar";
import Button from "../../../components/Button";
import ConcernReadonlyCard from "../../../components/Owner/Posit/ConcernReadonlyCard";



export default function OwnerPositAnswerSelectPage() {

  return (
    <div className="min-h-dvh bg-white flex flex-col">
      {/* Header */}
      <AppBar title="답변 채택" layout="left" leftType="left" />

      {/* Body */}
      <main className="px-[16px] flex-1">
        {/* 나의 고민거리 */}
        <p className="mt-[12px] typo-16-bold text-black">
          나의 고민거리
        </p>

        <p className="mt-[12px] typo-15-mediun text-neutrals-08">
          매장 조명을 조금 더 밝게 바꿔야 할까요?
        </p>

        {/* 고민 답변 헤더 */}
        <div className="mt-[20px] flex justify-between items-center">
          <p className="typo-16-bold text-black">고민 답변</p>
          {/* 추후 필터/정렬 아이콘 자리 */}
        </div>

        {/* 고민 답변 카드 */}
        <div className="mt-[20px]">
        <ConcernReadonlyCard
            name="김하윤"
            gender="여성"
            age={21}
            adoptionRate={25}
            isAdmin
            title="노란 조명 대신 따뜻한 화이트 톤 조명 어떨까요?"
            date="2025-10-17 13:00 PM"
            content={`지금 조명이 노란 빛이라 음식 사진이 실제보다 덜 맛있게 나와요ㅠ 조명 톤을 따뜻한 화이트로 바꾸면 사진도 더 잘 나오고, 공간도 훨씬 깔끔해 보일 것 같아요! 특히 저녁 시간대에는 은은한 조도로 분위기도 살릴 수 있을 것 같아요!`}
        />
</div>
      </main>

      {/* Bottom Buttons */}
      <div className="px-[16px] pt-[20px] pb-[24px] flex gap-[10px]">
        <Button variant="primary">
          채택하기
        </Button>
        <Button variant="outline">
          거절하기
        </Button>
      </div>



    </div>
  );
}
