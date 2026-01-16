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
    <section className="mt-8">
      <div className="flex items-center">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full typo-16-semibold placeholder:text-black focus:outline-none"
        />
      </div>
    </section>
  );
}
