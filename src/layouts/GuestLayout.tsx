import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import BottomBar from "../components/BottomBar/BottomBar";

type GuestLayoutProps = {
  children: ReactNode;
  /** 페이지에서 명시적으로 active를 주고 싶을 때 */
  active?: "posit" | "home" | "coupon" | "my";
  bottomBarHeightPx?: number;
  className?: string;
};

function getGuestActiveFromPath(pathname: string) {
  if (pathname.startsWith("/guest/posit")) return "posit";
  if (pathname.startsWith("/guest/coupon")) return "coupon";
  if (pathname.startsWith("/guest/my")) return "my";
  return "home";
}

export default function GuestLayout({
  children,
  active,
  bottomBarHeightPx = 90,
  className = "",
}: GuestLayoutProps) {
  const { pathname } = useLocation();

  // active prop이 있으면 그걸 우선, 없으면 URL 기준 자동 계산
  const resolvedActive = active ?? getGuestActiveFromPath(pathname);

  return (
    <div
      className={`relative min-h-dvh bg-white ${className}`}
      style={{
        paddingBottom: `calc(env(safe-area-inset-bottom) + ${bottomBarHeightPx}px)`,
      }}
    >
      {children}
      <BottomBar active={resolvedActive} />
    </div>
  );
}
