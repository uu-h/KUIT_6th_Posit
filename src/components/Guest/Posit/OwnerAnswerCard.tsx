import OwnerProfileIcon from "../../../assets/Owner/Posit/OwnerProfile.svg"

export default function OwnerAnswerCard() {
  return (
    <div>
        <div className="flex mt-[40px] gap-[11px] items-start">
            <img src={OwnerProfileIcon} alt="사장님 프로필" />
            <div className="flex">
                <div className="relative p-[22px] bg-corals-000 text-black rounded-lg">
                    <div className="flex flex-col gap-[12px]">
                        <p className="flex items-center gap-[4px]">
                            <span className="typo-headline">사장님</span>
                            {/* 사장님 답변에 따른 api로 다르게 구현 */}
                            <span className="typo-12-regular text-neutrals-07">지난 주</span>
                        </p>
                        <p className="typo-12-medium text-shades-02">
                            {/* 사장님 답변에 따른 api로 다르게 구현 */}
                            소중한 의견 감사합니다! 말씀해주신 부분 참고해서 음악 볼륨 조금 더 조절해보겠습니다. 더 편안한 공간이 될 수 있도록 노력할게요 !
                        </p> 
                    </div>
                    <div className="absolute top-full left-[10px] w-0 h-0
                        border-r-[14px] border-r-transparent
                        border-t-[14px] border-t-corals-000
                        border-l-0 border-b-0
                    -mb-2">
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
