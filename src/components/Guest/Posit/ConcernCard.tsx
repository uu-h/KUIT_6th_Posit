type ConcernCardProps = {
  label?: string; // 기본: "사장님의 고민거리"
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
        " w-[343px] h-[86px] rounded-[8px] border border-primary-01 bg-corals-000",
        "px-4 pt-[21px] pb-[18px] mt-[27px]",
        className,
      ].join(" ")}
    >
      <div className="text-sm font-semibold ">{label}</div>
      <div className="mt-[5px] typo-14-regular">{content}</div>
    </div>
  );
}
