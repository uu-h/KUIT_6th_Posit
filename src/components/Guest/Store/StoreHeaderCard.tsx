import { useState } from "react";
import type { StoreDetail } from "../../../pages/Guest/Store/store";
import ImageCarousel from "./ImageCarousel";
import DownIcon from "../../../assets/Common/DownArrow.svg";
import ChatIcon from "../../../assets/Guest/Store/Chat.svg";

export default function StoreHeaderCard({
  store,
  //   onClose,
  onOwnerPositClick,
  onMyPositClick,
}: {
  store: StoreDetail;
  onClose?: () => void;
  onOwnerPositClick?: () => void;
  onMyPositClick?: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <section>
      {/* 가게 간단 정보 */}
      <div className="flex items-start justify-between gap-[12px]">
        <div className="min-w-0 w-full">
          <h2 className="typo-sub-title">{store.name}</h2>
          <p className="mt-[27px] typo-13-regular text-neutrals-07">
            {store.categoryText}
          </p>

          <div className="mt-[6px] flex items-center gap-[6px]">
            <span className="typo-14-semibold">{store.statusText}</span>
            <span className=" typo-13-regular text-neutrals-07">
              {store.shortAddress}
            </span>

            <button
              type="button"
              aria-label={open ? "접기" : "열기"}
              onClick={() => setOpen((v) => !v)}
              className="w-[18px] h-[18px] flex items-center justify-center"
            >
              <img
                src={DownIcon}
                alt=""
                className={`h-[8px] transition-transform duration-200 ${
                  open ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>
          <div
            className={`overflow-hidden transition-all duration-200 ${
              open ? "max-h-[200px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="grid grid-cols-[auto_1fr] gap-x-[10px] gap-y-[4px] items-center mt-[3px] rounded-[8px] p-[7px] bg-neutrals-02 border border-neutrals-06">
              <span className="rounded-[5px] px-[6px] py-[2px] bg-[#D9D9D9] typo-12-light text-neutrals-07 text-center">
                도로명
              </span>
              <span className="typo-12-light text-neutrals-08">
                {store.fullAddress}
              </span>
              <span className="rounded-[5px] px-[6px] py-[2px] bg-[#D9D9D9] typo-12-light text-neutrals-07 text-center">
                지번
              </span>
              <span className="typo-12-light text-neutrals-08">
                {store.shortAddress}
              </span>
            </div>
          </div>
        </div>

        {/* <button
          type="button"
          aria-label="닫기"
          onClick={onClose}
          className="w-[24px] h-[24px] grid place-items-center rounded-full bg-neutrals-02"
        >
          ✕
        </button> */}
      </div>

      {/* POSiT 버튼 */}
      <div className="mt-[15px] flex gap-[8px]">
        <button
          type="button"
          onClick={onOwnerPositClick}
          className="h-[32px] flex-1 rounded-[100px] bg-primary-01 flex items-center justify-center gap-[4px]"
        >
          <span className="w-[18px] h-[18px] flex items-center justify-center">
            <img src={ChatIcon} alt="사장님께 POSiT" className="h-[15px]" />
          </span>
          <span className="text-corals-000 text-[14px] font-roboto font-normal leading-[20px] tracking-[0.1px]">
            바로 사장님께 POSiT!
          </span>
        </button>

        <button
          type="button"
          onClick={onMyPositClick}
          className="h-[32px] flex-1 rounded-[100px] bg-primary-01 flex items-center justify-center gap-[4px]"
        >
          <span className="w-[18px] h-[18px] flex items-center justify-center">
            <img src={ChatIcon} alt="내 의견 POSiT" className="h-[15px]" />
          </span>
          <span className="text-corals-000 text-[14px] font-roboto font-normal leading-[20px] tracking-[0.1px]">
            바로 내 의견 POSiT!
          </span>
        </button>
      </div>

      {/* 가게 이미지 */}
      <ImageCarousel images={store.images} />
    </section>
  );
}
