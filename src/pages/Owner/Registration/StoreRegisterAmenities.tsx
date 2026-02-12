import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { createStore } from "../../../api/store";
import type { CreateStoreRequest } from "../../../api/store";

import AppBar from "../../../components/Common/AppBar";
import Button from "../../../components/Button";

/* ---------- 요일 매핑 ---------- */
const dayMap: Record<string, string> = {
  월: "MON",
  화: "TUE",
  수: "WED",
  목: "THU",
  금: "FRI",
  토: "SAT",
  일: "SUN",
};

/* ---------- 카테고리 매핑 ---------- */
const typeMap: Record<string, "STUDY" | "BRUNCH" | "DESSERT"> = {
  "스터디 카페": "STUDY",
  "브런치 카페": "BRUNCH",
  "디저트 카페": "DESSERT",
};


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

export default function StoreRegisterAmenities() {
  const navigate = useNavigate();
  const location = useLocation();
  const saved = location.state;

  const [selected, setSelected] = useState<string[]>([]);

  const handleSubmit = async () => {
    try {

      const requestBody: CreateStoreRequest = {
        name: saved?.storeName ?? "",
        address: {
          roadAddress: saved?.address ?? "",
          detailAddress: saved?.detailAddress ?? "",
        },

        type: typeMap[saved?.category ?? "스터디 카페"],
        phone: saved?.phoneNumber ?? "",
        snsUrl: "",
        description: saved?.intro ?? "",
        couponPin: "1234",

        imageUrls: saved?.imageUrls ?? [],

        operation: {
          regularHolidays: (saved?.closedDays ?? []).map(
            (d: string) => dayMap[d]
          ),
          openDay: (saved?.openDays ?? []).map(
            (d: string) => dayMap[d]
          ),
          openTime: `${(saved?.startHour ?? "00").padStart(2, "0")}:${(
            saved?.startMinute ?? "00"
          ).padStart(2, "0")}`,
          closeTime: `${(saved?.endHour ?? "00").padStart(2, "0")}:${(
            saved?.endMinute ?? "00"
          ).padStart(2, "0")}`,
        },

        convinces: selected.map(
          (item) => convenienceMap[item]
        ),

        menus: (saved?.menuNames ?? []).map(
          (name: string, i: number) => ({
            name,
            price: Number(saved?.menuPrices?.[i] ?? 0),
            imageUrl: "",
          })
        ),
      };

      console.log("imageUrls:", requestBody.imageUrls);
      console.log("전체 body:", requestBody);

      await createStore(requestBody);
      navigate("/owner/home");

    } catch (error) {
      console.error("가게 등록 실패", error);
    }
  };


  const toggleItem = (item: string) => {
    setSelected((prev) =>
      prev.includes(item)
        ? prev.filter((v) => v !== item)
        : [...prev, item]
    );
  };

  const isValid = selected.length > 0;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <AppBar
        layout="center"
        leftType="left"
        onBack={() => navigate(-1)}
      />

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
        <Button
          height="h-[48px]"
          disabled={!isValid}
          onClick={handleSubmit}
        >
          완료
        </Button>
      </div>
    </div>
  );
}

/* ---------- 섹션 ---------- */
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

/* ---------- 버튼 ---------- */
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
