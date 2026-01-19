import Right from "../../../assets/Owner/My/RightArrow.svg";

type MenuItemProps = {
  label: string;
  onClick?: () => void; // 나중에 라우팅 연결
};

export default function MenuItem({ label, onClick }: MenuItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        w-full
        flex items-center justify-between
        py-[10px]
        text-left
      "
    >
      <span className="text-[15px] font-medium leading-[18px] text-neutrals-09">
        {label}
      </span>

      <img src={Right} alt="오른쪽 화살표" />
    </button>
  );
}
