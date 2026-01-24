type MemoTextAreaProps = {
  value: string;
  onChange: (next: string) => void;
  maxLength: number;
  placeholder?: string;
};

export default function MemoTextArea({
  value,
  onChange,
  maxLength,
  placeholder,
}: MemoTextAreaProps) {
  return (
    <div className="mt-[15px]">
      <div
        className="h-[259px] rounded-[8px]
    bg-white
    shadow-[0_0_5px_rgba(0,0,0,0.25)]
    px-[16px] py-[12px]"
      >
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={maxLength}
          placeholder={placeholder}
          className="min-h-[210px] w-full resize-none typo-14-regular text-black placeholder:text-neutrals-08 focus:outline-none"
        />
        <div className="mt-2 text-right typo-12-light ">
          {value.length}/{maxLength}자
        </div>
      </div>
    </div>
  );
}
