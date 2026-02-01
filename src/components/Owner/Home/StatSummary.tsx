type StatItem = {
  label: string;
  value: number;
  unit: string;
};

type StatSummaryVariant = "home" | "coupon";

type Props = {
  title: string;
  items: StatItem[];
  variant?: StatSummaryVariant;
};

export default function StatSummary({ title, items, variant = "home" }: Props) {
  const cardClass =
    variant === "home"
      ? "rounded-[10px] bg-corals-000 px-[21px] py-[8px] text-center"
      : "rounded-[10px] bg-white px-[21px] py-[8px] text-center";

  const labelClass =
    variant === "home"
      ? "typo-13-medium text-neutrals-08"
      : "typo-13-medium text-neutrals-08";

  return (
    <section>
      {title ? (
        <h2 className="typo-16-semibold tracking-[-0.2px] text-black">
          {title}
        </h2>
      ) : null}

      <div className={`${title ? "mt-[18px]" : ""} grid grid-cols-3 gap-[6px]`}>
        {items.map((it) => (
          <div key={it.label} className={cardClass}>
            <p className={labelClass}>{it.label}</p>

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
