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
import type { StoreDetail } from "../../../types/store";
import { useFixedOnScroll } from "../../../hooks/Guest/useFixedOnScroll";
import BottomSheetFooter from "../Main/BottomSheetFooter";

type Props = {
  store: StoreDetail;
  headerOffset?: number; // 바텀시트/페이지에 따라 top offset 다르게
  onClose?: () => void; // 바텀시트에서 닫기 연결용
  hideSectionNav?: boolean;
  px?: number;
};

const APPBAR_H_DEFAULT = 64;
const NAV_H = 60;

export default function StoreDetailBody({
  store,
  headerOffset = APPBAR_H_DEFAULT,
  onClose,
  hideSectionNav = false,
  px = 16,
}: Props) {
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

  return (
    <main style={{ paddingLeft: px, paddingRight: px }} className=" pt-[7px]">
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
        <InfoList rows={store.infoRows} />
      </div>

      <div ref={positRef} className="scroll-mt-[144px]">
        <PositSection variant="owner" data={store.ownerPosit} />
        <PositSection variant="my" data={store.myPosit} />
      </div>

      <div ref={menuRef} className="mt-[52px] scroll-mt-[144px]">
        <MenuList menus={store.menus} />
      </div>

      <BottomSheetFooter />
    </main>
  );
}
