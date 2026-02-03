import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import OwnerBottomBar from "../components/BottomBar/OwnerBottomBar";

type OwnerLayoutProps = {
  children: ReactNode;
  /** 페이지에서 명시적으로 active를 주고 싶을 때 */
  active?: "my" | "home" | "inbox";
  bottomBarHeightPx?: number;
  className?: string;
};

function getActiveFromPath(pathname: string) {
  if (pathname.startsWith("/owner/my")) return "my";
  if (pathname.startsWith("/owner/inbox")) return "inbox";
  return "home";
}

export default function OwnerLayout({
  children,
  active,
  bottomBarHeightPx = 90,
  className = "",
}: OwnerLayoutProps) {
  const { pathname } = useLocation();

  // active prop이 있으면 그걸 우선, 없으면 URL 기준 자동 계산
  const resolvedActive = active ?? getActiveFromPath(pathname);

  return (
    <div
      className={`relative min-h-dvh bg-white ${className}`}
      style={{ paddingBottom: bottomBarHeightPx }}
    >
      {children}
      <OwnerBottomBar active={resolvedActive} />
    </div>
  );
}
