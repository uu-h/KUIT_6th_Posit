import OwnerProfileIcon from "../../../assets/Owner/Posit/OwnerProfile.svg";

interface OwnerAnswerCardProps {
  content: string;
  createdAt?: string; 
}

export default function OwnerAnswerCard({ content, createdAt }: OwnerAnswerCardProps) {

  const formatRelativeTime = (dateString: string) => {
    const now = new Date();
    const target = new Date(dateString);

    const diffMs = now.getTime() - target.getTime();
    const diffMin = Math.floor(diffMs / (1000 * 60));
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffMin < 1) return "방금 전";
    if (diffMin < 60) return `${diffMin}분 전`;
    if (diffHour < 24) return `${diffHour}시간 전`;
    if (diffDay === 1) return "어제";
    if (diffDay < 7) return `${diffDay}일 전`;
    if (diffDay < 14) return "지난주";
    if (diffDay < 30) return `${Math.floor(diffDay / 7)}주 전`;
    if (diffDay < 365) return `${Math.floor(diffDay / 30)}개월 전`;

    return `${Math.floor(diffDay / 365)}년 전`;
  };

  return (
    <div className="px-[16px]">
      <div className="flex mt-[40px] gap-[11px] items-start">
        <img src={OwnerProfileIcon} alt="사장님 프로필" />
        <div className="flex">
          <div className="relative p-[22px] bg-corals-000 text-black rounded-lg w-[300px]">
            <div className="flex flex-col gap-[12px]">
              <p className="flex items-center gap-[7px]">
                <span className="typo-headline">사장님</span>
                {createdAt && (
                  <span className="typo-12-regular text-neutrals-07">
                    {formatRelativeTime(createdAt)}
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
