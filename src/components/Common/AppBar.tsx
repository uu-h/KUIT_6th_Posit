import BackIcon from "../../assets/Common/Back.svg";
import CloseIcon from "../../assets/Common/Close.svg";
import LeftIcon from "../../assets/Common/LeftArrow.svg";

type AppBarLayout = "center" | "left";

type AppBarProps = {
  title?: string;
  layout?: AppBarLayout;

  onBack?: () => void;
  onClose?: () => void;

  leftType?: "none" | "back" | "left";
  rightType?: "none" | "close";

  className?: string;
};

export default function AppBar({
  title,
  layout = "center",
  leftType = "none",
  rightType = "none",
  onBack,
  onClose,
  className = "",
}: AppBarProps) {
  const showLeft = leftType !== "none";
  const showRight = rightType === "close";

  const leftIconSrc =
    leftType === "back" ? BackIcon : leftType === "left" ? LeftIcon : null;

  return (
    <header
      className={["h-[58px] bg-white relative", "px-4", className].join(" ")}
    >
      <div className="h-full flex items-center">
        {/* layout = left : 아이콘 + 타이틀이 왼쪽 정렬 */}
        {layout === "left" ? (
          <div className="flex items-center gap-[13px]">
            {showLeft && leftIconSrc && (
              <button
                type="button"
                aria-label="뒤로가기"
                className="w-[24px] h-[24px] flex items-center justify-center"
                onClick={() => onBack?.()}
              >
                <img src={leftIconSrc} alt="뒤로가기" className="h-[20px]" />
              </button>
            )}

            {title && <h1 className="typo-sub-title">{title}</h1>}
          </div>
        ) : (
          // layout = center : 아이콘 왼쪽, 타이틀 중앙 정렬
          <div className="w-full flex items-center justify-center">
            {title && (
              <h1 className="typo-sub-title truncate max-w-[240px]">{title}</h1>
            )}

            {/* Left Icon */}
            {showLeft && leftIconSrc && (
              <button
                type="button"
                aria-label="뒤로가기"
                className="absolute left-[16px] w-[24px] h-[24px] flex items-center justify-center"
                onClick={() => onBack?.()}
              >
                <img src={leftIconSrc} alt="뒤로가기" className=" h-[20px]" />
              </button>
            )}

            {/* Right Icon */}
            {showRight && (
              <button
                type="button"
                aria-label="닫기"
                className="absolute right-[8px] w-[24px] h-[24px]"
                onClick={() => onClose?.()}
              >
                <img src={CloseIcon} alt="닫기" className="h-[15px]" />
              </button>
            )}
          </div>
        )}

        {/* layout = left + close 버튼 */}
        {layout === "left" && showRight && (
          <button
            type="button"
            aria-label="닫기"
            className="absolute right-[8px] w-[24px] h-[24px]"
            onClick={() => onClose?.()}
          >
            <img src={CloseIcon} alt="닫기" className="h-[15px]" />
          </button>
        )}
      </div>
    </header>
  );
}
