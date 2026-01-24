import { useRef, useState } from "react";
import AppBar from "../../../components/Common/AppBar";
import BottomBar from "../../../components/BottomBar/BottomBar";
import {
  InfoList,
  MenuList,
  PositSection,
  StoreHeaderCard,
} from "../../../components/Guest/Store";
import StoreSectionNav, {
  type StoreSectionKey,
} from "../../../components/Guest/Store/StoreSectionNav";
import type { StoreDetail } from "./store";
import { storeDetailMock } from "./store.mock";
import { useFixedOnScroll } from "../../../hooks/Guest/useFixedOnScroll";

type GuestStoreDetailPageProps = {
  store?: StoreDetail;
};

const APPBAR_H = 64;
const NAV_H = 60; // StoreSectionNav(59) + divider(1) 정도

export default function GuestStoreDetailPage({
  store = storeDetailMock,
}: GuestStoreDetailPageProps) {
  const [activeTab, setActiveTab] = useState<StoreSectionKey>("home");

  const homeRef = useRef<HTMLDivElement | null>(null);
  const positRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const { isFixed: navFixed, sentinelRef: navSentinelRef } =
    useFixedOnScroll(APPBAR_H);

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
    <div className="min-h-dvh w-full bg-white pb-[92px]">
      <AppBar
        title={store.name}
        layout="left"
        leftType="left"
        rightType="close"
      />

      <main className="px-[16px] pt-[7px]">
        <StoreHeaderCard
          store={store}
          onClose={() => {}}
          onOwnerPositClick={() => scrollToSection("posit")}
          onMyPositClick={() => scrollToSection("posit")}
        />
        {/* Nav */}
        <div className="mt-[15px]">
          {/* sentinel: nav 원래 위치 */}
          <div ref={navSentinelRef} />

          {/* nav: fixed 토글 */}
          <div
            className={
              navFixed
                ? "fixed top-[64px] left-1/2 -translate-x-1/2 z-40 bg-white w-[375px] px-[16px]"
                : ""
            }
          >
            <StoreSectionNav active={activeTab} onChange={scrollToSection} />
          </div>

          {/* spacer: fixed 시 점프 방지 */}
          {navFixed && <div style={{ height: NAV_H }} />}
        </div>
        {/* 홈 */}
        <div ref={homeRef} className={`mt-[33px] scroll-mt-[144px]`}>
          <InfoList rows={store.infoRows} />
        </div>
        {/* POSiT */}
        <div ref={positRef} className={`scroll-mt-[144px]`}>
          <PositSection variant="owner" data={store.ownerPosit} />
          <PositSection variant="my" data={store.myPosit} />
        </div>
        {/* 메뉴 */}
        <div ref={menuRef} className={`mt-[52px] scroll-mt-[144px]`}>
          <MenuList menus={store.menus} />
        </div>

        <footer className="-mx-[16px] mt-[35px] py-[18px] bg-neutrals-04  text-center typo-12-regular text-neutrals-07">
          <span className="inline-flex grid grid-cols-3 gap-[35px]">
            <p>이용약관</p>
            <p>고객센터</p>
            <p>신고센터</p>
          </span>
          <div className="mt-[6px] typo-12-bold text-neutrals-07">POSiT !</div>
        </footer>
      </main>

      <BottomBar active="home" onChange={() => {}} />
    </div>
  );
}
