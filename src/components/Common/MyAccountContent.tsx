import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppBar from "../../components/Common/AppBar";

interface MyAccountContentProps {
  bottomBar: React.ReactNode;
}

export default function MyAccountContent({ bottomBar }: MyAccountContentProps) {
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);

  // 1. 상태 관리
  const [form, setForm] = useState({
    gender: "male",
    guestId: "kuit6thdesign", 
    password: "password", 
    name: "김쿠잇",
    phone: "01011111111",
    birth: "20031208",  
  });

  // 2. 포맷팅 로직
  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/[^0-9]/g, "").slice(0, 11);
    if (numbers.length < 4) return numbers;
    if (numbers.length < 8) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7)}`;
  };

  const formatBirthDate = (value: string) => {
    const numbers = value.replace(/[^0-9]/g, "").slice(0, 8);
    if (numbers.length < 5) return numbers;
    if (numbers.length < 7) return `${numbers.slice(0, 4)} / ${numbers.slice(4)}`;
    return `${numbers.slice(0, 4)} / ${numbers.slice(4, 6)} / ${numbers.slice(6)}`;
  };

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleComplete = () => {
    console.log("전송 데이터:", form);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      navigate(-1);
    },1200); //time
  };

  const inputClass = `w-full h-[56px] rounded-[8px] border border-neutrals-04 px-[16px] typo-16-regular focus:outline-none focus:border-primary-01 transition-all bg-white flex items-center`;
  const sectionLabel = `mb-[7px] typo-13-regular text-neutrals-07`;

  return (
    <div className="w-full flex flex-col min-h-screen relative bg-white">
      {/* 상단바 */}
      <AppBar layout="center" leftType="left" />

      {/* 메인 폼 영역 */}
      <div className="flex-1 px-[16px] flex flex-col gap-[12px] overflow-y-auto pb-[100px]">
        <h1 className="typo-sub-title mb-[10px] mt-[10px]">내 계정 관리</h1>

        {/* 성별 */}
        <div>
          <p className={sectionLabel}>성별</p>
          <div className="flex gap-[12px]">
            {["female", "male"].map((type) => (
              <button
                key={type}
                onClick={() => handleChange("gender", type)}
                className={`flex-1 h-[56px] rounded-[8px] border typo-13-regular transition-all ${
                  form.gender === type ? "border-primary-01 text-primary-01" : "border-neutrals-04 text-shades-02"
                }`}
              >
                {type === "female" ? "여성" : "남성"}
              </button>
            ))}
          </div>
        </div>

        {/* 아이디 */}
        <div>
          <p className={sectionLabel}>아이디</p>
          <input
            type="text"
            value={form.guestId}
            readOnly // 아이디는 보통 수정 불가이므로 readOnly 추가
            className={`${inputClass} bg-neutrals-01`}
          />
        </div>

        {/* 비밀번호 */}
        <div>
          <p className={sectionLabel}>비밀번호</p>
          <input
            type="password"
            placeholder="변경할 비밀번호를 입력하세요"
            value={form.password}
            onChange={(e) => handleChange("password", e.target.value)}
            className={inputClass}
          />
        </div>

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

        {/* 휴대폰 */}
        <div>
          <p className={sectionLabel}>전화번호</p>
          <input
            type="tel"
            value={formatPhoneNumber(form.phone)}
            onChange={(e) => handleChange("phone", e.target.value.replace(/[^0-9]/g, ""))}
            className={inputClass}
          />
        </div>

        {/* 생년월일 */}
        <div>
          <p className={sectionLabel}>생년월일</p>
          <input
            type="tel"
            value={formatBirthDate(form.birth)}
            onChange={(e) => handleChange("birth", e.target.value.replace(/[^0-9]/g, ""))}
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
      </div>

      {/* 토스트 메시지 */}
      {showToast && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" />
          <div className="flex items-center relative justify-center bg-neutrals-01 w-[274px] h-[130px] rounded-[8px]">
            <p className="typo-15-meidum text-center text-shades-02">
              회원 정보가<br/>
              수정 완료되었습니다.
            </p>
          </div>
        </div>
      )}

      {bottomBar}
    </div>
  );
}