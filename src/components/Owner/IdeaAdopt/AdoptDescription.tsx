interface AdoptInfoItem {
  label: string;
  value: string;
}

export default function AdoptDescription() {
  const infoList: AdoptInfoItem[] = [
    { label: "고민제목", value: "가게 조명 관련" },
    { label: "답변자", value: "김하윤" },
    { label: "채택일", value: "2025년 10월 23일" },
    { label: "보상", value: "아메리카노 무료 쿠폰 지급" },
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
