import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import AppBar from "../../../../components/Common/AppBar";
import SearchIcon from "../../../../assets/Common/Search.svg";
import DaumPostcode from "react-daum-postcode";

export default function AddressModify() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(true);

  const handleComplete = (data: any) => {
    // 🔥 StoreModify가 기다리는 키값 'roadAddress'로 통일해서 보냅니다.
    navigate("/owner/store/modify", {
      state: {
        ...location.state, 
        roadAddress: data.address, // 도로명 주소 업데이트
        detailAddress: "", // 주소가 바뀌면 상세주소는 새로 입력하게 비워줌
      },
    });
    setOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white max-w-[375px] mx-auto w-full overflow-x-hidden">
      <AppBar
        title="주소 검색"
        layout="center"
        leftType="left"
        onBack={() => navigate(-1)}
      />

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

      <div className="px-6 pt-6 space-y-2">
        <p className="typo-12-medium mb-3">이렇게 검색해 보세요</p>
        <p className="typo-12-regular text-neutrals-07">
          도로명 + 건물번호 (판교역로 166)
        </p>
        <p className="typo-12-regular text-neutrals-07">
          건물명 + 번지 (백현동 532)
        </p>
        <p className="typo-12-regular text-neutrals-07">
          건물명, 아파트명 (분당 주공)
        </p>
      </div>

      {open && (
        <div className="fixed inset-0 bg-white z-50">
          <div className="flex flex-col h-full">
             <AppBar
              title="주소 검색"
              layout="center"
              leftType="left"
              onBack={() => setOpen(false)}
            />
            <DaumPostcode
              onComplete={handleComplete}
              autoClose
              style={{ flex: 1 }}
            />
          </div>
        </div>
      )}
    </div>
  );
}