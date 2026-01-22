interface AnswerContentCardProps {
  content: string;
  title: string;
  createdAt: string;
}

export default function AnswerContentCard({
    title,
    content,
    createdAt,
}: AnswerContentCardProps) {
  return (
    <div className="flex flex-col mt-[12px] p-[16px] gap-[8px] rounded-[8px] shadow-[0_0_8px_0_rgba(0,0,0,0.25)]">
        <div className="flex flex-col gap-[3px] border-b-1 border-neutrals-05 pb-[3px]">
            <span className="typo-16-semibold">{title}</span>
            {/* 시간을 api에 따라 바꿔야할듯... */}
            <span className="typo-12-semibold text-neutrals-07">{createdAt}</span>
        </div>
        <p className="typo-14-regular text-neutrals-09">{content}</p>
    </div>
  );
}
