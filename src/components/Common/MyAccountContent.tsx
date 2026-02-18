import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppBar from "../../components/Common/AppBar";
import EyeOffIcon from "../../assets/Common/EyeClose.svg";
import EyeIcon from "../../assets/Common/EyeOpen.svg";
import { http } from "../../api/http";
import { useQueryClient } from "@tanstack/react-query";

interface MeResponse {
  loginId: string;
  name: string;
  phone: string;
  birthDate: string; // "YYYY-MM-DD"
  gender: string;
}

export default function MyAccountContent() {
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();

  // 폼 상태
  const [form, setForm] = useState({
    password: "",
    name: "",
    phone: "",
    birth: "", // "YYYYMMDD"
  });

  const [showPassword, setShowPassword] = useState(true);

  // 전화번호 포맷
  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/[^0-9]/g, "").slice(0, 11);
    if (numbers.length < 4) return numbers;
    if (numbers.length < 8) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7)}`;
  };

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    const fetchMe = async () => {
      try {
        setLoading(true);
        const res = await http.get("/users/me");

        if (res.data.isSuccess) {
          const data: MeResponse = res.data.data;

          setForm({
            password: "", // 비밀번호는 항상 비워둠
            name: data.name ?? "",
            phone: data.phone ?? "",
            birth: data.birthDate
              ? data.birthDate.replace(/-/g, "") // "YYYY-MM-DD" -> "YYYYMMDD"
              : "",
          });
        } else {
          throw new Error("isSuccess false");
        }
      } catch (e) {
        console.error("내 정보 불러오기 실패", e);
        alert("내 정보 불러오기 실패");
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, []);

  const handleComplete = async () => {
    try {
      const birth = form.birth.replace(/[^0-9]/g, "");
      const birthDate = `${birth.slice(0, 4)}-${birth.slice(4, 6)}-${birth.slice(6, 8)}`;

      const payload: {
        name: string;
        phone: string;
        birthDate: string;
        password?: string;
      } = {
        name: form.name,
        phone: form.phone.replace(/[^0-9]/g, ""),
        birthDate,
      };

      // 비밀번호 입력했을 때만 포함
      if (form.password.trim().length > 0) {
        payload.password = form.password;
      }

      console.log("보내는 데이터:", payload);

      const res = await http.patch("/users/me", payload);

      if (res.data.isSuccess) {
        await queryClient.invalidateQueries({ queryKey: ["me"] });

        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
          navigate(-1);
        }, 1200);
      } else {
        throw new Error("isSuccess false");
      }
    } catch (e) {
      console.error("내 정보 수정 실패", e);
      alert("내 정보 수정 실패");
    }
  };

  const inputClass =
    "w-full h-[56px] rounded-[8px] border border-neutrals-04 px-[16px] typo-16-regular focus:outline-none focus:border-primary-01 transition-all bg-white flex items-center";
  const sectionLabel = "mb-[7px] typo-13-regular text-neutrals-07";

  return (
    <div className="w-full flex flex-col min-h-screen relative bg-white">
      <AppBar layout="center" leftType="left" onBack={() => navigate(-1)} />

      <div className="flex-1 px-[16px] flex flex-col gap-[12px] overflow-y-auto pb-[100px]">
        <h1 className="typo-sub-title mb-[10px] mt-[10px]">내 계정 관리</h1>

        {loading ? (
          <div className="text-center py-10">불러오는 중...</div>
        ) : (
          <>
            {/* 이름 */}
            <div>
              <p className={sectionLabel}>이름</p>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className={inputClass}
              />
            </div>

            {/* 비밀번호 */}
            <div className="relative">
              <p className={sectionLabel}>비밀번호</p>
              <input
                type={showPassword ? "password" : "text"}
                placeholder="변경할 비밀번호를 입력하세요"
                value={form.password}
                onChange={(e) => handleChange("password", e.target.value)}
                className={inputClass}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-[12px] top-[50px] -translate-y-1/2"
              >
                <img
                  src={showPassword ? EyeOffIcon : EyeIcon}
                  alt="toggle password visibility"
                  className="w-5 h-5"
                />
              </button>
            </div>

            {/* 휴대폰 */}
            <div>
              <p className={sectionLabel}>전화번호</p>
              <input
                type="tel"
                value={formatPhoneNumber(form.phone)}
                onChange={(e) =>
                  handleChange("phone", e.target.value.replace(/[^0-9]/g, ""))
                }
                className={inputClass}
              />
            </div>

            {/* 수정 완료 버튼 */}
            <div className="flex justify-end mt-[10px]">
              <button
                onClick={handleComplete}
                className="w-[84px] h-[39px] bg-primary-01 text-white rounded-full typo-14-medium active:bg-primary-01 active:text-white transition-all"
              >
                수정 완료
              </button>
            </div>
          </>
        )}
      </div>

      {/* 토스트 */}
      {showToast && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" />
          <div className="flex items-center relative justify-center bg-neutrals-01 w-[274px] h-[130px] rounded-[8px]">
            <p className="typo-15-meidum text-center text-shades-02">
              회원 정보가
              <br />
              수정 완료되었습니다.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
