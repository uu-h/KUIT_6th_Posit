import { useState } from "react";

interface BottomBarProps {
  active: string;
  onChange: (key: string) => void;
}

export default function BottomBar({ active, onChange }: BottomBarProps) {
  const [hovered, setHovered] = useState<string | null>(null);

  const tabs = [
    { key: "posit", label: "POSiT", icon: "src/assets/BottomBar/POSiT.svg", activeIcon: "src/assets/BottomBar/POSiTActive.svg" },
    { key: "home", label: "홈", icon: "src/assets/BottomBar/Home.svg", activeIcon: "src/assets/BottomBar/HomeActive.svg" },
    { key: "coupon", label: "쿠폰함", icon: "src/assets/BottomBar/Coupon.svg", activeIcon: "src/assets/BottomBar/CouponActive.svg" },
    { key: "my", label: "MY", icon: "src/assets/BottomBar/My.svg", activeIcon: "src/assets/BottomBar/MyActive.svg" },
  ];

  return (
    <nav className="fixed bottom-0 bg-corals-000 w-[375px] flex justify-center gap-[35px] items-center h-[90px] z-50">
      {tabs.map((tab) => {
        const isActive = active === tab.key;
        const isHovered = hovered === tab.key;
        const showActiveIcon = isActive || isHovered;

        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            onMouseEnter={() => setHovered(tab.key)}
            onMouseLeave={() => setHovered(null)}
            className={`
              flex flex-col items-center justify-center gap-[4.5px] mb-[8px]
              w-[56px] h-[56px]
              rounded-[8px]
              transition-colors duration-200
              ${isActive || isHovered 
                ? "bg-primary-01 text-white" 
                : "bg-transparent text-neutrals-08"
              }
            `}
          >
            <img 
              src={showActiveIcon ? tab.activeIcon : tab.icon} 
              alt={tab.label}
              className="w-[24px] h-[24px] object-contain" 
            />
            <span className="typo-12-semibold">
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
