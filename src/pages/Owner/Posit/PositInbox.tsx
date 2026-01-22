import { useState } from "react";
import AppBar from "../../../components/Common/AppBar";
import InboxToggle from "../../../components/Owner/Inbox/InboxToggle";
import IdeaCard from "../../../components/Owner/Inbox/IdeaCard";
import OwnerBottomBar from "../../../components/BottomBar/OwnerBottomBar";

/* 목업 데이터 나중에 api로 대체 */
interface InboxItem {
  id: number;
  type: TabKey;
  contents: string;
  date: string;
}


const MOCK_DATA : InboxItem[] = [
  {
    id: 1,
    type: "answer",
    contents: "배달 음료 얼음이 너무 많이 들어가서 양이 적어요 배달용은...",
    date: "방금 전",
  },
  {
    id: 2,
    type: "answer",
    contents: "콘센트 있는 자리가 너무 적어요. 노트북 작업하는 사람들을 위해...",
    date: "1일전",
  },
  {
    id: 3,
    type: "memo",
    contents: "매장 안 음악이 조금 커서 대화하기 어려워요 음악 볼륨을 조금만...",
    date: "10월 12일",
  },
  {
    id: 4,
    type: "answer",
    contents: "디저트 메뉴가 자주 바뀌면 좋겠어요. 계절 한정 메뉴랑...",
    date: "10월 10일",
  },
  {
    id: 5,
    type: "answer",
    contents: "스탬프 적립을 앱으로도 할 수 있으면 좋겠어요 종이 쿠폰은 자꾸...",
    date: "10월 9일",
  },
  {
    id: 6,
    type: "answer",
    contents: "배달 음료 얼음이 너무 많이 들어가서 양이 적어요 배달용은...",
    date: "방금 전",
  },
  {
    id: 7,
    type: "answer",
    contents: "콘센트 있는 자리가 너무 적어요. 노트북 작업하는 사람들을 위해...",
    date: "1일전",
  },
  {
    id: 8,
    type: "answer",
    contents: "배달 음료 얼음이 너무 많이 들어가서 양이 적어요 배달용은...",
    date: "방금 전",
  },
  {
    id: 9,
    type: "answer",
    contents: "콘센트 있는 자리가 너무 적어요. 노트북 작업하는 사람들을 위해...",
    date: "1일전",
  },
];

type TabKey = "answer" | "memo" | "done";
/* 목업 데이터 나중에 api로 대체 */

export default function PositInbox() {
  const [active, setActive] = useState<TabKey>("answer");

  const counts = {
    answer: MOCK_DATA.filter((i) => i.type === "answer").length,
    memo: MOCK_DATA.filter((i) => i.type === "memo").length,
    done: MOCK_DATA.filter((i) => i.type === "done").length,
  };

  const filteredData = MOCK_DATA.filter(
    (item) => item.type === active
  );

  return (
    <div className="flex flex-col w-full h-screen overflow-hidden">
      <AppBar title="수신함" layout="center" />

      <InboxToggle
        active={active}
        counts={counts}
        onChange={setActive}
      />
      <div className="flex-1 overflow-y-auto no-scrollbar mb-[100px]">
        <div className="flex flex-col gap-[8px] px-[16px] mt-[15px]">
          {filteredData.length === 0 ? (
            <div className="text-center text-[#79747E] py-10">
              아직 받은 아이디어가 없어요
            </div>
          ) : (
            filteredData.map((item) => (
              <IdeaCard
                  key={item.id}
                  type={item.type}
                  contents={item.contents}
                  date={item.date}
              />
            ))
          )}
        </div>
      </div>

    <OwnerBottomBar active="inbox" onChange={() => {}}></OwnerBottomBar>

    </div>
  );
}
