import { motion } from "framer-motion";
import { useState } from "react";

type SheetState = "collapsed" | "half" | "expanded";

const heightMap: Record<SheetState, string> = {
  collapsed: "120px",
  half: "45vh",
  expanded: "85vh",
};

export default function BottomSheet({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sheetState, setSheetState] = useState<SheetState>("collapsed");

  return (
    <motion.div
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      onDragEnd={(_, info) => {
        if (info.offset.y < -120) setSheetState("expanded");
        else if (info.offset.y > 120) setSheetState("collapsed");
        else setSheetState("half");
      }}
      animate={{ height: heightMap[sheetState] }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="
        absolute bottom-0 left-0
        w-full
        bg-white
        rounded-t-[20px]
        shadow-[0_-4px_20px_rgba(0,0,0,0.1)]
        z-50
        flex flex-col
        overflow-hidden
      "
    >
      {/* 핸들 */}
      <div className="flex justify-center py-3">
        <div className="w-[36px] h-[4px] rounded-full bg-neutrals-04" />
      </div>

      {/* 콘텐츠 */}
      <div className="flex-1 overflow-y-auto px-4 pb-[100px]">
        {children}
      </div>
    </motion.div>
  );
}
