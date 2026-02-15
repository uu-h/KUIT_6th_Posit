import { useEffect, useState } from "react";
import AppBar from "../../../components/Common/AppBar";
import InboxToggle from "../../../components/Owner/Inbox/InboxToggle";
import IdeaCard from "../../../components/Owner/Inbox/IdeaCard";
import OwnerBottomBar from "../../../components/BottomBar/OwnerBottomBar";
import { http } from "../../../api/http";
import { useNavigate } from "react-router-dom";

type TabKey = "ANSWER" | "MEMO" | "DONE";

interface InboxItem {
  id: number;
  type: TabKey;
  title: string;
  content: string;
  createdAt: string;
}

export default function PositInbox() {
  const navigate = useNavigate();
  const [active, setActive] = useState<TabKey>("ANSWER");
  const [items, setItems] = useState<InboxItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchInbox = async (tab: TabKey) => {
    try {
      setLoading(true);
      const res = await http.get("/owner/inbox", {
        params: {
          tab,        // 필수
          cursorId: null,
          limit: 20,
        },
      });

      if (res.data.isSuccess) {
        setItems(res.data.data);
      }
    } catch (e) {
      console.error("inbox 불러오기 실패", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInbox(active);
  }, [active]);

  const counts = {
    ANSWER: items.filter((i) => i.type === "ANSWER").length,
    MEMO: items.filter((i) => i.type === "MEMO").length,
    DONE: items.filter((i) => i.type === "DONE").length,
  };

  const formatRelativeTime = (dateString: string) => {
    const now = new Date();
    const target = new Date(dateString);

    const diffMs = now.getTime() - target.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) return "방금 전";
    if (diffMin < 60) return `${diffMin}분 전`;
    if (diffHour < 24) return `${diffHour}시간 전`;
    if (diffDay < 10) return `${diffDay}일 전`;

    return target.toLocaleDateString("ko-KR");
  };


  const filteredData = items.filter((item) => item.type === active);

  return (
    <div className="h-dvh w-full flex flex-col bg-white overflow-hidden">
      <AppBar title="수신함" layout="center" />

      <InboxToggle active={active} counts={counts} onChange={setActive} />

      <div className="flex-1 overflow-y-auto no-scrollbar mb-[100px]">
        <div className="flex flex-col gap-[8px] px-[16px] mt-[15px]">
          {loading ? (
            <div className="text-center py-10">로딩중...</div>
          ) : filteredData.length === 0 ? (
            <div className="text-center text-[#79747E] py-10">
              아직 아이디어가 없어요
            </div>
          ) : (
            filteredData.map((item) => (
              <IdeaCard
                key={item.id}
                type={item.type}
                contents={item.content}
                date={formatRelativeTime(item.createdAt)}
                onClick={() => navigate(`/owner/inbox/${item.id}`)}
              />
            ))
          )}
        </div>
      </div>

      <OwnerBottomBar active="inbox" />
    </div>
  );
}
