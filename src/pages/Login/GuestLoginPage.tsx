import ToggleOffIcon from "../../../public/toggle_off.svg";
import LeftArrowIcon from "../../../public/left_arrow.svg";
import ToggleOnIcon from "../../../public/toggle_on.svg";

import { useState } from "react";


export default function GuestLoginPage() {

  const [autoLogin, setAutoLogin] = useState(false);

  return (
    <div className="min-h-screen w-full bg-shades-01 px-[24px] pt-[48px]">

      {/* 상단 헤더 */}
      <div className="mb-[40px] flex flex-col">
        <button className="w-fit flex items-center justify-center">
          <img
            src={LeftArrowIcon}
            alt="뒤로가기"
            className="h-[24px] w-[24px]"
          />
        </button>

        <h1 className="mt-[40px] mb-[16px] typo-sub-title text-shades-02">
          게스트 로그인
        </h1>
      </div>

      {/* 입력 폼 */}
      <div className="flex flex-col gap-[24px]">
        <div className="flex flex-col">
          <label className="mb-[8px] typo-16-regular text-neutrals-09">
            아이디
          </label>
          <input
            type="email"
            className="border-b border-neutrals-09 outline-none typo-16-medium"
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-[8px] typo-16-regular text-neutrals-09">
            비밀번호
          </label>
          <input
            type="password"
            className="border-b border-neutrals-09 outline-none typo-16-medium"
          />
        </div>
      </div>

      <div className="mt-[20px] flex items-center justify-between">
        <button
          type="button"
          onClick={() => setAutoLogin(prev => !prev)}
          className="flex items-center gap-[8px]"
        >
          <img
            src={autoLogin ? ToggleOnIcon : ToggleOffIcon}
            alt={autoLogin ? "자동 로그인 활성화" : "자동 로그인 비활성화"}
            className="h-[27px] w-[50px]"
          />
          <span className="typo-13-regular text-shades-02">
            자동 로그인
          </span>
        </button>

        <button className="typo-13-regular text-shades-02">
          ID/PASS 찾기
        </button>
      </div>


      {/* 로그인 버튼 */}
      <button
        className=" 
          mt-[32px]
          w-full
          h-[51px]
          rounded-[8px]
          bg-primary-01
          flex items-center justify-center
          text-shades-01
          typo-16-bold
        "
      >
        로그인
      </button>

      <div className="mt-[24px] flex items-center justify-center gap-[26px]">
        <span className="typo-16-medium text-neutrals-06">
          아직 회원이 아니신가요?
        </span>
        <button className="typo-16-bold text-neutrals-08">
          간편 회원가입
        </button>
      </div>

    
    </div>
  );
}
