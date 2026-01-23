import { useLocation } from "react-router-dom";
import AppBar from "../../../components/Common/AppBar";
import AnswerContentCard from "../../../components/Guest/Posit/AnswerContentCard";
import OwnerAnswerCard from "../../../components/Guest/Posit/OwnerAnswerCard";
import BottomBar from "../../../components/BottomBar/BottomBar";

export default function GuestPositSelectedDetail() {
  const { state } = useLocation();

  if (!state) return null;

  const {
    title,
    type,
    cafeName,
    createdAt,
    content,
  } = state;

  return (
    <div className="flex flex-col h-screen">
        <AppBar
            title="채택 된 답변"
            layout="left"
            leftType="left"
        />
        
        <div className="flex flex-col gap-[11px] mx-[16px]">
            {type === "answer" && (
                <div className="flex flex-col justify-center p-[21px] bg-corals-000 h-[100px] rounded-[8px] border border-primary-01">
                    <p className="">
                        <span className="typo-16-semibold">{cafeName}의 고민거리</span>
                        <br/>
                        <span className="typo-14-regular">
                            {/* 가게별로 고민거리 api를 따로 받아야할수도 */}
                            음악 소리가 너무 큰가요? 잔잔한 음악이여서 크게 틀었는데 시끄러운가 고민이네요.
                        </span>
                    </p>
                </div>
            )}

            <AnswerContentCard 
                title={title} 
                createdAt={createdAt} 
                content={content} 
            />
        </div>

        {/* 사장님 답변에 따른 api로 다르게 구현 */}
        <OwnerAnswerCard></OwnerAnswerCard>

        <BottomBar active="posit" onChange={() => {}}></BottomBar>
    </div>
  );
}
