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
    <div className="mt-[18px]">
      <div
        className="h-[284px] rounded-[16px]
    bg-white
    shadow-[0_0_5px_rgba(0,0,0,0.25)]
    px-[23px] py-[27px]"
      >
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={maxLength}
          placeholder={placeholder}
          className="min-h-[210px] w-full resize-none text-sm leading-6 text-neutrals-09 placeholder:text-gray-400 focus:outline-none"
        />
        <div className="mt-2 text-right text-xs text-black">
          {value.length}/{maxLength}자
        </div>
      </div>
    </div>
  );
}
