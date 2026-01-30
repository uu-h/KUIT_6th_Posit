import { useNavigate } from "react-router-dom";
import { useState } from "react";
import AppBar from "../../../components/Common/AppBar";
import SearchIcon from "../../../assets/Common/Search.svg";
import DaumPostcode from "react-daum-postcode";

export default function AddressSearch() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleComplete = (data: any) => {
    const fullAddress = data.address;
    const zonecode = data.zonecode; // 우편번호

    // 이전 화면으로 주소 전달
    navigate("/owner/store/register", {
      state: {
        address: fullAddress,
        zonecode,
      },
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* AppBar */}
      <AppBar
        title="주소 검색"
        layout="center"
        leftType="left"
        onBack={() => navigate(-1)}
      />

      {/* Search Input */}
      <div className="px-6 pt-4">
        <div className="relative">
          <input
            readOnly
            onClick={() => setOpen(true)}
            className="w-full h-[48px] border-b border-black text-neutrals-06 px-1 typo-16-regular cursor-pointer"
            placeholder="예) 판교역로 166, 분당 주공, 백현동 532"
          />
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
          >
            <img src={SearchIcon} alt="검색" className="w-[18px] h-[18px]" />
          </button>
        </div>
      </div>

      {/* Guide */}
      <div className="px-6 pt-6 space-y-2">
        <p className="typo-14-medium">이렇게 검색해 보세요</p>
        <p className="typo-12-regular text-shade-02">
          도로명 + 건물번호 (판교역로 166)
        </p>
        <p className="typo-12-regular text-shade-02">
          건물명 + 번지 (백현동 532)
        </p>
        <p className="typo-12-regular text-shade-02">
          건물명, 아파트명 (분당 주공)
        </p>
      </div>

      {/* Address Search Modal */}
      {open && (
        <div className="fixed inset-0 bg-white z-50">
          <DaumPostcode
            onComplete={handleComplete}
            autoClose
            style={{ height: "100vh" }}
          />
        </div>
      )}
    </div>
  );
}
