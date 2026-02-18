import { useState } from "react";
import { useNavigate } from "react-router-dom";

import SignLeftArrowIcon from "../../assets/Login/Sign_left_arrow.svg";
import Button from "../../components/Button";
import EyeOnIcon from "../../assets/Login/eye_on.svg";
import EyeOffIcon from "../../assets/Login/eye_off.svg";

import {
  requestPhoneVerification,
  confirmPhoneVerification,
} from "../../api/phoneVerification";

import { signup } from "../../api/auth";
import { normalizeApiError, toFieldErrorMap } from "../../api/apiError";
import { emitToast } from "../../utils/toastBus";

export default function GuestSignUpPage() {
  const navigate = useNavigate();

  // 에러 분기
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [authErrorMessage, setAuthErrorMessage] = useState<string | null>(null);

  const clearFieldError = (key: string) => {
    setFieldErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };
  // 아이디
  const loginIdServerError = fieldErrors["loginId"];
  // 비밀번호
  const passwordServerError = fieldErrors["password"];

  // ================= 성별 =================
  const [gender, setGender] = useState<"female" | "male">("female");

  // ================= 아이디 =================
  const usernameRegex = /^[a-zA-Z0-9]{4,15}$/;
  const [username, setUsername] = useState("");

  // ================= 비밀번호 =================
  const passwordRegex = /^[a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]{8,15}$/;
  const [password, setPassword] = useState("");

  //비밀번호 보이기/숨기기
  const [showPassword, setShowPassword] = useState(false);

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

  // signupToken
  const [signupToken, setSignupToken] = useState<string | undefined>(undefined);

  // 인증 성공 모달
  const [isAuthSuccessModalOpen, setIsAuthSuccessModalOpen] = useState(false);

  // ================= 인증번호 오류 모달 =================
  const [isAuthErrorModalOpen, setIsAuthErrorModalOpen] = useState(false);

  // ================= 인증 API 상태 =================
  const [verificationId, setVerificationId] = useState<number | null>(null);
  const [isRequestingAuth, setIsRequestingAuth] = useState(false);
  const [isVerifyingAuth, setIsVerifyingAuth] = useState(false);

  // ================= 인증번호 요청 함수 =================
  const handleRequestAuthCode = async () => {
    try {
      setIsRequestingAuth(true);

      const res = await requestPhoneVerification({
        phone: phone.replace(/[^0-9]/g, ""),
      });

      // 성공
      if (res.isSuccess) {
        setVerificationId(res.data.verificationId);
        alert("인증번호가 전송되었습니다.");
        return;
      }

      // 서버 응답은 왔지만 실패한 경우
      emitToast({
        message: "인증번호 요청에 실패했습니다.",
      });
    } catch (error: any) {
      // axios 에러 처리 (http.ts 기준)
      const e = normalizeApiError(error);

      if (e.code === 40301) {
        emitToast({
          message: "인증 요청 횟수를 초과했습니다.\n잠시 후 다시 시도해주세요.",
        });
        return;
      }

      if (e.errors?.length) {
        setFieldErrors((prev) => ({ ...prev, ...toFieldErrorMap(e.errors) }));
        return;
      }

      emitToast({
        message: e.message ?? "인증번호 요청 중 오류가 발생했습니다.",
      });
    } finally {
      setIsRequestingAuth(false);
    }
  };

  // ================= 인증번호 확인 함수 =================
  const handleConfirmAuthCode = async () => {
    if (!verificationId) {
      emitToast({ message: "인증번호 요청을 먼저 해주세요." });
      return;
    }

    try {
      setIsVerifyingAuth(true);

      const res = await confirmPhoneVerification({
        verificationId,
        phone: phone.replace(/[^0-9]/g, ""),
        code: authCode,
      });

      if (res.isSuccess && res.data.verified) {
        setSignupToken(res.data.signupToken ?? undefined);
        setIsAuthSuccessModalOpen(true);
        return;
      }

      // res는 왔는데 verified=false 같은 케이스 (서버가 message를 안 준다면 fallback)
      setAuthErrorMessage("인증에 실패했습니다. 다시 시도해주세요.");
      setIsAuthErrorModalOpen(true);
    } catch (err: any) {
      const e = normalizeApiError(err);

      // DTO validation -> fieldErrors로 (input아래)
      if (e.errors?.length) {
        setFieldErrors((prev) => ({ ...prev, ...toFieldErrorMap(e.errors) }));
        return;
      }

      // 커스텀/기타 -> 서버 message를 모달로
      setAuthErrorMessage(
        e.message ?? "인증에 실패했습니다. 다시 시도해주세요.",
      );
      setIsAuthErrorModalOpen(true);
      return;
    } finally {
      setIsVerifyingAuth(false);
    }
  };

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

  // ================= 가입하기 핸들러 =================
  const handleSignup = async () => {
    try {
      setFormError(null);
      setFieldErrors({});

      const res = await signup({
        role: "GUEST",
        loginId: username,
        password,
        name,
        phone: phone.replace(/[^0-9]/g, ""),
        gender: gender === "male" ? "MALE" : "FEMALE",
        birth: birth
          .replace(/[^0-9]/g, "")
          .replace(/^(\d{4})(\d{2})(\d{2})$/, "$1-$2-$3"),
        signupToken: signupToken ?? "TEMP_TOKEN",
      });

      if (res.isSuccess) {
        const { accessToken, refreshToken } = res.data.tokens;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        alert("회원가입이 완료되었습니다.");
        navigate("/");
      }
    } catch (err: any) {
      const e = normalizeApiError(err);

      // 1) DTO validation 에러 우선
      if (e.errors && e.errors.length > 0) {
        setFieldErrors(toFieldErrorMap(e.errors));
        setFormError("입력값을 다시 확인해주세요.");
        return;
      }

      // 2) 커스텀 에러코드 분기
      switch (e.errorCode) {
        case "DUPLICATE_LOGIN_ID":
          setIsUsernameAvailable(false);
          setFieldErrors((prev) => ({
            ...prev,
            loginId: "이미 사용 중인 아이디입니다.",
          }));
          return;

        case "DUPLICATE_PHONE":
          setFieldErrors((prev) => ({
            ...prev,
            phone: "이미 가입된 휴대폰 번호입니다.",
          }));
          return;

        case "PHONE_VERIFICATION_REQUIRED":
          setFormError("휴대폰 인증을 먼저 완료해주세요.");
          return;

        default:
          setFormError(e.message ?? "회원가입에 실패했습니다.");
          return;
      }
    }
  };

  //아이디 중복 확인
  const [isUsernameAvailable, setIsUsernameAvailable] = useState<
    boolean | null
  >(null);

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
  // ================= 아이디, 비밀번호 입력칸  =================
  const authInputClass = (
    value: string,
    isValid: boolean,
    hasRightArea = false,
  ) => `
    w-full
    h-[56px]
    rounded-[8px]
    border
    px-[16px]
    ${hasRightArea ? "pr-[200px]" : "pr-[48px]"}
    ${value === "" ? "pt-[28px] leading-[normal]" : "leading-[56px]"}
    typo-16-regular
    focus:outline-none
    ${
      value === ""
        ? "border-neutrals-04"
        : isValid
          ? "border-neutrals-04"
          : "border-[#F00]"
    }
  `;

  const guideTextClass = (isValid: boolean) =>
    `absolute right-[12px] top-1/2 -translate-y-1/2 typo-13-regular ${
      isValid ? "text-natural-05" : "text-corals-200"
    }`;

  return (
    <div className="min-h-screen w-full bg-shades-01 px-[24px] pt-[48px] flex flex-col">
      {/* ================= 헤더 ================= */}
      <div className="flex items-center">
        <button
          className="w-fit flex items-center justify-center"
          onClick={() => navigate(-1)}
        >
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
      <div
        className={`w-full ${
          username !== "" &&
          (!usernameRegex.test(username) || isUsernameAvailable === false)
            ? "mt-[14px] mb-[7px]"
            : "mt-[14px]"
        }`}
      >
        <div className="relative w-full">
          {username === "" && (
            <span className="absolute top-[14px] left-[16px] typo-13-regular text-neutrals-07 pointer-events-none">
              아이디 [4~15자, 영문, 숫자]
            </span>
          )}

          <input
            type="text"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setIsUsernameAvailable(null);
              clearFieldError("loginId"); // 서버 field 확인
            }}
            className={authInputClass(
              username,
              usernameRegex.test(username) && isUsernameAvailable !== false,
            )}
          />
        </div>

        {/* 안내 문구 */}
        {username !== "" &&
          (!usernameRegex.test(username) ||
            isUsernameAvailable === false ||
            !!loginIdServerError) && (
            <p className="mt-[6px] typo-12-regular text-primary-01">
              {!usernameRegex.test(username)
                ? "아이디를 다시 설정해주세요."
                : (loginIdServerError ?? "이미 사용 중인 아이디입니다.")}
            </p>
          )}
      </div>

      {/* ================= 비밀번호 ================= */}
      <div
        className={`w-full ${
          password !== "" && !passwordRegex.test(password)
            ? "mt-[14px] mb-[7px]"
            : "mt-[14px]"
        }`}
      >
        <div className="relative w-full">
          {password === "" && (
            <span className="absolute top-[14px] left-[16px] right-[48px] typo-13-regular text-neutrals-07 pointer-events-none">
              비밀번호 [8~15자의 영문/숫자 또는 특수문자 조합]
            </span>
          )}

          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              clearFieldError("password");
            }}
            className={authInputClass(password, passwordRegex.test(password))}
          />

          {/* 눈 아이콘 */}
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute top-1/2 right-[16px] -translate-y-1/2"
          >
            <img
              src={showPassword ? EyeOnIcon : EyeOffIcon}
              alt="비밀번호 토글"
              className="w-[20px] h-[20px]"
            />
          </button>
        </div>

        {/* 안내 문구 */}
        {password !== "" &&
          (!passwordRegex.test(password) || !!passwordServerError) && (
            <p className="mt-[6px] typo-12-regular text-primary-01">
              {!passwordRegex.test(password)
                ? "비밀번호를 다시 설정해주세요."
                : passwordServerError}
            </p>
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
          onChange={(e) => {
            setName(e.target.value);
            clearFieldError("name");
          }}
          className={inputClass(name)}
        />
        {/* 안내문구 */}
        {fieldErrors["name"] && (
          <p className="mt-[6px] typo-12-regular text-primary-01">
            {fieldErrors["name"]}
          </p>
        )}
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
            clearFieldError("phone");
          }}
          className={inputClass(phone, true)}
        />

        <button
          type="button"
          disabled={
            phone.replace(/[^0-9]/g, "").length !== 11 || isRequestingAuth
          }
          onClick={handleRequestAuthCode}
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
        {/* 안내문구 */}
        {fieldErrors["phone"] && (
          <p className="mt-[6px] typo-12-regular text-primary-01">
            {fieldErrors["phone"]}
          </p>
        )}
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
            setFieldErrors((prev) => {
              const next = { ...prev };
              delete next["code"];
              return next;
            });
          }}
          className={inputClass(authCode, true)}
        />
        <button
          type="button"
          disabled={!authCodeRegex.test(authCode) || isVerifyingAuth}
          onClick={handleConfirmAuthCode}
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
        {fieldErrors["code"] && (
          <p className="mt-[6px] typo-12-regular text-primary-01">
            {fieldErrors["code"]}
          </p>
        )}
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
            clearFieldError("birth");
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
        {fieldErrors["birth"] && (
          <p className="mt-[6px] typo-12-regular text-primary-01">
            {fieldErrors["birth"]}
          </p>
        )}
      </div>

      {/* 폼 전체 에러 */}
      {formError && (
        <p className="mt-[12px] typo-12-regular text-primary-01">{formError}</p>
      )}
      <Button
        className="mt-auto mb-[24px]"
        disabled={!isFormValid}
        onClick={handleSignup}
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
              <p className="typo-13-regular text-black whitespace-pre-line">
                {authErrorMessage ?? "인증에 실패했습니다. 다시 시도해주세요."}
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsAuthErrorModalOpen(false);
                setAuthErrorMessage(null);
              }}
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
