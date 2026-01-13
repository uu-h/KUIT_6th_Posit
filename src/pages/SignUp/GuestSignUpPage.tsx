import SignLeftArrowIcon from "../../../public/Sign_left_arrow.svg";


import { useState } from "react";

export default function GuestSignUpPage() {
    
const usernameRegex = /^[a-zA-Z0-9]{4,15}$/;

//아이디
const [nationality, setNationality] = useState<"domestic" | "foreign">("domestic");
const [username, setUsername] = useState("");
const [isValid, setIsValid] = useState(true);

//비밀번호
const passwordRegex = /^[a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]{8,15}$/;
const [password, setPassword] = useState("");
const [isPasswordValid, setIsPasswordValid] = useState(true);

//이름
const nameRegex = /^[가-힣a-zA-Z]{2,20}$/;
const [name, setName] = useState("");
const [isNameValid, setIsNameValid] = useState(true);

//휴대폰
const phoneRegex = /^010\d{7,8}$/;
const [phone, setPhone] = useState("");
const [isPhoneValid, setIsPhoneValid] = useState(true);

//인증번호
const authCodeRegex = /^\d{6}$/; //일단 6자리로 해놓음
const [authCode, setAuthCode] = useState("");
const [isAuthCodeValid, setIsAuthCodeValid] = useState(true);


return (
    <div className="min-h-screen w-full bg-shades-01 px-[24px] pt-[48px] flex flex-col">
    
       {/* 상단 헤더 */}
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

        {/*국적 선택*/}
        <div
        className="
            mt-[24px]
            w-full
            h-[60px]
            rounded-[8px]
            bg-[#F4F4F4]
            flex items-center justify-center
            gap-[40px]
        "
        >
        <button
            type="button"
            onClick={() => setNationality("domestic")}
            className="flex items-center gap-[8px]"
        >
            <img
            src={
                nationality === "domestic"
                ? "/radio_checked.svg"
                : "/radio_unchecked.svg"
            }
            className="w-[20px] h-[20px]"
            alt="내국인 선택"
            />
            <span
            className={"typo-16-bold"}
            >
            내국인
            </span>
        </button>

        <button
            type="button"
            onClick={() => setNationality("foreign")}
            className="flex items-center gap-[8px]"
        >
            <img
            src={
                nationality === "foreign"
                ? "/radio_checked.svg"
                : "/radio_unchecked.svg"
            }
            className="w-[20px] h-[20px]"
            alt="외국인 선택"
            />
            <span
            className={"typo-16-bold"}
            >
            외국인
            </span>
        </button>
        </div>
        
        {/*아이디*/}
        <div className="mt-[23px] relative w-full">
        <span
            className="
            absolute
            top-[10px]
            left-[16px]
            typo-13-regular
            text-neutrals-07
            pointer-events-none
            "
         >
         아이디 [4~15자, 영문, 숫자]
        </span>

        <input
            type="text"
            value={username}
            onChange={(e) => {
                const value = e.target.value;
                setUsername(value);
                setIsValid(usernameRegex.test(value) || value === "");
         }}
         className="
             w-full
             h-[56px]
             rounded-[8px]
             border
             border-neutrals-04
             px-[16px]
             pt-[28px]
             typo-16-regular
             focus:outline-none
            "
        />
        </div>

        {/*비밀번호*/}
        <div className="mt-[14px] relative w-full">
        <span
            className="
            absolute
            top-[10px]
            left-[16px]
            typo-13-regular
            text-neutrals-07
            pointer-events-none
            "
         >
         비밀번호 [8~15자의 영문/숫자 또는 특수문자 조합]
        </span>

        <input
            type="password"
            value={password}
            onChange={(e) => {
                const value = e.target.value;
                setPassword(value);
                setIsPasswordValid(passwordRegex.test(value) || value === "");
        }}
         className="
             w-full
             h-[56px]
             rounded-[8px]
             border
             border-neutrals-04
             px-[16px]
             pt-[28px]
             typo-16-regular
             focus:outline-none
            "
        />
        </div>

        {/*이름*/}
        <div className="mt-[14px] relative w-full">
        <span
            className="
            absolute
            top-[10px]
            left-[16px]
            typo-13-regular
            text-neutrals-07
            pointer-events-none
            "
         >
         이름
        </span>

        <input
            type="text"
            value={name}
            onChange={(e) => {
                const value = e.target.value;
                setName(value);
                setIsNameValid(nameRegex.test(value) || value === "");
        }}
         className="
             w-full
             h-[56px]
             rounded-[8px]
             border
             border-neutrals-04
             px-[16px]
             pt-[28px]
             typo-16-regular
             focus:outline-none
            "
        />
        </div>

        {/*휴대폰*/}
        <div className="mt-[14px] relative w-full">
        <span
            className="
            absolute
            top-[10px]
            left-[16px]
            typo-13-regular
            text-neutrals-07
            pointer-events-none
            "
         >
         휴대폰 ['-' 없이 입력하세요.]
        </span>

        <input
            type="tel"
            value={phone}
            onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, "");
                if (value.length > 11) return;
                setPhone(value);
                setIsPhoneValid(phoneRegex.test(value) || value === "");
        }}
         className="
             w-full
             h-[56px]
             rounded-[8px]
             border
             border-neutrals-04
             pl-[16px]
             pr-[120px]
             pt-[28px]
             typo-16-regular
             focus:outline-none
            "
        />

        {/* 인증번호 요청 버튼 */}
        <button
            type="button"
            disabled={!isPhoneValid || phone.length < 10}
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
                isPhoneValid && phone.length >= 10
                ? "border-primary-01 text-primary-01 cursor-pointer"
                : "border-neutrals-05 text-neutrals-05 cursor-not-allowed"
            }
    `       }
        >
            인증번호 요청
        </button>
        </div>

        {/*인증번호*/}
        <div className="mt-[14px] relative w-full">
        <span
            className="
            absolute
            top-[10px]
            left-[16px]
            typo-13-regular
            text-neutrals-07
            pointer-events-none
            "
         >
         인증번호
        </span>

        <input
            type="tel"
            value={authCode}
            onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, "");
                if (value.length > 6) return;
                setAuthCode(value);
                setIsAuthCodeValid(authCodeRegex.test(value) || value === "");
        }}
         className="
             w-full
             h-[56px]
             rounded-[8px]
             border
             border-neutrals-04
             pl-[16px]
             pr-[120px]
             pt-[28px]
             typo-16-regular
             focus:outline-none
            "
        />

        <button
            type="button"
            disabled={!authCodeRegex.test(authCode)}
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
                authCodeRegex.test(authCode)
                ? "border-primary-01 text-primary-01 cursor-pointer"
                : "border-neutrals-05 text-neutrals-05 cursor-not-allowed"
            }
            `}
        >
            확인
        </button>
        </div>

        {/* 가입하기 */}
        <button
            className="     
            mt-auto
            mb-[24px]
            w-full
            h-[51px]
            rounded-[8px]
            bg-primary-01
            flex items-center justify-center
            text-shades-01
            typo-16-bold
            "
        >
            가입하기
        </button>


    {/*인증번호 요청/확인 버튼 숫자 모두 입력해야 활성화 되도록 구현해놓음*/}

    
    
    </div>
    )

}