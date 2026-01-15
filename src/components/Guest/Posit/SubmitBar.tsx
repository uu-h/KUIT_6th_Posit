type SubmitBarProps = {
  isEnabled: boolean;
  onSubmit: () => void;
  onDisabledClick?: () => void;
  label?: string;
};

export default function SubmitBar({
  isEnabled,
  onSubmit,
  onDisabledClick,
  label = "보내기",
}: SubmitBarProps) {
  const handleClick = () => {
    if (!isEnabled) {
      onDisabledClick?.();
      return;
    }
    onSubmit();
  };
  return (
    <div className="mt-[17px] flex justify-end">
      <button
        type="button"
        onClick={handleClick}
        aria-disabled={!isEnabled}
        className={[
          "w-[88px] h-[39px] rounded-[10px]",
          "typo-16-semiblod",
          isEnabled ? "bg-primary-01 text-white" : "bg-neutrals-03 text-white",
        ].join(" ")}
      >
        {label}
      </button>
    </div>
  );
}
