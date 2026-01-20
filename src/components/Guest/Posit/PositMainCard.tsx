import RightIcon from "../../../assets/Guest/Posit/RightBlack.svg";

type PositMainCardProps = {
  title: string;
  description: string;
  iconSrc: string;
  onClick?: () => void;
};

export default function PositMainCard({
  title,
  description,
  iconSrc,
  onClick,
}: PositMainCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        w-full h-[236px]
        rounded-[16px]
        bg-white
        shadow-[0px_0px_8px_0px_rgba(0,0,0,0.25)]
        border border-[#F1F1F1]
        px-[30px] py-[34px]
        text-left
        active:bg-corals-000 transition
        hover:bg-corals-000
      "
    >
      {/* 좌: 텍스트 영역 / 우: 아이콘 영역 */}
      <div className="h-full grid grid-cols-[1fr_auto] items-start">
        {/* 텍스트 영역 */}
        <div className="min-w-0">
          {/* 제목 + chevron */}
          <div className="flex items-center gap-[7px]">
            <h2 className="typo-16-bold truncate">{title}</h2>
            <span className="h-[26px] w-[26px] flex items-center justify-center flex-shrink-0">
              <img src={RightIcon} alt="오른쪽 화살표" className="h-[13px]" />
            </span>
          </div>

          {/* 설명: 길어지면 2줄까지만 */}
          <p className="mt-[2px] typo-13-medium text-neutrals-07 line-clamp-2">
            {description}
          </p>
        </div>

        {/* 아이콘 영역: 카드 오른쪽 아래 */}
        <div className="h-full flex items-end justify-end pl-[16px]">
          <img src={iconSrc} alt="" className="h-[91px]" draggable={false} />
        </div>
      </div>
    </button>
  );
}
