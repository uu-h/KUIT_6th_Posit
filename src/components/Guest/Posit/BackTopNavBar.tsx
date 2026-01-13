import BackIcon from "../../../assets/Guest/Posit/Back.svg";

type BackTopNavBarProps = {
  onBack: () => void;
};

export default function BackTopNavBar({ onBack }: BackTopNavBarProps) {
  return (
    <button
      type="button"
      onClick={onBack}
      aria-label="뒤로가기"
      className="h-[28px] w-[28px]"
    >
      <img src={BackIcon} alt="뒤로가기" className="h-[14px] w-[7px]" />
    </button>
  );
}
