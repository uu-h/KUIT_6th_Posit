import ToggleOffIcon from "../../assets/Login/toggle_off.svg";
import LeftArrowIcon from "../../assets/Login/left_arrow.svg";
import ToggleOnIcon from "../../assets/Login/toggle_on.svg";
import Button from "../../components/Button";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../api/auth";

import EyeOnIcon from "../../assets/Login/eye_on.svg";
import EyeOffIcon from "../../assets/Login/eye_off.svg";
import { emitToast } from "../../utils/toastBus";

export default function GuestLoginPage() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [autoLogin, setAutoLogin] = useState(false);
  const [loading, setLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const autoLoginFlag = localStorage.getItem("autoLogin");
    const accessToken = localStorage.getItem("accessToken");
    const role = localStorage.getItem("role");

    if (autoLoginFlag === "true" && accessToken && role === "GUEST") {
      navigate("/guest/home", { replace: true });
    }
  }, [navigate]);

  const handleLogin = async () => {
    if (!loginId || !password) {
      setErrorMessage("아이디와 비밀번호를 입력해주세요.");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(null);

      const res = await login({
        loginId,
        password,
      });

      const { accessToken, refreshToken } = res.data.tokens;
      const { role } = res.data.user;

      // 게스트 로그인 화면에서는 GUEST만 허용
      if (role !== "GUEST") {
        emitToast({
          message:
            "게스트 계정이 아닙니다.\n사장님 로그인 화면을 이용해주세요.",
        });

        // 혹시 남아있을 수 있는 값 정리
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("role");
        localStorage.removeItem("autoLogin");
        return;
      }

      // role이 정상일 때만 토큰 저장
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("role", role);

      if (autoLogin) {
        localStorage.setItem("autoLogin", "true");
      } else {
        localStorage.removeItem("autoLogin");
      }

      // 게스트 홈으로 이동
      navigate("/guest/home", { replace: true });
    } catch (error: any) {
      console.error(error);

      const data = error?.response?.data;

      // 1) DTO 검증 에러: errors 배열 첫 메시지 사용
      const dtoMessage = data?.errors?.[0]?.message;

      // 2) 커스텀/공통 에러: message가 있으면 사용
      const serverMessage = data?.message;

      // 3) 네트워크/기타 fallback
      const fallbackMessage = error?.response
        ? "로그인에 실패했습니다."
        : "네트워크 연결을 확인해주세요.";

      setErrorMessage(dtoMessage ?? serverMessage ?? fallbackMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-shades-01 px-[24px] pt-[48px]">
      {/* 상단 헤더 */}
      <div className="mb-[40px] flex flex-col">
        <button
          className="w-fit flex items-center justify-center cursor-pointer"
          onClick={() => navigate("/type", { replace: true })}
        >
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
            value={loginId}
            onChange={(e) => {
              setLoginId(e.target.value);
              setErrorMessage(null);
            }}
            className="border-b border-neutrals-09 outline-none typo-16-medium"
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-[8px] typo-16-regular text-neutrals-09">
            비밀번호
          </label>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrorMessage(null);
              }}
              className="w-full border-b border-neutrals-09 outline-none typo-16-medium pr-[32px]"
            />
            {/* 눈 아이콘 */}
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-0 top-1/2 -translate-y-[60%]"
            >
              <img
                src={showPassword ? EyeOnIcon : EyeOffIcon}
                alt={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
                className="w-[20px] h-[20px]"
              />
            </button>
          </div>
          {errorMessage && (
            <p className="mt-[8px] typo-12-regular text-primary-01">
              {errorMessage}
            </p>
          )}
        </div>
      </div>

      <div className="mt-[20px] flex items-center justify-between">
        <button
          type="button"
          onClick={() => setAutoLogin((prev) => !prev)}
          className="flex items-center gap-[8px]"
        >
          <img
            src={autoLogin ? ToggleOnIcon : ToggleOffIcon}
            alt={autoLogin ? "자동 로그인 활성화" : "자동 로그인 비활성화"}
            className="h-[27px] w-[50px]"
          />
          <span className="typo-13-regular text-shades-02">자동 로그인</span>
        </button>

        <button className="typo-13-regular text-shades-02">ID/PASS 찾기</button>
      </div>

      {/* 로그인 버튼 */}
      <Button className="mt-[32px]" onClick={handleLogin} disabled={loading}>
        {loading ? "로그인 중..." : "로그인"}
      </Button>

      <div className="mt-[24px] flex items-center justify-center gap-[26px]">
        <span className="typo-16-medium text-neutrals-06">
          아직 회원이 아니신가요?
        </span>
        <button
          className="typo-16-bold text-neutrals-08 cursor-pointer"
          onClick={() => navigate("/guest/signup")}
        >
          간편 회원가입
        </button>
      </div>
    </div>
  );
}
