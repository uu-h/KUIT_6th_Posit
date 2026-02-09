import ToggleOffIcon from "../../assets/Login/toggle_off.svg";
import LeftArrowIcon from "../../assets/Login/left_arrow.svg";
import ToggleOnIcon from "../../assets/Login/toggle_on.svg";
import Button from "../../components/Button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../api/auth";

export default function GuestLoginPage() {
  const navigate = useNavigate();

  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [autoLogin, setAutoLogin] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!loginId || !password) {
      alert("아이디와 비밀번호를 입력해주세요.");
      return;
    }

    try {
      setLoading(true);

      const res = await login({
        loginId,
        password,
      });

      const { accessToken, refreshToken } = res.data.tokens;
      const { role } = res.data.user;


      // 토큰 저장
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      if (autoLogin) {
        localStorage.setItem("autoLogin", "true");
      }

      // 게스트 로그인 화면에서는 GUEST만 허용
      if (role !== "GUEST") {
        alert("게스트 계정이 아닙니다.\n사장님 로그인 화면을 이용해주세요.");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("autoLogin");
        return;
      }

      // 게스트 홈으로 이동
      navigate("/guest/home", { replace: true });
    } catch (error) {
      console.error(error);
      alert("로그인에 실패했습니다.");
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
          onClick={() => navigate(-1)}
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
            onChange={(e) => setLoginId(e.target.value)}
            className="border-b border-neutrals-09 outline-none typo-16-medium"
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-[8px] typo-16-regular text-neutrals-09">
            비밀번호
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border-b border-neutrals-09 outline-none typo-16-medium"
          />
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
          <span className="typo-13-regular text-shades-02">
            자동 로그인
          </span>
        </button>

        <button className="typo-13-regular text-shades-02">
          ID/PASS 찾기
        </button>
      </div>

      {/* 로그인 버튼 */}
      <Button
        className="mt-[32px]"
        onClick={handleLogin}
        disabled={loading}
      >
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
