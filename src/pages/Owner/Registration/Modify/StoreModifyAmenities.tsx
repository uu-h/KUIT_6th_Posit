import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { http } from "../../../../api/http";
import { getStoreDetail, updateStoreConvinces } from "../../../../api/modify";
import AppBar from "../../../../components/Common/AppBar";
import Button from "../../../../components/Button";

/* ---------- 편의시설 매핑 ---------- */
const convenienceMap: Record<string, string> = {
  "포장 가능": "TAKEOUT",
  "배달 가능": "DELIVERY",
  "예약 가능": "RESERVATION",
  "간편결제": "EASY_PAY",
  "24시간 영업": "OPEN_24H",
  "주차 가능": "PARKING",
  "발렛 파킹": "VALET_PARKING",
  "장애인 편의시설": "ACCESSIBLE",
  "반려동물 동반 가능": "PET_FRIENDLY",
  "노키즈존": "NO_KIDS",
  "와이파이 있음": "WIFI",
  "단체석 있음": "GROUP_SEAT",
  "룸 있음": "PRIVATE_ROOM",
  "흡연실 있음": "SMOKING_ROOM",
  "야외 좌석": "OUTDOOR_SEAT",
};

/* ---------- 옵션 정의 ---------- */
const AMENITIES = {
  convenience: ["포장 가능", "배달 가능", "예약 가능", "24시간 영업"],
  access: ["주차 가능", "발렛 파킹", "장애인 편의시설"],
  restriction: ["반려동물 동반 가능", "노키즈존"],
  environment: [
    "와이파이 있음",
    "단체석 있음",
    "룸 있음",
    "흡연실 있음",
    "야외 좌석",
  ],
};

export default function StoreModifyAmenities() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    fetchStore();
  }, []);

  /* ---------- 기존 매장 정보 조회 ---------- */
  const fetchStore = async () => {
    try {
      const idRes = await http.get("/owner/store-id");
      const storeId = idRes.data.data;

      const detailRes = await getStoreDetail(storeId);
      const data = detailRes.data.data;

      console.log("상세 조회 데이터:", data);

      if (data.convince?.length) {
        const koreanValues = data.convince.map(
          (item: any) => item.displayName
        );
        setSelected(koreanValues);
      }
    } catch (e) {
      console.error("매장 정보 불러오기 실패", e);
    } finally {
      setLoading(false);
    }
  };

  /* ---------- 선택 토글 ---------- */
  const toggleItem = (item: string) => {
    setSelected((prev) =>
      prev.includes(item)
        ? prev.filter((v) => v !== item)
        : [...prev, item]
    );
  };

  /* ---------- 수정 제출 ---------- */
  const handleSubmit = async () => {
    try {
      const requestBody = {
        convinces: selected.map((item) => convenienceMap[item]),
      };

      console.log("PATCH body:", requestBody);

      await updateStoreConvinces(requestBody);

      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        navigate(-1);
      }, 1200);
    } catch (error) {
      console.error("편의시설 수정 실패", error);
    }
  };

  if (loading) return <div className="p-6">로딩중...</div>;

  const isValid = selected.length > 0;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <AppBar layout="center" leftType="left" onBack={() => navigate(-1)} />

      <div className="px-6 pt-2 pb-6">
        <h1 className="typo-sub-title">
          편의시설 및 서비스를
          <br />
          수정해주세요.
        </h1>
      </div>

      <div className="flex-1 px-6 space-y-6">
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

      <div className="px-6 py-4">
        <Button height="h-[48px]" disabled={!isValid} onClick={handleSubmit}>
          수정 완료
        </Button>
      </div>

      {showToast && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50">
          <div className="bg-white w-[274px] h-[130px] rounded-lg flex items-center justify-center shadow-lg">
            <p className="typo-15-medium text-center">
              편의시설이<br />수정되었습니다.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- 공통 컴포넌트 ---------- */
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
