interface Props {
  concernTitle: string;
  writer: string;
  adoptedAt: string;
  reward: string;
}

interface AdoptInfoItem {
  label: string;
  value: string;
}

export default function AdoptDescription({
  concernTitle,
  writer,
  adoptedAt,
  reward,
}: Props) {
  const infoList: AdoptInfoItem[] = [
    { label: "고민제목", value: concernTitle },
    { label: "답변자", value: writer },
    { label: "채택일", value: adoptedAt },
    { label: "보상", value: reward },
  ];

  return (
    <div className="flex flex-col gap-[16px] w-full mt-[63px]">
      {infoList.map((item, index) => (
        <div
          key={item.label}
          className={`
            flex justify-between
            ${index === 0 ? "pt-[20px] border-t border-neutrals-05" : ""}
            ${index === infoList.length - 1 ? "pb-[20px] border-b border-neutrals-05" : ""}
          `}
        >
          <span className="typo-16-regular">{item.label}</span>
          <span className="typo-16-medium">{item.value}</span>
        </div>
      ))}
    </div>
  );
}
