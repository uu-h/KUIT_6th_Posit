type Props = {
  mode: "CONCERN" | "FREE";
  concernTitle?: string; // CONCERN일 때만 사용
};

export default function AdoptionHeader({ mode, concernTitle }: Props) {
  if (mode === "FREE") {
    return <h2 className="typo-16-bold">자유 답변</h2>;
  }

  return (
    <div>
      <h2 className="typo-16-bold">나의 고민거리</h2>
      {concernTitle ? (
        <p className="mt-[9px] typo-15-medium text-neutrals-08">
          {concernTitle}
        </p>
      ) : null}

      <h3 className="mt-[36px] typo-16-bold">고민 답변</h3>
    </div>
  );
}
