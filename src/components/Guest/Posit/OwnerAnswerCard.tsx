import OwnerProfileIcon from "../../../assets/Owner/Posit/OwnerProfile.svg";

interface OwnerAnswerCardProps {
  content: string;
  createdAt?: string; // 서버에서 주면 표시
}

export default function OwnerAnswerCard({ content, createdAt }: OwnerAnswerCardProps) {
  return (
    <div>
      <div className="flex mt-[40px] gap-[11px] items-start">
        <img src={OwnerProfileIcon} alt="사장님 프로필" />
        <div className="flex">
          <div className="relative p-[22px] bg-corals-000 text-black rounded-lg">
            <div className="flex flex-col gap-[12px]">
              <p className="flex items-center gap-[4px]">
                <span className="typo-headline">사장님</span>
                {createdAt && (
                  <span className="typo-12-regular text-neutrals-07">
                    {createdAt}
                  </span>
                )}
              </p>
              <p className="typo-12-medium text-shades-02">
                {content}
              </p>
            </div>

            {/* 말풍선 꼬리 */}
            <div
              className="absolute top-full left-[10px] w-0 h-0
                border-r-[14px] border-r-transparent
                border-t-[14px] border-t-corals-000
                border-l-0 border-b-0
                -mb-2"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
