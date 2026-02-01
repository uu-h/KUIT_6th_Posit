type Props = {
  onClick?: () => void;
  label?: string;
};

export default function LoadMoreButton({
  onClick,
  label = "내역 더보기",
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        w-full h-[48px]
        rounded-[4px]
        bg-white
        border border-neutrals-03
        typo-14-regular
      "
    >
      {label}
    </button>
  );
}
