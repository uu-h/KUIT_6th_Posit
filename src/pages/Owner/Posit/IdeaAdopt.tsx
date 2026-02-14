import AdoptDescription from "../../../components/Owner/IdeaAdopt/AdoptDescription";
import Button from "../../../components/Button";
import CheckIconL from "../../../assets/Owner/Idea/CheckL.svg";
import CheckIconS from "../../../assets/Owner/Idea/CheckS.svg";
import { useNavigate } from "react-router-dom";

const TextcommonStyle = "typo-13-regular text-neutrals-09";

export default function IdeaAdopt() {
  const navigate = useNavigate();

  return(
    <div className="flex flex-col items-center px-[16px] relative">
        <img className="mt-[44px]" src={CheckIconL} alt="체크 표시 L" />
        <header className="flex flex-col items-center gap-[16px] mt-[22px]">
          <h1 className="typo-title">아이디어를 채택했습니다</h1>
          <h3 className="text-center text-neutrals-08 typo-16-regular">채택된 아이디어의 작성자에게<br/>쿠폰이 지급될 예정입니다.</h3>
        </header>

        <section className="flex flex-col gap-[10px] items-center mt-[58px]">
          <img className="w-[279px]" src={CheckIconS} alt="체크 표시 S" />
          <div className="flex w-[309px] justify-between items-center">
            <span className={TextcommonStyle}>답변 검토중</span>
            <span className="typo-13-semibold text-primary-01">채택 완료</span>
            <span className={TextcommonStyle}>쿠폰 지급</span>
          </div>
        </section>

        <AdoptDescription></AdoptDescription>

        <button 
          className="cursor-pointer typo-18-medium text-neutrals-06 my-[47px]"
          onClick={() => navigate("/owner/home")}
        >
          홈으로
        </button>

        <Button 
          className=""
          onClick={() => navigate("/owner/inbox")}
        >
          다른 아이디어 더보기
        </Button>
    </div>
  );
}
