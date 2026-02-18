import { useEffect, useState } from "react";
import AppBar from "../../../components/Common/AppBar";
import InboxToggle from "../../../components/Owner/Inbox/InboxToggle";
import IdeaCard from "../../../components/Owner/Inbox/IdeaCard";
import OwnerBottomBar from "../../../components/BottomBar/OwnerBottomBar";
import { http } from "../../../api/http";
import { useNavigate, useSearchParams } from "react-router-dom";

type TabKey = "ANSWER" | "FREE" | "ADOPTED";

interface InboxItem {
  id: number;
  type: TabKey;
  title: string;
  content: string;
  createdAt: string;
}

export default function PositInbox() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // 🔥 URL 기반 탭 관리
  const tabParam = searchParams.get("tab") as TabKey;
  const active: TabKey =
    tabParam === "FREE" || tabParam === "ADOPTED"
      ? tabParam
      : "ANSWER";

  const [loading, setLoading] = useState(true);

  const [answerItems, setAnswerItems] = useState<InboxItem[]>([]);
  const [freeItems, setFreeItems] = useState<InboxItem[]>([]);
  const [adoptedItems, setAdoptedItems] = useState<InboxItem[]>([]);

  // 🔥 최초 진입 시 tab 없으면 기본값 세팅
  useEffect(() => {
    if (!searchParams.get("tab")) {
      setSearchParams({ tab: "ANSWER" });
    }
  }, []);

  // 🔥 전체 데이터 한번에 로드
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const tabs: TabKey[] = ["ANSWER", "FREE", "ADOPTED"];

        const results = await Promise.all(
          tabs.map((tab) =>
            http.get("/owner/inbox", {
              params: {
                tab,
                cursorId: null,
                limit: 20,
              },
            })
          )
        );

        tabs.forEach((tab, index) => {
          const res = results[index];
          if (!res.data.isSuccess) return;

          const data: InboxItem[] = res.data.data ?? [];

          if (tab === "ANSWER") setAnswerItems(data);
          if (tab === "FREE") setFreeItems(data);
          if (tab === "ADOPTED") setAdoptedItems(data);
        });
      } catch (e) {
        console.error("초기 inbox 로딩 실패", e);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const counts = {
    ANSWER: answerItems.length,
    FREE: freeItems.length,
    ADOPTED: adoptedItems.length,
  };

  const currentItems =
    active === "ANSWER"
      ? answerItems
      : active === "FREE"
      ? freeItems
      : adoptedItems;

  const formatRelativeTime = (dateString: string) => {
    const cleaned = dateString.replace("Z", "");

    const target = new Date(cleaned);

    // 18시간 수동 보정
    target.setHours(target.getHours() + 18);

    const now = new Date();

    const diffMs = now.getTime() - target.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffMin < 1) return "방금 전";
    if (diffMin < 60) return `${diffMin}분 전`;
    if (diffHour < 24) return `${diffHour}시간 전`;
    if (diffDay < 10) return `${diffDay}일 전`;

    return target.toLocaleDateString("ko-KR");
  };


  return (
    <div className="h-dvh w-full flex flex-col bg-white overflow-hidden">
      <AppBar title="수신함" layout="center" />

      <InboxToggle
        active={active}
        counts={counts}
        onChange={(tab) => setSearchParams({ tab })}
      />

      <div className="flex-1 overflow-y-auto no-scrollbar pb-[102px]">
        <div className="flex flex-col gap-[8px] px-[16px] mt-[15px]">
          {loading ? (
            <div className="flex justify-center items-center typo-15-medium h-full text-center text-neutrals-09">
            </div>
          ) : currentItems.length === 0 ? (
            <div className="flex justify-center items-center typo-15-medium pt-[255px] text-center text-neutrals-09">
              <span>아직 받은 답변이 없어요.</span>
            </div>
          ) : (
            currentItems.map((item) => (
              <IdeaCard
                key={item.id}
                type={item.type}
                title={item.title}
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
