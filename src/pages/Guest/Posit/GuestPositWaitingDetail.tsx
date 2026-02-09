import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import AppBar from "../../../components/Common/AppBar";
import AnswerContentCard from "../../../components/Guest/Posit/AnswerContentCard";
import BottomBar from "../../../components/BottomBar/BottomBar";
import { http } from "../../../api/http";

interface ApiDetail {
  memoId: number;
  storeId: number;
  storeName: string;
  concernContent?: string;
  memoTitle: string;
  memoContent: string;
  ownerReply?: string;
  status: string;
  createdAt: string;
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

  const isAnswer = !!detail.concernContent; // 분기

  return (
    <div className="flex flex-col h-screen">
      <AppBar
        title={isAnswer ? "고민 답변" : "자유 답변"}
        layout="left"
        leftType="left"
      />

      <div className="flex flex-col gap-[11px] mx-[16px]">
    
        {isAnswer && (
          <div className="flex flex-col justify-center p-[21px] bg-corals-000 h-[100px] rounded-[8px] border border-primary-01">
            <p>
              <span className="typo-16-semibold">
                {detail.storeName}의 고민거리
              </span>
              <br />
              <span className="typo-14-regular">
                {detail.concernContent}
              </span>
            </p>
          </div>
        )}

        <AnswerContentCard
          title={detail.memoTitle}
          createdAt={detail.createdAt}
          content={detail.memoContent}
        />
      </div>

      <BottomBar active="posit" onChange={() => {}} />
    </div>
  );
}
