import starIcon from "../../../assets/Guest/Main/Star.svg";
import selectedStarIcon from "../../../assets/Guest/Main/SelectedStar.svg";

type Props = {
  label: string;
  selected?: boolean;
  onClick?: () => void;
};

export default function CategoryChip({
  label,
  selected = false,
  onClick,
}: Props) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-1
        px-3 py-[5px]
        rounded-full
        typo-14-semibold
        whitespace-nowrap
        border
        transition-colors
        ${
          selected
            ? "bg-primary-01 text-white border-primary-01"
            : "bg-white text-corals-200 border-corals-200"
        }
      `}
    >
      <img
        src={selected ? selectedStarIcon : starIcon}
        alt=""
        className="w-5 h-5"
      />
      {label}
    </button>
  );
}
