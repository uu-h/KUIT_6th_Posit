import { useNavigate } from "react-router-dom";
import BossIcon from "../../assets/Guest/Onboarding/Boss.svg";
import GuestIcon from "../../assets/Guest/Onboarding/Guest.svg";

export default function UserTypeSelect() {
  const navigate = useNavigate();

  return (
    <div className="pt-[105px] flex flex-col gap-[97px]">
      
        <span className="typo-title text-center">
          안녕하세요, POSiT! 입니다.
        </span>

        <div className="flex flex-col justify-center gap-[42px]">

          <button className={userButtonClass} onClick={() => {
            navigate("/owner/login");
          }}>
            <img src={BossIcon} className="w-[100px]" />
            <span className="typo-headline text-shades-02">사장님인가요?</span>
          </button>

          <button className={userButtonClass} onClick={() => {
            navigate("/guest/login");
          }}>
            <img src={GuestIcon} className="w-[82px]"/>
            <span className="typo-headline text-shades-02">게스트인가요?</span>
          </button>

        </div>

    </div>
  );
}

const userButtonClass = `
  w-[297px] h-[211px] 
  flex flex-col items-center justify-center gap-[11px] 
  shadow-[0_0_10px_1px_rgba(140,140,140,0.4)] 
  rounded-[24px]
  cursor-pointer
`;
