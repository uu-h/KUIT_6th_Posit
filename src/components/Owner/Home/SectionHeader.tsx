import RightIcon from "../../../assets/Owner/Home/RightArrow.svg";

type Props = {
  title: string;
  actionText?: string;
  onActionClick?: () => void;
};

export default function SectionHeader({
  title,
  actionText,
  onActionClick,
}: Props) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="typo-16-semibold">{title}</h2>

      {actionText ? (
        <button
          type="button"
          onClick={onActionClick}
          className="text-[12px] text-[#50585F] font-medium leading-[18px] flex items-center gap-[8px]"
        >
          {actionText}
          <span aria-hidden>
            <img src={RightIcon} alt="오른쪽 화살표" className="h-[10px]" />
          </span>
        </button>
      ) : null}
    </div>
  );
}
