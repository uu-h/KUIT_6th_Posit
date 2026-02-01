import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AppBar from "../../../components/Common/AppBar";
import Button from "../../../components/Button";

/* ---------- 옵션 정의 ---------- */
const AMENITIES = {
  convenience: ["포장 가능", "배달 가능", "예약 가능", "24시간 영업"],
  access: ["주차 가능", "발렛 파킹", "장애인 편의시설"],
  restriction: ["반려동물 동반 가능", "노키즈존"],
  environment: ["와이파이 있음", "단체석 있음", "룸 있음", "흡연실 있음", "야외 좌석"],
};

export default function StoreRegisterAmenities() {
  const navigate = useNavigate();

  const [selected, setSelected] = useState<string[]>([]);

  /* ---------- 토글 ---------- */
  const toggleItem = (item: string) => {
    setSelected((prev) =>
      prev.includes(item)
        ? prev.filter((v) => v !== item)
        : [...prev, item]
    );
  };

  /* ---------- 버튼 활성화 ---------- */
  const isValid = selected.length > 0;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* AppBar */}
      <AppBar
        layout="center"
        leftType="left"
        onBack={() => navigate(-1)}
      />

      {/* Title + Step */}
      <div className="px-6 pt-2 pb-6">
        <div className="flex items-center justify-between">
          <h1 className="typo-sub-title">
            해당 편의시설 및 서비스를
            <br />
            등록해주세요.
          </h1>

          <div className="w-[43px] h-[23px] -mt-6 rounded-full bg-neutrals-02 flex items-center justify-center">
            <span className="typo-14-medium">4</span>
            <span className="typo-14-medium text-neutrals-06">/4</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 space-y-6">
        {/* 이용 편의 */}
        <Section title="이용 편의">
          {AMENITIES.convenience.map((item) => (
            <AmenityButton
              key={item}
              label={item}
              selected={selected.includes(item)}
              onClick={() => toggleItem(item)}
            />
          ))}
        </Section>

        {/* 접근/시설 */}
        <Section title="접근/시설">
          {AMENITIES.access.map((item) => (
            <AmenityButton
              key={item}
              label={item}
              selected={selected.includes(item)}
              onClick={() => toggleItem(item)}
            />
          ))}
        </Section>

        {/* 제한 */}
        <Section title="제한">
          {AMENITIES.restriction.map((item) => (
            <AmenityButton
              key={item}
              label={item}
              selected={selected.includes(item)}
              onClick={() => toggleItem(item)}
            />
          ))}
        </Section>

        {/* 매장 환경 */}
        <Section title="매장 환경">
          {AMENITIES.environment.map((item) => (
            <AmenityButton
              key={item}
              label={item}
              selected={selected.includes(item)}
              onClick={() => toggleItem(item)}
            />
          ))}
        </Section>
      </div>

      {/* Bottom Button */}
      <div className="px-6 py-4">
        <Button
          height="h-[48px]"
          disabled={!isValid}
        >
          완료
        </Button>
      </div>
    </div>
  );
}

/* ---------- 섹션 컴포넌트 ---------- */
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="typo-14-medium mb-3">{title}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

/* ---------- 버튼 컴포넌트 ---------- */
function AmenityButton({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        px-2 h-[43px]
        rounded-[8px]
        typo-14-regular
        border
        transition-colors
        ${
          selected
            ? "bg-primary-01 text-corals-000 border-primary-01"
            : "bg-white text-neutrals-09 border-neutrals-04"
        }
      `}
    >
      {label}
    </button>
  );
}
