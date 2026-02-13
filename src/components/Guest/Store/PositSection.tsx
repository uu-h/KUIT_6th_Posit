import type { StorePositPreview } from "../../../types/store";
import RightIcon from "../../../assets/Common/RightArrow.svg";

import QuoteIcon from "../../../assets/Guest/Store/Quote.svg";
import OwnerPositIcon from "../../../assets/Guest/Store/OwnerPosit.svg";
import MyPositIcon from "../../../assets/Guest/Store/MyPosit.svg";

export default function PositSection({
  variant,
  data,
}: {
  variant: "owner" | "my";
  data: StorePositPreview;
}) {
  const isOwner = variant === "owner";
  const quotes = data.quotes ?? [];

  const handleClick = () => data.onClick?.();

  return (
    <section className="mt-[47px]">
      {/* 제목 */}
      <div className="flex items-center justify-between gap-[12px]">
        <h3 className="typo-16-bold">{data.title}</h3>
        <button
          type="button"
          className="w-[24px] h-[24px] flex items-center justify-center"
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
          aria-label="바로가기"
        >
          <img src={RightIcon} alt="" className="w-[16px] h-[16px]" />
        </button>
      </div>

      {/* coral card */}
      <div
        className="mt-[12px] rounded-[14px] bg-primary-01 p-[16px] cursor-pointer"
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleClick();
        }}
      >
        {/* quotes area */}
        {isOwner ? (
          <OwnerQuoteCard text={quotes[0] ?? ""} />
        ) : (
          <div className="grid grid-cols-2 gap-[12px]">
            <MyQuoteCard text={quotes[0] ?? ""} />
            <MyQuoteCard text={quotes[1] ?? ""} />
          </div>
        )}

        {/* footer area */}
        <div className="mt-[8px] flex items-center justify-center gap[6px]">
          <p className="typo-12-medium text-center text-corals-000 whitespace-pre-line">
            {data.subtitle}
          </p>

          <img
            src={isOwner ? OwnerPositIcon : MyPositIcon}
            alt=""
            className="w-[58px] h-[58px] ml-[20px]"
          />
        </div>
      </div>
    </section>
  );
}

/** quote 카드 */
function OwnerQuoteCard({ text }: { text: string }) {
  return (
    <div className="grid gird-rows-2 rounded-[8px] bg-white p-[20px] h-[86px]">
      <img src={QuoteIcon} alt="" className="h-[13px]" />
      <p className="typo-14-regular text-neutrals-09 text-center break-words truncate">
        {text}
      </p>
    </div>
  );
}

function MyQuoteCard({ text }: { text: string }) {
  return (
    <div className="grid gird-rows-2 items-center rounded-[8px] bg-white pr-[50px] p-[20px] h-[147px]">
      <img src={QuoteIcon} alt="" className="h-[13px]" />
      <p className="typo-14-regular text-neutrals-09 break-words line-clamp-3">
        {text}
      </p>
    </div>
  );
}
