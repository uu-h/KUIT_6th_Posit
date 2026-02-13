import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import {
  InfoList,
  MenuList,
  PositSection,
  StoreHeaderCard,
} from "../../../components/Guest/Store";
import StoreSectionNav, {
  type StoreSectionKey,
} from "../../../components/Guest/Store/StoreSectionNav";
import type { StoreDetail, StorePositPreview } from "../../../types/store";
import { useFixedOnScroll } from "../../../hooks/Guest/useFixedOnScroll";
import BottomSheetFooter from "../Main/BottomSheetFooter";

type Props = {
  store: StoreDetail;
  headerOffset?: number;
  onClose?: () => void;
  hideSectionNav?: boolean;
  px?: number;
};

const APPBAR_H_DEFAULT = 64;
const NAV_H = 60;

/** quotes 길이를 UI가 기대하는 만큼 보장 (my=2칸, owner=1칸) */
function normalizeQuotes(quotes: unknown, needed: number): string[] {
  const arr = Array.isArray(quotes)
    ? quotes.filter((v) => typeof v === "string")
    : [];
  return [...arr, ...Array(Math.max(0, needed - arr.length)).fill("")].slice(
    0,
    needed,
  );
}

function hasAnyQuote(quotes: unknown): boolean {
  return (
    Array.isArray(quotes) &&
    quotes.some((q) => typeof q === "string" && q.trim().length > 0)
  );
}

function toStoreIdNum(id: string): number {
  return Number(String(id).replace("store_", ""));
}

export default function StoreDetailBody({
  store,
  headerOffset = APPBAR_H_DEFAULT,
  onClose,
  hideSectionNav = false,
  px = 16,
}: Props) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<StoreSectionKey>("home");

  const homeRef = useRef<HTMLDivElement | null>(null);
  const positRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const { isFixed: navFixed, sentinelRef: navSentinelRef } =
    useFixedOnScroll(headerOffset);

  const sectionMap: Record<
    StoreSectionKey,
    React.RefObject<HTMLDivElement | null>
  > = {
    home: homeRef,
    posit: positRef,
    menu: menuRef,
  };

  const scrollToSection = (key: StoreSectionKey) => {
    setActiveTab(key);
    sectionMap[key].current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const storeIdNum = toStoreIdNum(store.id);

  /** "사장님 포짓" 미작성 시 문구: 사장님 고민이 아직 없어요! */
  const ownerBase = (store.ownerPosit ?? {}) as Partial<StorePositPreview>;
  const ownerHasQuote = hasAnyQuote(ownerBase.quotes);

  const ownerPositData: StorePositPreview = {
    title: "사장님 고민 POSiT! 하러가기",
    subtitle: ownerHasQuote
      ? (ownerBase.subtitle ?? "")
      : "사장님 고민이 아직 없어요!",
    quotes: normalizeQuotes(ownerBase.quotes, 1),
    onClick: () => {
      scrollToSection("posit");
    },
  };

  /** "내 포짓" 미작성 시 문구: 당신의 아이디어를 보내주세요! */
  const myBase = (store.myPosit ?? {}) as Partial<StorePositPreview>;
  const myHasQuote = hasAnyQuote(myBase.quotes);

  const myPositData: StorePositPreview = {
    title: "내 의견 POSiT! 하러가기",
    subtitle: myHasQuote
      ? (myBase.subtitle ?? "")
      : "당신의 아이디어를 보내주세요!",
    quotes: normalizeQuotes(myBase.quotes, 2),
    onClick: () => {
      navigate(`/stores/${storeIdNum}/posit/new`, {
        state: { storeName: store.name },
      });
    },
  };

  return (
    <main style={{ paddingLeft: px, paddingRight: px }} className="pt-[7px]">
      <StoreHeaderCard
        store={store}
        onClose={onClose}
        onOwnerPositClick={() => scrollToSection("posit")}
        onMyPositClick={() => scrollToSection("posit")}
      />

      <div className="mt-[15px]">
        {!hideSectionNav && (
          <>
            <div ref={navSentinelRef} />

            <div
              className={
                navFixed
                  ? "fixed left-1/2 -translate-x-1/2 z-40 bg-white w-[375px] px-[16px]"
                  : ""
              }
              style={navFixed ? { top: headerOffset } : undefined}
            >
              <StoreSectionNav active={activeTab} onChange={scrollToSection} />
            </div>

            {navFixed && <div style={{ height: NAV_H }} />}
          </>
        )}
      </div>

      <div ref={homeRef} className="mt-[33px] scroll-mt-[144px]">
        <InfoList
          rows={store.infoRows}
          onClickMap={() => {
            navigate(`/stores/${storeIdNum}/map`, {
              state: { lat: store.lat, lng: store.lng, name: store.name },
            });
          }}
        />
      </div>

      <div ref={positRef} className="scroll-mt-[144px]">
        <PositSection variant="owner" data={ownerPositData} />
        <PositSection variant="my" data={myPositData} />
      </div>

      <div ref={menuRef} className="mt-[52px] scroll-mt-[144px]">
        <MenuList menus={store.menus} />
      </div>

      <BottomSheetFooter />
    </main>
  );
}
