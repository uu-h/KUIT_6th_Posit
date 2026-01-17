type TabKey = "answer" | "memo" | "done";

const TITLE_MAP: Record<TabKey, string> = {
  answer: "고민 답변",
  memo: "자유 메모",
  done: "채택 완료",
};

type IdeaCardProps = {
  type: TabKey;
  contents: string;
  date: string;
};

export default function IdeaCard({
  type,
  contents,
  date,
}: IdeaCardProps) {
  return (
    <div
      className="
        h-[109px]
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
        <span className="typo-12-medium text-neutrals-08">
          {date}
        </span>
      </div>

      {/* 내용 */}
      <p className="typo-15-medium w-[270px]">
       "{contents}"
      </p>
    </div>
  );
}
