type Props = {
  onClick?: () => void;
  label?: string;
  disabled?: boolean;
};

export default function LoadMoreButton({
  onClick,
  label = "내역 더보기",
  disabled = false,
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full h-[48px]
        rounded-[4px]
        bg-white
        border border-neutrals-03
        typo-14-regular
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
      `}
    >
      {label}
    </button>
  );
}
