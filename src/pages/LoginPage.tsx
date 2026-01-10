import KakaoIcon from "../../public/Kakao.svg";
import GoogleIcon from "../../public/Google.svg";
import NaverIcon from "../../public/Naver.svg";
import CallIcon from "../../public/Call.svg";
import ToggleOffIcon from "../../public/toggle_off.svg";
import LeftArrowIcon from "../../public/left_arrow.svg";

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full bg-shades-01 px-[24px] pt-[48px]">

      {/* 상단 헤더 */}
      <div className="mb-[40px] flex flex-col">
        <button className="w-fit flex items-center justify-center">
          <img
            src={LeftArrowIcon}
            alt="뒤로가기"
            className="h-[12.73px] w-[20px]"
          />
        </button>

        <h1 className="mt-[40px] mb-[16px] typo-sub-title text-shades-02">
          로그인
        </h1>
      </div>

      {/* 입력 폼 */}
      <div className="flex flex-col gap-[24px]">
        <div className="flex flex-col">
          <label className="mb-[8px] typo-16-regular text-neutrals-09">
            이메일
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
        <div className="flex items-center gap-[8px]">
          <img
            src={ToggleOffIcon}
            alt="자동 로그인 비활성화"
            className="h-[27px] w-[50px]"
          />
          <span className="typo-13-regular text-shades-02">
            자동 로그인
          </span>
        </div>

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

      <div className="mt-[24px] flex justify-center gap-[26px]">
        <span className="typo-14-regular text-neutrals-06">
          아직 회원이 아니신가요?
        </span>
        <button className="typo-14-medium text-neutrals-09">
          회원가입
        </button>
      </div>

      <div className="mt-[72px] flex items-center gap-[26px]">
        <div className="h-[1px] flex-1 bg-shades-02" />
        <span className="typo-16-regular text-shades-02">
          또는
        </span>
        <div className="h-[1px] flex-1 bg-shades-02" />
      </div>

      {/* 소셜 로그인 버튼 */}
      <div className="mt-[21px] flex justify-center gap-[40px]">
        <button className="h-[48px] w-[48px] rounded-full bg-[#FEE500] flex items-center justify-center">
          <img src={KakaoIcon} alt="Kakao login" />
        </button>

        <button className="h-[48px] w-[48px] rounded-full bg-white shadow flex items-center justify-center">
          <img src={GoogleIcon} alt="Google login" />
        </button>

        <button className="h-[48px] w-[48px] rounded-full bg-[#03C75A] flex items-center justify-center">
          <img src={NaverIcon} alt="Naver login" />
        </button>

        <button className="h-[48px] w-[48px] rounded-full bg-neutrals-02 flex items-center justify-center">
          <img src={CallIcon} alt="Phone login" />
        </button>
      </div>
    </div>
  );
}
