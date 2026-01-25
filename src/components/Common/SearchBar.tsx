import { useState } from "react";
import searchIcon from "../../assets/Common/Search.svg";
import leftArrowIcon from "../../assets/Common/SearchLeftArrow.svg";

type Props = {
  placeholder?: string;
  onClick?: () => void;
};

export default function SearchBar({
  placeholder = "검색어를 입력하세요.",
  onClick,
}: Props) {
  const [value, setValue] = useState("");

  const handleBack = (e: React.MouseEvent) => {
    e.stopPropagation(); // 상위 onClick 방지
    window.history.back(); // 이전 화면으로 이동
  };

  return (
    <div
      onClick={onClick}
      className="
        flex items-center
        w-[343px] h-[53px]
        pt-[3px] pr-[6px] pb-[2px] pl-[20px]
        gap-[10px]
        bg-shades-01
        rounded-[7px]
        shadow-md
      "
    >
      {/* 입력값이 있으면 왼쪽 화살표 표시 */}
      {value.length > 0 && ( 
        <img
          src={leftArrowIcon}
          alt="뒤로가기"
          className="w-5 h-5 cursor-pointer mr-[3px]"
          onClick={handleBack}
        />
      )}

      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="
          flex-1
          outline-none
          bg-transparent
          text-black
          typo-16-regular

          placeholder:text-neutrals-07
          placeholder:typo-16-regular
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
