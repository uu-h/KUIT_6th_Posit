type MemoTypeSectionProps<T extends string> = {
  label: string;
  types: readonly T[];
  value: T | null;
  onChange: (next: T) => void;
};

export default function MemoTypeSection<T extends string>({
  label,
  types,
  value,
  onChange,
}: MemoTypeSectionProps<T>) {
  return (
    <section className="mt-1">
      <p className="text-[14px] font-Pretendard text-neutrals-07">{label}</p>

      <div className="mt-[17px] -mx-4 pl-4 overflow-x-auto no-scrollbar">
        <div className="flex gap-2 whitespace-nowrap">
          {types.map((t) => {
            const selected = t === value;

            return (
              <button
                key={t}
                type="button"
                onClick={() => onChange(t)}
                className={[
                  "shrink-0 flex h-[40px] px-[18px] py-[10px] whitespace-nowrap justify-center items-center gap-[10px] rounded-full",
                  "text-[12px] font-semibold leading-[150%] tracking-[-0.228px]",
                  selected
                    ? "bg-primary-01 text-white"
                    : "bg-neutrals-02 text-shades-02",
                ].join(" ")}
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
