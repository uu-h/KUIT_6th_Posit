import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HomeIcon from "../../assets/BottomBar/Home.svg";
import HomeActiveIcon from "../../assets/BottomBar/HomeActive.svg";
import PositIcon from "../../assets/BottomBar/POSiT.svg";
import PositActiveIcon from "../../assets/BottomBar/POSiTActive.svg";
import CouponIcon from "../../assets/BottomBar/Coupon.svg";
import CouponActiveIcon from "../../assets/BottomBar/CouponActive.svg";
import MyIcon from "../../assets/BottomBar/My.svg";
import MyActiveIcon from "../../assets/BottomBar/MyActive.svg";

interface BottomBarProps {
  active: string;
  // onChange는 이제 선택적
  onChange?: (key: string) => void;
}

export default function BottomBar({ active, onChange }: BottomBarProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const navigate = useNavigate();

  const tabs = [
    { key: "posit", label: "POSiT", icon: PositIcon, activeIcon: PositActiveIcon, path: "/posit" },
    { key: "home", label: "홈", icon: HomeIcon, activeIcon: HomeActiveIcon, path: "/" },
    { key: "coupon", label: "쿠폰함", icon: CouponIcon, activeIcon: CouponActiveIcon, path: "/coupon" },
    { key: "my", label: "MY", icon: MyIcon, activeIcon: MyActiveIcon, path: "/my" },
  ];

  return (
    <nav className="fixed left-1/2 -translate-x-1/2 bottom-0 bg-corals-000 w-[375px] flex justify-center gap-[35px] items-center h-[90px] z-50">
      {tabs.map((tab) => {
        const isActive = active === tab.key;
        const isHovered = hovered === tab.key;
        const showActiveIcon = isActive || isHovered;

        return (
          <button
            key={tab.key}
            onClick={() => {
              navigate(tab.path); // 클릭 시 라우팅
              if (onChange) onChange(tab.key); // 기존 콜백도 호출
            }}
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
            <span className="typo-12-semibold">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
