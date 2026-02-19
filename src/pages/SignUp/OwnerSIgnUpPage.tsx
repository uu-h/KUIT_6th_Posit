import SignLeftArrowIcon from "../../assets/Login/Sign_left_arrow.svg";
import Button from "../../components/Button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import EyeOnIcon from "../../assets/Login/eye_on.svg";
import EyeOffIcon from "../../assets/Login/eye_off.svg";

import {
  requestPhoneVerification,
  confirmPhoneVerification,
} from "../../api/phoneVerification";

import { signup } from "../../api/auth";
import { checkLoginId } from "../../api/auth";

import { normalizeApiError, toFieldErrorMap } from "../../api/apiError";
import { emitToast } from "../../utils/toastBus";

export default function OwnerSignUpPage() {
  const navigate = useNavigate();

  // ================= 에러 분기 =================
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

  const loginIdServerError = fieldErrors["loginId"];
  const passwordServerError = fieldErrors["password"];

  // ================= 아이디 =================
  const usernameRegex = /^[a-zA-Z0-9]{4,15}$/;
  const [username, setUsername] = useState("");

  const [isUsernameAvailable, setIsUsernameAvailable] = useState<boolean | null>(null);
  const [isIdModalOpen, setIsIdModalOpen] = useState(false);
  const [idModalMessage, setIdModalMessage] = useState("");

  //중복확인 함수
  const handleCheckUsername = async () => {
    if (!usernameRegex.test(username)) {
      setIdModalMessage("아이디 형식을 다시 확인해주세요.");
      setIsIdModalOpen(true);
      return;
    }

    try {
      const isAvailable = await checkLoginId(username);

      setIsUsernameAvailable(isAvailable);

      if (isAvailable) {
        setIdModalMessage("사용 가능한 아이디입니다.");
      } else {
        setIdModalMessage("이미 사용 중인 아이디입니다.");
      }

      setIsIdModalOpen(true);
    } catch (error) {
      setIdModalMessage("아이디 중복 확인 중 오류가 발생했습니다.");
      setIsIdModalOpen(true);
    }
  };

  // ================= 비밀번호 =================
  const passwordRegex = /^[a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]{8,15}$/;
  const [password, setPassword] = useState("");

  // 비밀번호 보이기/숨기기
  const [showPassword, setShowPassword] = useState(false);

  // ================= 이름 =================
  const nameRegex = /^[가-힣a-zA-Z]{2,20}$/;
  const [name, setName] = useState("");

  // ================= 휴대폰 =================
  const [phone, setPhone] = useState("");

  // ================= 인증번호 =================
  const authCodeRegex = /^\d{6}$/;
  const [authCode, setAuthCode] = useState("");

  // ================= 인증 성공 여부 =================
  const [isAuthVerified, setIsAuthVerified] = useState(false);

  // ================= signupToken =================
  const [signupToken, setSignupToken] = useState<string | undefined>(undefined);

  // ================= 인증 모달 =================
  const [isAuthErrorModalOpen, setIsAuthErrorModalOpen] = useState(false);
  const [isAuthSuccessModalOpen, setIsAuthSuccessModalOpen] = useState(false);

  // ================= 인증 API 상태 =================
  const [verificationId, setVerificationId] = useState<number | null>(null);
  const [isRequestingAuth, setIsRequestingAuth] = useState(false);
  const [isVerifyingAuth, setIsVerifyingAuth] = useState(false);

  // ================= 사업자번호 =================
  const businessNumberRegex = /^\d{10}$/;
  const [businessNumber, setBusinessNumber] = useState("");
  const [isBusinessModalOpen, setIsBusinessModalOpen] = useState(false);

  // ================= 쿠폰 비밀번호(4자리) =================
  const couponPasswordRegex = /^\d{4}$/;
  const [couponPassword, setCouponPassword] = useState("");
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);

  // ================= 휴대폰 포맷 =================
  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/[^0-9]/g, "").slice(0, 11);
    if (numbers.length < 4) return numbers;
    if (numbers.length < 8) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7)}`;
  };

  // ================= 사업자번호 포맷 =================
  const formatBusinessNumber = (value: string) => {
    const numbers = value.replace(/[^0-9]/g, "").slice(0, 10);
    if (numbers.length < 4) return numbers;
    if (numbers.length < 6) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 5)}-${numbers.slice(5)}`;
  };

  // ================= 가입 가능 여부 =================
  const isFormValid =
    usernameRegex.test(username) &&
    isUsernameAvailable === true &&
    passwordRegex.test(password) &&
    nameRegex.test(name) &&
    phone.replace(/[^0-9]/g, "").length === 11 &&
    isAuthVerified &&
    businessNumberRegex.test(businessNumber.replace(/[^0-9]/g, "")) &&
    couponPasswordRegex.test(couponPassword);

  // ================= 인증번호 요청 =================
  const handleRequestAuthCode = async () => {
    try {
      setIsRequestingAuth(true);

      const res = await requestPhoneVerification({
        phone: phone.replace(/[^0-9]/g, ""),
      });

      if (res.isSuccess) {
        setVerificationId(res.data.verificationId);
        alert("인증번호가 전송되었습니다.");
        return;
      }

      emitToast({ message: "인증번호 요청에 실패했습니다." });
    } catch (err: any) {
      const e = normalizeApiError(err);

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

  // ================= 인증번호 확인 =================
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

      setAuthErrorMessage("인증에 실패했습니다. 다시 시도해주세요.");
      setIsAuthErrorModalOpen(true);
    } catch (err: any) {
      const e = normalizeApiError(err);

      // DTO validation -> input 아래
      if (e.errors?.length) {
        setFieldErrors((prev) => ({ ...prev, ...toFieldErrorMap(e.errors) }));
        return;
      }

      // 커스텀/기타 -> 서버 message 모달
      setAuthErrorMessage(
        e.message ?? "인증에 실패했습니다. 다시 시도해주세요.",
      );
      setIsAuthErrorModalOpen(true);
    } finally {
      setIsVerifyingAuth(false);
    }
  };

  // ================= 사장님 회원가입 =================
  const handleSignup = async () => {
    try {
      setFormError(null);
      setFieldErrors({});

      if (!isAuthVerified) {
        setFormError("휴대폰 인증을 먼저 완료해주세요.");
        return;
      }

      const res = await signup({
        role: "OWNER",
        loginId: username,
        password,
        name,
        phone: phone.replace(/[^0-9]/g, ""),
        gender: "MALE",
        birth: "1900-01-01",
        signupToken: signupToken ?? "TEMP_TOKEN",
        ownerProfile: {
          businessNumber: businessNumber.replace(/[^0-9]/g, ""),
          couponPin: couponPassword,
        },
      } as any);

      if (res.isSuccess) {
        const { accessToken, refreshToken } = res.data.tokens;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        emitToast({ message: "사장님 회원가입이 완료되었습니다." });
        navigate("/owner/signup-complete", {
          state: { couponPin: couponPassword },
        });
      }
    } catch (err: any) {
      const e = normalizeApiError(err);

      // 1) DTO validation
      if (e.errors?.length) {
        setFieldErrors(toFieldErrorMap(e.errors));
        setFormError("입력값을 다시 확인해주세요.");
        return;
      }

      // 2) 커스텀 분기
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

  // ================= 아이디/비밀번호 클래스 =================
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

  return (
    <div className="min-h-screen w-full bg-shades-01 px-[24px] pt-[48px] flex flex-col">
      {/* 헤더 */}
      <div className="flex flex-row items-center mb-[20px]">
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
          사장님 회원가입
        </h1>
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
              setIsUsernameAvailable(null); // 아이디 변경 시 다시 확인 필요
            }}
            className={authInputClass(
              username,
              usernameRegex.test(username) && isUsernameAvailable !== false,
              true 
            )}
          />

          {/* 중복확인 버튼 */}
          <button
            type="button"
            onClick={handleCheckUsername}
            disabled={!usernameRegex.test(username)}
            className={`
              absolute right-[12px] top-1/2 -translate-y-1/2
              w-[105px] h-[32px] rounded-[6px]
              typo-14-medium border
              ${
                usernameRegex.test(username)
                  ? "bg-primary-01 text-corals-000 cursor-pointer"
                  : "border-primary-01 text-primary-01 cursor-not-allowed"
              }
            `}
          >
            중복확인
          </button>
        </div>

        {/* 안내 문구 */}
        {username !== "" &&
          (!usernameRegex.test(username) || isUsernameAvailable === false) && (
            <p className="mt-[6px] typo-12-regular text-[#F00]">
              {!usernameRegex.test(username)
                ? "아이디를 다시 설정해주세요."
                : "이미 사용 중인 아이디입니다."}
            </p>
          )}
      </div>

      {/* ================= 비밀번호 ================= */}
      <div
        className={`w-full ${
          password !== "" &&
          (!passwordRegex.test(password) || !!passwordServerError)
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
            휴대폰
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
            absolute right-[12px] top-1/2 -translate-y-1/2
            w-[105px] h-[32px] px-[12px] rounded-[6px]
            typo-14-medium border
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
      {fieldErrors["phone"] && (
        <p className="mt-[6px] typo-12-regular text-primary-01">
          {fieldErrors["phone"]}
        </p>
      )}

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
            clearFieldError("code");
          }}
          className={inputClass(authCode, true)}
        />
        <button
          type="button"
          disabled={!authCodeRegex.test(authCode) || isVerifyingAuth}
          onClick={handleConfirmAuthCode}
          className={`
            absolute right-[12px] top-1/2 -translate-y-1/2
            w-[105px] h-[32px] px-[12px] rounded-[6px]
            typo-14-medium border
            ${
              authCodeRegex.test(authCode)
                ? "bg-primary-01 text-corals-000 cursor-pointer"
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

      {/* ================= 사업자번호 ================= */}
      <div className="mt-[14px] relative w-full">
        {businessNumber === "" && (
          <span className="absolute top-[10px] left-[16px] typo-13-regular text-neutrals-07 pointer-events-none">
            사업자번호
          </span>
        )}
        <input
          type="tel"
          value={formatBusinessNumber(businessNumber)}
          onChange={(e) => {
            const onlyNumber = e.target.value.replace(/[^0-9]/g, "");
            if (onlyNumber.length > 10) return;
            setBusinessNumber(e.target.value);
            clearFieldError("businessNumber");
          }}
          className={inputClass(businessNumber, true)}
        />
        <button
          type="button"
          disabled={
            !businessNumberRegex.test(businessNumber.replace(/[^0-9]/g, ""))
          }
          onClick={() => setIsBusinessModalOpen(true)}
          className={`
            absolute right-[12px] top-1/2 -translate-y-1/2
            w-[105px] h-[32px] px-[12px] rounded-[6px]
            typo-14-medium border
            ${
              businessNumberRegex.test(businessNumber.replace(/[^0-9]/g, ""))
                ? "bg-primary-01 text-corals-000 cursor-pointer"
                : "border-primary-01 text-primary-01 cursor-not-allowed"
            }
          `}
        >
          확인
        </button>

        {fieldErrors["businessNumber"] && (
          <p className="mt-[6px] typo-12-regular text-primary-01">
            {fieldErrors["businessNumber"]}
          </p>
        )}
      </div>

      {/* ================= 쿠폰 비밀번호 ================= */}
      <div className="mt-[14px] relative w-full">
        {couponPassword === "" && (
          <span className="absolute top-[10px] left-[16px] typo-13-regular text-neutrals-07 pointer-events-none">
            쿠폰 비밀번호
          </span>
        )}
        <input
          type="tel"
          value={couponPassword}
          onChange={(e) => {
            const onlyNumber = e.target.value.replace(/[^0-9]/g, "");
            if (onlyNumber.length > 4) return;
            setCouponPassword(onlyNumber);
            clearFieldError("couponPin"); // 서버가 couponPin으로 내려주면 이 키를 써줘
          }}
          className={inputClass(couponPassword, true)}
        />
        <button
          type="button"
          disabled={!couponPasswordRegex.test(couponPassword)}
          onClick={() => setIsCouponModalOpen(true)}
          className={`
            absolute right-[12px] top-1/2 -translate-y-1/2
            w-[105px] h-[32px] px-[12px] rounded-[6px]
            typo-14-medium border
            ${
              couponPasswordRegex.test(couponPassword)
                ? "bg-primary-01 text-corals-000 cursor-pointer"
                : "border-primary-01 text-primary-01 cursor-not-allowed"
            }
          `}
        >
          설정
        </button>

        {(fieldErrors["couponPin"] || fieldErrors["couponPassword"]) && (
          <p className="mt-[6px] typo-12-regular text-primary-01">
            {fieldErrors["couponPin"] ?? fieldErrors["couponPassword"]}
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

      {/* ================= 인증번호 실패 모달 ================= */}
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

      {/* ================= 쿠폰 비밀번호 설정 완료 모달 ================= */}
      {isCouponModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-[320px] rounded-[8px] bg-white overflow-hidden">
            <div className="px-[24px] py-[32px] text-center">
              <p className="typo-13-regular text-black">
                쿠폰 비밀번호 설정이 완료되었습니다.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsCouponModalOpen(false)}
              className="w-full h-[52px] border-t border-neutrals-04 typo-16-medium text-primary-01"
            >
              확인
            </button>
          </div>
        </div>
      )}

      {/* ================= 사업자번호 확인 완료 모달 ================= */}
      {isBusinessModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-[320px] rounded-[8px] bg-white overflow-hidden">
            <div className="px-[24px] py-[32px] text-center">
              <p className="typo-13-regular text-black">
                사업자 번호가 확인되었습니다.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsBusinessModalOpen(false)}
              className="w-full h-[52px] border-t border-neutrals-04 typo-16-medium text-primary-01"
            >
              확인
            </button>
          </div>
        </div>
      )}

      {/* ================= 아이디 중복확인 모달 ================= */}
      {isIdModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-[320px] rounded-[8px] bg-white overflow-hidden">
            <div className="px-[24px] py-[32px] text-center">
              <p className="typo-13-regular text-black">
                {idModalMessage}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsIdModalOpen(false)}
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
