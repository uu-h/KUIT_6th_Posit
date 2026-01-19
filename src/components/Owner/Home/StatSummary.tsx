type StatItem = {
  label: string;
  value: number;
  unit: string;
};

type Props = {
  title: string;
  items: StatItem[];
};

export default function StatSummary({ title, items }: Props) {
  return (
    <section>
      <h2 className="typo-16-semibold tracking-[-0.2px] text-black">{title}</h2>

      <div className="mt-[18px] grid grid-cols-3 gap-[6px]">
        {items.map((it) => (
          <div
            key={it.label}
            className="rounded-[10px] bg-corals-000 px-[21px] py-[8px] text-center"
          >
            <p className="typo-13-medium text-neutrals-08">{it.label}</p>
            <p className="mt-[2px] typo-20-medium text-black leading-[120%]">
              {it.value}
              <span className="ml-[2px] text-[13px] font-normal text-black">
                {it.unit}
              </span>
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
