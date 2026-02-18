interface AnswerCardProps {
    title: string;
    cafeName?: string;
    type: "ANSWER" | "FREE";
    createdAt: string;
    onClick: () => void;
}

export default function SelectedAnswerCard({
    title,
    cafeName,
    type,
    createdAt,
    onClick,
}: AnswerCardProps) {
  return (
    <div
        onClick={onClick}
        className="border border-neutrals-04 
            rounded-[16px] p-[17px] 
            cursor-pointer 
            transition-all duration-200
            hover:bg-corals-000
            hover:border-primary-01
        "
    >
        <div className="flex justify-between">
            <div className="flex flex-col gap-[6px]">
                <p className="typo-12-medium text-neutrals-08">
                    {cafeName} / {type === "ANSWER" ? "고민 답변" : "자유 메모"}
                </p>
                <p className="typo-15-medium w-[233px] line-clamp-2">
                    “{title}”
                </p>
            </div>

            <div className="flex flex-col items-end typo-12-medium text-neutrals-08">
                <span>{createdAt}</span>
            </div>
        </div>
    </div>
  );
}
