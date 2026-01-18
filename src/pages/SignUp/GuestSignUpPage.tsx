import SignLeftArrowIcon from "../../assets/Login/Sign_left_arrow.svg";
import RadioCheckedIcon from "../../assets/Login/radio_checked.svg";
import RadioUncheckedIcon from "../../assets/Login/radio_unchecked.svg";

import Button from "../../components/Button";
import { useState } from "react";

export default function GuestSignUpPage() {
  const [nationality, setNationality] =
    useState<"domestic" | "foreign">("domestic");

  // 아이디
  const usernameRegex = /^[a-zA-Z0-9]{4,15}$/;
  const [username, setUsername] = useState("");

  // 비밀번호
  const passwordRegex =
    /^[a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]{8,15}$/;
  const [password, setPassword] = useState("");

  // 이름
  const nameRegex = /^[가-힣a-zA-Z]{2,20}$/;
  const [name, setName] = useState("");

  // 휴대폰 
  const [phone, setPhone] = useState("");

  // 인증번호
  const authCodeRegex = /^\d{6}$/;
  const [authCode, setAuthCode] = useState("");

  //휴대폰 포맷 함수
  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/[^0-9]/g, "").slice(0, 11);

    if (numbers.length < 4) return numbers;
    if (numbers.length < 8) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    }
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7)}`;
  };

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
      {/* 헤더 */}
      <div className="flex flex-row">
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

      {/* 국적 */}
      <div className="mt-[24px] w-full h-[60px] rounded-[8px] bg-[#F4F4F4] flex items-center justify-center gap-[40px]">
        {(["domestic", "foreign"] as const).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setNationality(type)}
            className="flex items-center gap-[8px]"
          >
            <img
              src={
                nationality === type
                  ? RadioCheckedIcon
                  : RadioUncheckedIcon
              }
              className="w-[20px] h-[20px]"
              alt={type}
            />
            <span className="typo-16-bold">
              {type === "domestic" ? "내국인" : "외국인"}
            </span>
          </button>
        ))}
      </div>

      {/* 아이디 */}
      <div className="mt-[23px] relative w-full">
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

      {/* 비밀번호 */}
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

      {/* 이름 */}
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

        {/* 휴대폰 */}
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

        {/* 인증번호 요청 버튼 */}
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
            px-[12px]
            rounded-[6px]
            typo-14-medium
            border
            ${
                phone.replace(/[^0-9]/g, "").length === 11
                ? "bg-primary-01 text-corals-000 cursor-pointer"
                : "border-primary-01 text-primary-01 cursor-not-allowed"
            }
            `}
        >
            인증번호 요청 
        </button>
        </div>



        {/* 인증번호 */}
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

        {/* 확인 버튼 */}
        <button
            type="button"
            disabled={authCode.replace(/[^0-9]/g, "").length !== 6}
            className={`
            absolute
            right-[12px]
            top-1/2
            -translate-y-1/2
            w-[105px]
            h-[32px]
            px-[12px]
            rounded-[6px]
            typo-14-medium
            border
            ${
                authCode.replace(/[^0-9]/g, "").length === 6
                ? "bg-primary-01 text-corals-000 cursor-pointer"
                : "border-primary-01 text-primary-01 cursor-not-allowed"
            }
            `}
        >
            확인
        </button>
        </div>


      <Button className="mt-auto mb-[24px]">가입하기</Button>
    </div>
  );
}
