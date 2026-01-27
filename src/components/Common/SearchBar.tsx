import searchIcon from "../../assets/Common/Search.svg";
import leftArrowIcon from "../../assets/Common/SearchLeftArrow.svg";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onBack?: () => void;
  placeholder?: string;
};

export default function SearchBar({
  value,
  onChange,
  onBack,
  placeholder = "검색어를 입력하세요.",
}: Props) {
  return (
    <div
      className="
        flex items-center
        w-[343px] h-[53px]
        pt-[3px] pr-[6px] pb-[2px] pl-[20px]
        gap-[10px]
        bg-shades-01
        rounded-[12px]
        shadow-lg
        relative
        z-50
      "
    >
      {value.length > 0 && (
        <img
          src={leftArrowIcon}
          alt="뒤로가기"
          className="w-4 h-4 cursor-pointer mr-[3px]"
          onClick={onBack}
        />
      )}

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="
          flex-1
          outline-none
          bg-transparent
          text-black
          typo-16-regular
          placeholder:text-neutrals-07
        "
      />

      <img
        src={searchIcon}
        alt="검색"
        className="w-5 h-5 mr-[15px]"
      />
    </div>
  );
}
