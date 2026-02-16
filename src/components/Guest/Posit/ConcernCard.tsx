type ConcernCardProps = {
  label?: string;
  content: string;
  className?: string;
};

export default function ConcernCard({
  label = "사장님의 고민거리",
  content,
  className = "",
}: ConcernCardProps) {
  return (
    <div
      className={[
        "min-h-[50px] rounded-[8px] border border-primary-01 bg-corals-000",
        "p-[18px] mt-[27px]",
        className,
      ].join(" ")}
    >
      <div className="typo-16-semibold">{label}</div>
      <div className="mt-[5px] typo-14-regular whitespace-pre-wrap break-words max-h-[140px] overflow-auto">
        {content}
      </div>
    </div>
  );
}
