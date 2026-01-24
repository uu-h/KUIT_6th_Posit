type TitleInputProps = {
  label?: string;
  value: string;
  onChange: (next: string) => void;
  maxLength?: number;
  placeholder?: string;
};

export default function TitleInput({
  value,
  onChange,
  placeholder,
}: TitleInputProps) {
  return (
    <section className="mt-[45px]">
      <div
        className="flex items-center h-[41px] rounded-[8px]
    bg-white
    shadow-[0_0_5px_rgba(0,0,0,0.25)]
    px-[16px] py-[12px]"
      >
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full typo-13-medium placeholder:typo-14-regular placeholder:text-neutrals-08 focus:outline-none"
        />
      </div>
    </section>
  );
}
