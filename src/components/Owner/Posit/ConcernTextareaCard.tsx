type ConcernTextareaCardProps = {
  value: string;
  onChange: (value: string) => void;
  maxLength: number;
  placeholder?: string;
};

export default function ConcernTextareaCard({
  value,
  onChange,
  maxLength,
  placeholder = "내용을 입력해주세요.",
}: ConcernTextareaCardProps) {
  return (
    <div className="mt-[23px]">
      <div className="relative">
        <textarea
          value={value}
          maxLength={maxLength}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={[
            "w-full h-[366px] resize-none",
            "rounded-[16px] bg-corals-000",
            "p-[18px] pb-[42px]",
            "typo-14-regular text-black",
            "placeholder:text-[15px] font-medium leading-[120%] text-neutrals-09",
            "outline-none",
          ].join(" ")}
        />

        {/* 글자 수 카운터 */}
        <span className="pointer-events-none absolute bottom-[14px] right-[18px] typo-14-regular text-neutrals-09">
          {value.length} / {maxLength}
        </span>
      </div>
    </div>
  );
}
