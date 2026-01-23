import { useState } from "react";

import SignLeftArrowIcon from "../../assets/Login/Sign_left_arrow.svg";
import Button from "../../components/Button";

export default function GuestSignUpPage() {
  // ================= 성별 =================
  const [gender, setGender] = useState<"female" | "male">("female");

  // ================= 아이디 =================
  const usernameRegex = /^[a-zA-Z0-9]{4,15}$/;
  const [username, setUsername] = useState("");

  // ================= 비밀번호 =================
  const passwordRegex =
    /^[a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]{8,15}$/;
  const [password, setPassword] = useState("");

  // ================= 이름 =================
  const nameRegex = /^[가-힣a-zA-Z]{2,20}$/;
  const [name, setName] = useState("");

  // ================= 휴대폰 =================
  const [phone, setPhone] = useState("");

  // ================= 인증번호 =================
  const authCodeRegex = /^\d{6}$/;
  const [authCode, setAuthCode] = useState("");

  // ================= 생년월일 =================
  const [birth, setBirth] = useState("");

  // 인증 성공 여부
  const [isAuthVerified, setIsAuthVerified] = useState(false);

  // 인증 성공 모달
  const [isAuthSuccessModalOpen, setIsAuthSuccessModalOpen] = useState(false);


  // ================= 인증번호 오류 모달 =================
  const [isAuthErrorModalOpen, setIsAuthErrorModalOpen] = useState(false);

  // 임시 인증번호 (나중에 API 연동 시 제거)
  const CORRECT_AUTH_CODE = "123456";

  // ================= 휴대폰 포맷 =================
  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/[^0-9]/g, "").slice(0, 11);

    if (numbers.length < 4) return numbers;
    if (numbers.length < 8) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    }
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7)}`;
  };

  // ================= 생년월일 포맷 =================
  const formatBirthDate = (value: string) => {
    const numbers = value.replace(/[^0-9]/g, "").slice(0, 8);

    if (numbers.length < 5) return numbers;
    if (numbers.length < 7) {
      return `${numbers.slice(0, 4)} / ${numbers.slice(4)}`;
    }
    return `${numbers.slice(0, 4)} / ${numbers.slice(4, 6)} / ${numbers.slice(6)}`;
  };

    // ================= 윤년 체크 =================
    const isLeapYear = (year: number) => {
      if (year % 400 === 0) return true;
      if (year % 100 === 0) return false;
      return year % 4 === 0;
    };

    // ================= 생년월일 유효성 검사 =================
    const isValidBirthDate = (value: string) => {
      const formatted = formatBirthDate(value);
      const match = formatted.match(/^(\d{4}) \/ (\d{2}) \/ (\d{2})$/);
      if (!match) return false;

      const year = Number(match[1]);
      const month = Number(match[2]);
      const day = Number(match[3]);

      // 연도 범위
      if (year < 1900 || year > 2026) return false;

      // 월 범위
      if (month < 1 || month > 12) return false;

      // 월별 일수 (윤년 포함)
      const daysInMonth = [
        31,
        isLeapYear(year) ? 29 : 28,
        31,
        30,
        31,
        30,
        31,
        31,
        30,
        31,
        30,
        31,
      ];

      if (day < 1 || day > daysInMonth[month - 1]) return false;

      return true;
    };

    // ================= 가입 가능 여부 =================
    const isFormValid =
      gender !== undefined &&
      usernameRegex.test(username) &&
      passwordRegex.test(password) &&
      nameRegex.test(name) &&
      phone.replace(/[^0-9]/g, "").length === 11 &&
      isAuthVerified &&             
      isValidBirthDate(birth);


  // ================= 공통 클래스 =================
  const inputClass = (value: string, hasRightArea = false) => `
    w-full
    h-[56px]
    rounded-[8px]
    border
    border-neutrals-04
    px-[16px]
    ${hasRightArea ? "pr-[200px]" : ""}
    ${value === "" ? "pt-[28px] leading-[normal]" : "leading-[56px]"}
    typo-16-regular
    focus:outline-none
  `;

  const guideTextClass = (isValid: boolean) =>
    `absolute right-[12px] top-1/2 -translate-y-1/2 typo-13-regular ${
      isValid ? "text-natural-05" : "text-corals-200"
    }`;

  return (
    <div className="min-h-screen w-full bg-shades-01 px-[24px] pt-[48px] flex flex-col">
      {/* ================= 헤더 ================= */}
      <div className="flex items-center">
        <button className="w-fit flex items-center justify-center">
          <img
            src={SignLeftArrowIcon}
            alt="뒤로가기"
            className="h-[16px] w-[16px]"
          />
        </button>
        <h1 className="ml-[10px] typo-sub-title text-shades-02">
          개인 회원가입
        </h1>
      </div>

      {/* ================= 성별 ================= */}
      <div className="mt-[24px] w-full">
        <p className="mb-[7px] typo-13-regular text-neutrals-07">성별</p>

        <div className="flex gap-[12px]">
          {(["female", "male"] as const).map((type) => {
            const isSelected = gender === type;

            return (
              <button
                key={type}
                type="button"
                onClick={() => setGender(type)}
                className={`
                  flex-1
                  h-[56px]
                  rounded-[8px]
                  border
                  typo-13-regular
                  transition-all
                  duration-200
                  ${
                    isSelected
                      ? "border-primary-01 text-primary-01"
                      : "border-neutrals-04 text-shades-02"
                  }
                `}
              >
                {type === "female" ? "여성" : "남성"}
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= 아이디 ================= */}
      <div className="mt-[14px] relative w-full">
        {username === "" && (
          <span className="absolute top-[10px] left-[16px] typo-13-regular text-neutrals-07 pointer-events-none">
            아이디 [4~15자, 영문, 숫자]
          </span>
        )}
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={inputClass(username, true)}
        />
        {username !== "" && (
          <span className={guideTextClass(usernameRegex.test(username))}>
            {usernameRegex.test(username)
              ? "사용 가능한 아이디입니다."
              : "아이디를 다시 설정해주세요."}
          </span>
        )}
      </div>

      {/* ================= 비밀번호 ================= */}
      <div className="mt-[14px] relative w-full">
        {password === "" && (
          <span className="absolute top-[10px] left-[16px] typo-13-regular text-neutrals-07 pointer-events-none">
            비밀번호 [8~15자의 영문/숫자 또는 특수문자 조합]
          </span>
        )}
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputClass(password)}
        />
        {password !== "" && (
          <span className={guideTextClass(passwordRegex.test(password))}>
            {passwordRegex.test(password)
              ? "사용 가능한 비밀번호입니다."
              : "비밀번호를 다시 설정해주세요."}
          </span>
        )}
      </div>

      {/* ================= 이름 ================= */}
      <div className="mt-[14px] relative w-full">
        {name === "" && (
          <span className="absolute top-[10px] left-[16px] typo-13-regular text-neutrals-07 pointer-events-none">
            이름
          </span>
        )}
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass(name)}
        />
      </div>

      {/* ================= 휴대폰 ================= */}
      <div className="mt-[14px] relative w-full">
        {phone === "" && (
          <span className="absolute top-[10px] left-[16px] typo-13-regular text-neutrals-07 pointer-events-none">
            휴대폰 ['-' 없이 입력하세요.]
          </span>
        )}

        <input
          type="tel"
          value={formatPhoneNumber(phone)}
          onChange={(e) => {
            const onlyNumber = e.target.value.replace(/[^0-9]/g, "");
            if (onlyNumber.length > 11) return;
            setPhone(e.target.value);
          }}
          className={inputClass(phone, true)}
        />

        <button
          type="button"
          disabled={phone.replace(/[^0-9]/g, "").length !== 11}
          className={`
            absolute
            right-[12px]
            top-1/2
            -translate-y-1/2
            w-[105px]
            h-[32px]
            rounded-[6px]
            typo-14-medium
            border
            ${
              phone.replace(/[^0-9]/g, "").length === 11
                ? "bg-primary-01 text-corals-000"
                : "border-primary-01 text-primary-01 cursor-not-allowed"
            }
          `}
        >
          인증번호 요청
        </button>
      </div>

      {/* ================= 인증번호 ================= */}
      <div className="mt-[14px] relative w-full">
        {authCode === "" && (
          <span className="absolute top-[10px] left-[16px] typo-13-regular text-neutrals-07 pointer-events-none">
            인증번호
          </span>
        )}

        <input
          type="tel"
          value={authCode}
          onChange={(e) => {
            const onlyNumber = e.target.value.replace(/[^0-9]/g, "");
            if (onlyNumber.length > 6) return;
            setAuthCode(onlyNumber);
          }}
          className={inputClass(authCode, true)}
        />

        <button
          type="button"
          disabled={authCodeRegex.test(authCode) === false}
          onClick={() => {
            if (authCode !== CORRECT_AUTH_CODE) {
              setIsAuthErrorModalOpen(true);
            } else {
               setIsAuthSuccessModalOpen(true);
            }
          }}
          className={`
            absolute
            right-[12px]
            top-1/2
            -translate-y-1/2
            w-[105px]
            h-[32px]
            rounded-[6px]
            typo-14-medium
            border
            ${
              authCodeRegex.test(authCode)
                ? "bg-primary-01 text-corals-000"
                : "border-primary-01 text-primary-01 cursor-not-allowed"
            }
          `}
        >
          확인
        </button>
      </div>

      {/* ================= 생년월일 ================= */}
      <div className="mt-[14px] relative w-full">
        {birth === "" && (
          <span className="absolute top-[10px] left-[16px] typo-13-regular text-neutrals-07 pointer-events-none">
            생년월일 (YYYYMMDD)
          </span>
        )}

      <input
        type="tel"
        value={formatBirthDate(birth)}
        onChange={(e) => {
          const onlyNumber = e.target.value.replace(/[^0-9]/g, "");
          if (onlyNumber.length > 8) return;
          setBirth(onlyNumber);
        }}
        className={inputClass(birth)}
      />

      {birth !== "" && (
        <span className={guideTextClass(isValidBirthDate(birth))}>
          {isValidBirthDate(birth)
            ? "올바른 생년월일입니다."
            : "생년월일을 다시 입력해주세요."}
        </span>
      )}


      </div>

      <Button
        className="mt-auto mb-[24px]"
        disabled={!isFormValid}
      >
        가입하기
      </Button>


    {/* ================= 인증번호 성공 모달 ================= */}
    {isAuthSuccessModalOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="w-[320px] rounded-[8px] bg-white overflow-hidden">
          <div className="px-[24px] py-[32px] text-center">
            <p className="typo-13-regular text-black">
              인증이 완료되었습니다.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setIsAuthVerified(true);     
              setIsAuthSuccessModalOpen(false);
            }}
            className="w-full h-[52px] border-t border-neutrals-04 typo-16-medium text-primary-01"
          >
            확인
          </button>
        </div>
      </div>
    )}


      {/* ================= 인증번호 오류 모달 ================= */}
      {isAuthErrorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-[320px] rounded-[8px] bg-white overflow-hidden">
            <div className="px-[24px] py-[32px] text-center">
              <p className="typo-13-regular text-black">
                수신된 인증번호를 다시 확인 해주세요.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsAuthErrorModalOpen(false)}
              className="w-full h-[52px] border-t border-neutrals-04 typo-16-medium text-primary-01"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
