import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import AppBar from "../../../components/Common/AppBar";
import Button from "../../../components/Button";

const DAYS = ["월", "화", "수", "목", "금", "토", "일"];

export default function StoreRegisterHours() {
  const navigate = useNavigate();

  const location = useLocation();
  const saved = location.state;


  /* ---------- 영업 요일 ---------- */
  const [openDays, setOpenDays] = useState<string[]>([]);

  const toggleOpenDay = (day: string) => {
    setOpenDays((prev) =>
      prev.includes(day)
        ? prev.filter((d) => d !== day)
        : [...prev, day]
    );
  };

  /* ---------- 영업 시간 ---------- */
  const [startHour, setStartHour] = useState("");
  const [startMinute, setStartMinute] = useState("");
  const [endHour, setEndHour] = useState("");
  const [endMinute, setEndMinute] = useState("");

  /* ---------- 정기 휴무 ---------- */
  const [closedDays, setClosedDays] = useState<string[]>([]);

  const toggleClosedDay = (day: string) => {
    setClosedDays((prev) =>
      prev.includes(day)
        ? prev.filter((d) => d !== day)
        : [...prev, day]
    );
  };

  /* ---------- 시간 유효성 체크 ---------- */
  const isValidHour = (v: string) => {
    if (v === "") return false;
    const num = Number(v);
    return num >= 1 && num <= 24;
  };

  const isValidMinute = (v: string) => {
    if (v === "") return false;
    const num = Number(v);
    return num >= 0 && num <= 59;
  };

  /* ---------- 버튼 활성화 조건 ---------- */
  const isValid =
    openDays.length > 0 &&
    isValidHour(startHour) &&
    isValidMinute(startMinute) &&
    isValidHour(endHour) &&
    isValidMinute(endMinute);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* AppBar */}
      <AppBar layout="center" leftType="left" onBack={() => navigate(-1)} />

      {/* Title + Step */}
      <div className="px-6 pt-0 mt-0 pb-6">
        <div className="flex items-center justify-between">
          <h1 className="typo-sub-title">
            운영시간 및 휴무일을
            <br />
            설정해주세요.
          </h1>

          <div className="w-[43px] h-[23px] -mt-6 rounded-full bg-neutrals-02 flex items-center justify-center">
            <span className="typo-14-medium">3</span>
            <span className="typo-14-medium text-neutrals-06">/4</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 space-y-8">
        {/* 영업시간 */}
        <div>
          <p className="typo-14-medium mb-3">영업시간</p>

          {/* 요일 */}
          <div className="flex gap-5 mb-4">
            {DAYS.map((day) => (
              <button
                key={day}
                type="button"
                onClick={() => toggleOpenDay(day)}
                className={`w-[32px] h-[32px] rounded-full typo-14-medium
                  ${
                    openDays.includes(day)
                      ? "bg-primary-01 text-corals-000"
                      : "bg-neutrals-03 text-neutrals-09"
                  }`}
              >
                {day}
              </button>
            ))}
          </div>

          {/* 시간 선택 */}
          <div className="flex items-center gap-2">
            <TimeInput
              value={startHour}
              onChange={setStartHour}
              type="hour"
            />
            <span className="-mx-1 text-neutrals-04">:</span>
            <TimeInput
              value={startMinute}
              onChange={setStartMinute}
              type="minute"
            />

            <span className="mx-2 text-neutrals-04">~</span>

            <TimeInput value={endHour} onChange={setEndHour} type="hour" />
            <span className="-mx-1 text-neutrals-04">:</span>
            <TimeInput
              value={endMinute}
              onChange={setEndMinute}
              type="minute"
            />
          </div>
        </div>

        {/* 정기 휴무 */}
        <div>
          <p className="typo-14-medium mb-3">정기 휴무</p>

          <div className="flex flex-wrap gap-2">
            {DAYS.map((day) => (
              <button
                key={day}
                type="button"
                onClick={() => toggleClosedDay(day)}
                className={`w-[64px] h-[36px] rounded-[4px] typo-14-regular
                  ${
                    closedDays.includes(day)
                      ? "bg-primary-01 text-corals-000"
                      : "bg-neutrals-03 text-neutrals-09"
                  }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Button */}
      <div className="px-6 py-4">
        <Button
          height="h-[48px]"
          disabled={!isValid}
          onClick={() =>
            navigate("/owner/store/register/amenities", {
              state: {
                ...saved,
                openDays,
                closedDays,
                startHour,
                startMinute,
                endHour,
                endMinute,
              },
            })
          }

        >
          완료
        </Button>
      </div>
    </div>
  );
}

/* ---------- Time Input 컴포넌트 ---------- */
function TimeInput({
  value,
  onChange,
  type,
}: {
  value: string;
  onChange: (v: string) => void;
  type: "hour" | "minute";
}) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numbersOnly = e.target.value.replace(/\D/g, "").slice(0, 2);
    onChange(numbersOnly);
  };

  const handleBlur = () => {
    if (value === "") return;

    let num = Number(value);

    if (type === "hour") {
      if (num < 1) num = 1;
      if (num > 24) num = 24;
    }

    if (type === "minute") {
      if (num < 0) num = 0;
      if (num > 59) num = 59;
    }

    onChange(String(num).padStart(2, "0"));
  };

  return (
    <input
      value={value}
      placeholder="00"
      onChange={handleChange}
      onBlur={handleBlur}
      inputMode="numeric"
      className="
        flex
        w-[69px] h-[48px]
        px-[24px] py-[14px]
        justify-center items-center
        rounded-[8px]
        border border-neutrals-04
        text-center
        typo-16-regular
        text-neutrals-08
        placeholder:text-neutrals-05
        focus:outline-none
        focus:border-primary-01
      "
    />
  );
}
