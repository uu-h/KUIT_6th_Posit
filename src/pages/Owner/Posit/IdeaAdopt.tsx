import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdoptDescription from "../../../components/Owner/IdeaAdopt/AdoptDescription";
import Button from "../../../components/Button";
import CheckIconL from "../../../assets/Owner/Idea/CheckL.svg";
import CheckIconS from "../../../assets/Owner/Idea/CheckS.svg";
import { http } from "../../../api/http";


interface AdoptionData {
  concernTitle : string;
  writer : string;
  adoptedAt : string;
  reward : string;
}

const TextcommonStyle = "typo-13-regular text-neutrals-09";

export default function IdeaAdopt() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [adoptionData, setAdoptionData] = useState<AdoptionData | null>(null);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    const fetchAdoption = async () => {
      try {
        const res = await http.get(`/memos/${id}/adoption`);

        if(res.data.isSuccess){
          setAdoptionData(res.data.data);
        }
      } catch (error) {
        console.error("채택 정보 불러오기 실패",error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAdoption();
    }
  },[id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        로딩중...
      </div>
    )
  }

  if (!adoptionData) {
    return (
      <div className="flex justify-center items-center h-screen">
        데이터를 불러올 수 없습니다.
      </div>
    )
  }

  const formattedDate = new Date(adoptionData.adoptedAt).toLocaleDateString(
    "ko-KR"
  );

  return(
    <div className="h-dvh w-full flex flex-col items-center px-[16px] relative ">
        <img className="mt-[44px]" src={CheckIconL} alt="체크 표시 L" />
        <header className="flex flex-col items-center gap-[16px] mt-[22px]">
          <h1 className="typo-title">아이디어를 채택했습니다</h1>
          <h3 className="text-center text-neutrals-08 typo-16-regular">채택된 아이디어의 작성자에게<br/>쿠폰이 지급될 예정입니다.</h3>
        </header>

        <section className="flex flex-col gap-[10px] items-center mt-[58px]">
          <img className="flex items-center w-[310px] pl-[12px]" src={CheckIconS} alt="체크 표시 S" />
          <div className="flex justify-between items-center gap-[89px]">
            <span className={TextcommonStyle}>답변 검토중</span>
            <span className="typo-13-semibold text-primary-01">채택 완료</span>
            <span className={TextcommonStyle}>쿠폰 지급</span>
          </div>
        </section>

        <AdoptDescription
          concernTitle={adoptionData.concernTitle}
          writer={adoptionData.writer}
          adoptedAt={formattedDate}
          reward={adoptionData.reward}
        />

        <button 
          className="cursor-pointer typo-18-medium text-neutrals-06 my-[47px]"
          onClick={() => navigate("/owner/home")}
        >
          홈으로
        </button>

        <div className="absolute bottom-0 my-4 w-[343px]">
          <Button 
            className=""
            onClick={() => navigate("/owner/inbox")}
          >
            다른 아이디어 더보기
          </Button>
        </div>
    </div>
  );
}
