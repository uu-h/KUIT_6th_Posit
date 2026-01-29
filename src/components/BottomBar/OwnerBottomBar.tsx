import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HomeIcon from "../../assets/BottomBar/Home.svg";
import HomeActiveIcon from "../../assets/BottomBar/HomeActive.svg";
import InboxIcon from "../../assets/BottomBar/Inbox.svg"
import InboxActiveIcon from "../../assets/BottomBar/InboxActive.svg"
import MyIcon from "../../assets/BottomBar/My.svg";
import MyActiveIcon from "../../assets/BottomBar/MyActive.svg";

interface BottomBarProps {
  active: string;
  onChange?: (key: string) => void;
}

export default function OwnerBottomBar({ active, onChange }: BottomBarProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const navigate = useNavigate();

  const tabs = [
    { key: "my", label: "MY", icon: MyIcon, activeIcon: MyActiveIcon, path:"/owner/my" },
    { key: "home", label: "홈", icon: HomeIcon, activeIcon: HomeActiveIcon, path:"/owner/home" },
    { key: "inbox", label: "수신함", icon: InboxIcon, activeIcon: InboxActiveIcon, path:"/owner/inbox" },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 bg-corals-000 w-[375px] flex justify-center gap-[47px] items-center h-[90px] z-50">
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
            <span className="typo-12-semibold">
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
