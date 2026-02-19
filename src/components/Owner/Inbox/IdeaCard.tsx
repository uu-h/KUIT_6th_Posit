type TabKey = "ANSWER" | "FREE" | "ADOPTED";

const TITLE_MAP: Record<TabKey, string> = {
  ANSWER: "고민 답변",
  FREE: "자유 메모",
  ADOPTED: "채택 완료",
};

type IdeaCardProps = {
  type: TabKey;
  date: string;
  title: string;
  onClick?: () => void;
};

export default function IdeaCard({
  type,
  title,
  date,
  onClick,
}: IdeaCardProps) {
  return (
    <div
      onClick={onClick}
      className="
        py-[20px] px-[22px] rounded-[16px] border border-neutrals-04
        cursor-pointer transition
        hover:bg-corals-000 hover:border-primary-01
        active:bg-corals-000 active:border-primary-01
        flex flex-col gap-[6px]
      "
    >
      {/* 제목 + 날짜 */}
      <div className="flex justify-between items-center">
        <span className="typo-12-medium text-neutrals-08">
          {TITLE_MAP[type]}
        </span>
        <span className="typo-12-medium text-neutrals-08">{date}</span>
      </div>

      {/* 내용 */}
      <p className="typo-15-medium w-[270px] line-clamp-2">"{title}"</p>
    </div>
  );
}
