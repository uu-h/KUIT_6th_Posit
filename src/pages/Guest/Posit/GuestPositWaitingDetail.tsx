import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import AppBar from "../../../components/Common/AppBar";
import AnswerContentCard from "../../../components/Guest/Posit/AnswerContentCard";
import BottomBar from "../../../components/BottomBar/BottomBar";
import { http } from "../../../api/http";
import ConcernCard from "../../../components/Guest/Posit/ConcernCard";

interface ApiDetail {
  memoId: number;
  storeId: number;
  storeName: string;
  concernContent: string;
  memoTitle: string;
  memoContent: string;
  ownerReply?: string;
  status: string;
  createdAt: string;
  images: string[];
}

export default function GuestPositWaitingDetail() {
  const { id } = useParams<{ id: string }>();
  const [detail, setDetail] = useState<ApiDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await http.get(`/memos/me/${id}`);
        if (res.data.isSuccess) {
          setDetail(res.data.data);
        }
      } catch (e) {
        console.error("상세 불러오기 실패", e);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDetail();
  }, [id]);

  if (loading) return <div className="p-4">로딩 중...</div>;
  if (!detail) return <div className="p-4">데이터 없음</div>;

  const isAnswer = !!detail.concernContent;

  // 18시간 보정
  const formatCreatedAt = (iso: string) => {
    const d = new Date(iso);
    d.setHours(d.getHours() + 18);
    return d.toISOString(); // 카드 내부에서 Date 처리한다면 ISO 유지
  };

  return (
    <div className="flex flex-col h-screen">
      <AppBar
        title={isAnswer ? "고민 답변" : "자유 답변"}
        layout="left"
        leftType="left"
      />

      <div className="flex-1 overflow-y-auto pb-[110px] no-scrollbar">
        <div className="flex flex-col gap-[11px] mx-[12px]">
          {isAnswer && (
            <ConcernCard
              label={detail.storeName}
              content={detail.concernContent}
            />
          )}

          <AnswerContentCard
            title={detail.memoTitle}
            createdAt={formatCreatedAt(detail.createdAt)} // 보정 적용
            content={detail.memoContent}
            images={detail.images}
          />
        </div>
      </div>

      <BottomBar active="posit" onChange={() => {}} />
    </div>
  );
}
