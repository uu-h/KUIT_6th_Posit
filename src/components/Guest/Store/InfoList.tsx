import { useState } from "react";
import type { StoreInfoRow } from "../../../types/store";

import LocationIcon from "../../../assets/Guest/Store/Location.svg";
import TimeIcon from "../../../assets/Guest/Store/Time.svg";
import PhoneIcon from "../../../assets/Guest/Store/Call.svg";
import LinkIcon from "../../../assets/Guest/Store/Link.svg";
import InfoIcon from "../../../assets/Guest/Store/Info.svg";
import DownIcon from "../../../assets/Common/DownArrow.svg";

const ICON_MAP: Partial<Record<StoreInfoRow["key"], string>> = {
  address: LocationIcon,
  hours: TimeIcon,
  phone: PhoneIcon,
  snslink: LinkIcon,
  convince: InfoIcon,
};

// 토글 지원 키
const TOGGLE_KEYS: StoreInfoRow["key"][] = ["address", "convince"];

export default function InfoList({
  rows,
  onClickMap,
}: {
  rows: StoreInfoRow[];
  onClickMap?: () => void;
}) {
  // 열린 key들을 Set으로 관리 (여러 개 열기 가능)
  const [openKeys, setOpenKeys] = useState<Set<StoreInfoRow["key"]>>(
    () => new Set(),
  );

  // 전화 확인 모달 타겟
  const [callTarget, setCallTarget] = useState<string | null>(null);

  const toggle = (key: StoreInfoRow["key"]) => {
    setOpenKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <>
      <section>
        {rows.map((row) => {
          const canToggle = TOGGLE_KEYS.includes(row.key);
          const isOpen = openKeys.has(row.key);

          return (
            <div key={row.key} className="py-[8px]">
              {/* ====== 1) 상단 한 줄: 아이콘 + 텍스트 + 토글 ====== */}
              <div className="flex items-center gap-[9px]">
                {/* 아이콘 */}
                <div className="w-[20px] flex-shrink-0">
                  {ICON_MAP[row.key] && (
                    <img
                      src={ICON_MAP[row.key]}
                      alt={row.label}
                      className="w-[20px] h-[20px]"
                    />
                  )}
                </div>

                {/* 텍스트/콘텐츠 */}
                <div className="flex-1 min-w-0">
                  {/* phone: 버튼으로 만들어서 모달 띄우기 */}
                  {row.key === "phone" ? (
                    <button
                      type="button"
                      onClick={() => setCallTarget(row.value)}
                      className="block w-full text-left typo-14-regular text-neutrals-07"
                    >
                      {row.value}
                    </button>
                  ) : row.key === "snslink" ? (
                    <a
                      href={row.value}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block typo-14-regular text-neutrals-07 truncate"
                    >
                      {row.value}
                    </a>
                  ) : (
                    <p className="typo-14-regular text-neutrals-07 truncate">
                      {row.value}
                    </p>
                  )}
                </div>

                {/* 토글 버튼(주소/편의만) */}
                {canToggle && (
                  <button
                    type="button"
                    onClick={() => toggle(row.key)}
                    className="w-[24px] h-[24px] flex items-center justify-center"
                    aria-label={isOpen ? "접기" : "펼치기"}
                  >
                    <img
                      src={DownIcon}
                      alt=""
                      className={`transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                )}
              </div>

              {/* ====== 2) 주소일 때: 지도 라인을 '별도'로 분리 ====== */}
              {row.key === "address" && (
                <div className="mt-[6px] pl-[29px]">
                  <button
                    type="button"
                    onClick={onClickMap}
                    className="typo-14-regular text-neutrals-07"
                  >
                    지도
                  </button>
                </div>
              )}

              {/* ====== 3) 토글 펼침 영역 (address/convince) ====== */}
              {canToggle && (
                <div
                  className={`overflow-hidden transition-all duration-200 ${
                    isOpen ? "max-h-[220px] opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="mt-[8px] rounded-[8px] p-[10px] bg-neutrals-02 border border-neutrals-06">
                    <p className="typo-12-light text-neutrals-08 whitespace-pre-line">
                      {row.extra ? row.extra : row.value}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </section>

      {/* ====== 전화 확인 바텀시트 ====== */}
      {callTarget && (
        <div className="fixed inset-0 z-50 flex items-end justify-center pb-[90px]">
          {/* dim */}
          <button
            type="button"
            className="absolute inset-0 bg-black/30"
            onClick={() => setCallTarget(null)}
            aria-label="닫기"
          />

          {/* sheet */}
          <div className="relative w-full max-w-[375px] rounded-t-[16px] bg-white p-[16px]">
            <p className="typo-16-bold text-shades-02">전화하시겠어요?</p>
            <p className="mt-[6px] typo-14-regular text-neutrals-07">
              {callTarget}
            </p>

            <div className="mt-[14px] flex gap-[10px]">
              <button
                type="button"
                className="flex-1 h-[44px] rounded-[12px] bg-neutrals-03 typo-14-semibold"
                onClick={() => setCallTarget(null)}
              >
                취소
              </button>

              <a
                href={`tel:${callTarget}`}
                className="flex-1 h-[44px] rounded-[12px] bg-primary-01 text-white typo-14-semibold
                           flex items-center justify-center"
                onClick={() => setCallTarget(null)}
              >
                전화하기
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
