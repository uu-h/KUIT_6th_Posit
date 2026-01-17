type ConcernTextareaCardProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export default function ConcernTextareaCard({
  value,
  onChange,
  placeholder = "내용을 입력해주세요.",
}: ConcernTextareaCardProps) {
  return (
    <div className="mt-[23px]">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={[
          "w-full h-[366px] resize-none",
          "rounded-[16px] bg-corals-000",
          "p-[18px]",
          "text-[15px] leading-[120%] font-medium text-black",
          "placeholder:text-neutrals-09",
          "outline-none",
        ].join(" ")}
      />
    </div>
  );
}
