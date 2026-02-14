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

const TOGGLE_KEYS: StoreInfoRow["key"][] = ["address", "convince"];

export default function InfoList({
  rows,
  onClickMap,
}: {
  rows: StoreInfoRow[];
  onClickMap?: () => void;
}) {
  // 여러 개 열기: 열린 key들을 Set으로 관리
  const [openKeys, setOpenKeys] = useState<Set<StoreInfoRow["key"]>>(
    () => new Set(),
  );

  const toggle = (key: StoreInfoRow["key"]) => {
    setOpenKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <section>
      {rows.map((row) => {
        const canToggle = TOGGLE_KEYS.includes(row.key);
        const isOpen = openKeys.has(row.key);

        return (
          <div key={row.key} className="py-[8px]">
            <div className="flex items-start gap-[9px]">
              <div className="w-[20px] flex-shrink-0">
                {ICON_MAP[row.key] && (
                  <img
                    src={ICON_MAP[row.key]}
                    alt={row.label}
                    className="w-[20px] h-[20px]"
                  />
                )}
              </div>

              <div className="flex-1 min-w-0">
                {row.key === "snslink" ? (
                  <a
                    href={row.value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block typo-14-regular text-neutrals-07 truncate"
                  >
                    {row.value}
                  </a>
                ) : (
                  <p className="w-[250px] typo-14-regular text-neutrals-07 truncate">
                    {row.value}
                  </p>
                )}
                {row.key === "address" && (
                  <button
                    type="button"
                    onClick={onClickMap}
                    className="mt-[6px] typo-14-regular text-neutrals-07"
                  >
                    지도
                  </button>
                )}
              </div>

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

            {canToggle && (
              <div
                className={`overflow-hidden transition-all duration-200 ${
                  isOpen ? "max-h-[200px] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="mt-[3px] rounded-[8px] p-[10px] bg-neutrals-02 border border-neutrals-06">
                  {row.extra ? (
                    <p className="typo-12-light text-neutrals-08 whitespace-pre-line">
                      {row.extra}
                    </p>
                  ) : (
                    <p className="typo-12-light text-neutrals-08 whitespace-pre-line">
                      {row.value}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
}
