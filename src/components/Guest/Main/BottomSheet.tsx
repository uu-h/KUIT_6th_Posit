import { motion, useDragControls } from "framer-motion";
import { useEffect, useState } from "react";

export type SheetState = "collapsed" | "half" | "expanded"; //수정!!

const getHeightMap = (halfHeight: string): Record<SheetState, string> => ({
  collapsed: "120px",
  half: halfHeight,
  expanded: "85vh",
});

type Props = {
  popularContent?: React.ReactNode;
  expandedContent?: React.ReactNode;

  onStateChange?: (state: SheetState) => void;
  /** 외부에서 강제로 상태 열기 */
  initialState?: SheetState;

  /** 정렬바 여부 */
  showSortBar?: boolean;

  /**
   * 상세 모드에서 half->expanded 금지
   * - true면 expanded로는 절대 안 감
   * - 대신 expanded로 가려는 "의도"만 콜백으로 알려줌(페이지 전환용)
   */
  disableExpanded?: boolean;
  halfHeight?: string;

  /** expanded로 올리려는 의도(페이지 전환 트리거용) */
  onExpandedIntent?: () => void;

  disableScrollOnHalf?: boolean;
};

export default function BottomSheet({
  popularContent,
  expandedContent,
  onStateChange,
  initialState = "collapsed",
  showSortBar = true,
  disableExpanded = false,
  onExpandedIntent,
  halfHeight = "38vh",
  disableScrollOnHalf = false,
}: Props) {
  const [sheetState, setSheetState] = useState<SheetState>(initialState);
  const heightMap = getHeightMap(halfHeight);
  const dragControls = useDragControls();

  // 외부 initialState가 바뀌면 내부도 따라가야 함 (마커 클릭 시 half로 열기)
  useEffect(() => {
    setSheetState(initialState);
  }, [initialState]);

  const changeState = (next: SheetState) => {
    setSheetState(next);
    onStateChange?.(next);
  };

  const tryExpand = () => {
    // 상세 모드(마커 선택)에서는 expanded로 가지 않고 페이지 전환만
    if (disableExpanded) {
      onExpandedIntent?.();
      // 시트는 half 유지
      setSheetState("half");
      return;
    }

    changeState("expanded");
  };

  const isHalf = sheetState === "half";
  const shouldLockScroll = disableScrollOnHalf && isHalf;

  return (
    <motion.div
      drag="y"
      dragControls={dragControls}
      dragListener={false}
      dragConstraints={{ top: 0, bottom: 0 }}
      onDragEnd={(_, info) => {
        const offsetY = info.offset.y;
        const velocityY = info.velocity.y;

        // 위로 강하게 드래그 = expand 의도
        if (velocityY < -500) {
          tryExpand();
          return;
        }

        // 아래로 강하게 드래그 = 접기
        if (velocityY > 500) {
          changeState("collapsed");
          return;
        }

        if (sheetState === "expanded") {
          if (offsetY > 60) changeState("half");
          else changeState("expanded");
          return;
        }

        if (sheetState === "half") {
          if (offsetY < -60) {
            // half -> expanded 의도
            tryExpand();
          } else if (offsetY > 35) {
            changeState("collapsed");
          } else {
            changeState("half");
          }
          return;
        }

        if (sheetState === "collapsed") {
          if (offsetY < -60) changeState("half");
          else changeState("collapsed");
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
        <div className="w-[36px] h-[4px] rounded-full bg-neutrals-04 mb-2" />
      </div>

      {/* 정렬 바: 리스트 모드에서 expanded일 때만 */}
      {sheetState === "expanded" && showSortBar && (
        <div className="flex items-center gap-1 px-4 pb-2 mb-1">
          <span className="typo-12-light text-black">거리순 정렬</span>
        </div>
      )}

      <div
        className={[
          "flex-1 px-4 pb-[90px]",
          shouldLockScroll
            ? "overflow-hidden"
            : "overflow-y-auto no-scrollbar-y",
        ].join(" ")}
      >
        {sheetState !== "expanded" && popularContent}
        {sheetState === "expanded" && expandedContent}
      </div>
    </motion.div>
  );
}
