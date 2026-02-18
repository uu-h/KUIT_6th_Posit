import { useNavigate, useLocation } from "react-router-dom";
import AppBar from "../../../../components/Common/AppBar";
import DaumPostcode from "react-daum-postcode";

export default function AddressModify() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleComplete = (data: any) => {
    navigate("/owner/store/modify", {
      state: {
        ...location.state,
        roadAddress: data.address,
        detailAddress: "",
      },
    });
  };

  return (
    <div className="flex flex-col h-screen bg-white max-w-[375px] mx-auto w-full">
      <AppBar
        title="주소 검색"
        layout="center"
        leftType="left"
        onBack={() => navigate(-1)}
      />

      <div className="flex-1">
        <DaumPostcode
          onComplete={handleComplete}
          autoClose
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    </div>
  );
}
