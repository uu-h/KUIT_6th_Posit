import { motion, useDragControls } from "framer-motion";
import { useState } from "react";
import downArrow from "../../../assets/Guest/Main/DownArrow.svg";

type SheetState = "collapsed" | "half" | "expanded";

const heightMap: Record<SheetState, string> = {
  collapsed: "120px",
  half: "45vh",
  expanded: "85vh",
};

type Props = {
  popularContent?: React.ReactNode;
  expandedContent?: React.ReactNode;
};

export default function BottomSheet({
  popularContent,
  expandedContent,
}: Props) {
  const [sheetState, setSheetState] = useState<SheetState>("collapsed");
  const dragControls = useDragControls();

  return (
    <motion.div
      drag="y"
      dragControls={dragControls}
      dragListener={false}
      dragConstraints={{ top: 0, bottom: 0 }}
      onDragEnd={(_, info) => {
        const offsetY = info.offset.y;
        const velocityY = info.velocity.y;

        if (velocityY < -500) {
          setSheetState("expanded");
          return;
        }
        if (velocityY > 500) {
          setSheetState("collapsed");
          return;
        }

        if (sheetState === "expanded") {
          if (offsetY > 60) setSheetState("half");
          else setSheetState("expanded");
          return;
        }

        if (sheetState === "half") {
          if (offsetY < -60) setSheetState("expanded");
          else if (offsetY > 35) setSheetState("collapsed"); 
          else setSheetState("half");
          return;
        }

        if (sheetState === "collapsed") {
          if (offsetY < -60) setSheetState("half");
          else setSheetState("collapsed");
        }
      }}
      animate={{ height: heightMap[sheetState] }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="
        absolute bottom-0 left-0
        w-full
        bg-shades-01
        rounded-t-[20px]
        shadow-[0_-4px_20px_rgba(0,0,0,0.1)]
        z-50
        flex flex-col
        overflow-hidden
      "
    >
      {/* 핸들 */}
      <div
        className="
          flex flex-col items-center justify-center
          h-[50px]                   
          cursor-grab active:cursor-grabbing
          select-none
        "
        onPointerDown={(e) => dragControls.start(e)}
      >
        {/* 실제 핸들 바 */}
        <div className="w-[36px] h-[4px] rounded-full bg-neutrals-04 mb-2" />
      </div>

      {/* 정렬 바 (expanded 상태에서만) */}
      {sheetState === "expanded" && (
        <div className="flex items-center gap-1 px-8 pb-2 mb-1">
          <span className="typo-12-light text-black">거리순 정렬</span>
          <img
            src={downArrow}
            alt="정렬 옵션"
            className="w-5 h-5"
          />
        </div>
      )}

      {/* 콘텐츠 */}
      <div className="flex-1 overflow-y-auto no-scrollbar-y px-4 pb-[90px]">
        {sheetState !== "expanded" && popularContent}
        {sheetState === "expanded" && expandedContent}
      </div>
    </motion.div>
  );
}