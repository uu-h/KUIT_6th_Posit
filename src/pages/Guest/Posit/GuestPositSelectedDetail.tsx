import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import AppBar from "../../../components/Common/AppBar";
import AnswerContentCard from "../../../components/Guest/Posit/AnswerContentCard";
import OwnerAnswerCard from "../../../components/Guest/Posit/OwnerAnswerCard";
import BottomBar from "../../../components/BottomBar/BottomBar";
import { http } from "../../../api/http";

interface DetailResponse {
  memoId: number;
  storeId: number;
  storeName: string;
  concernContent: string | null;
  memoTitle: string;
  memoContent: string;
  ownerReply: string | null;
  status: string;
  createdAt: string;
  images: string[];
}

export default function GuestPositSelectedDetail() {
  const { id } = useParams(); // memoId
  const [detail, setDetail] = useState<DetailResponse | null>(null);
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

    fetchDetail();
  }, [id]);

  if (loading) return <div className="p-4">로딩 중...</div>;
  if (!detail) return <div className="p-4">데이터 없음</div>;

  const isAnswer = !!detail.concernContent; 

  return (
    <div className="flex flex-col h-screen">
      <AppBar title="채택 된 답변" layout="left" leftType="left" />

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
          images={detail.images}
        />
      </div>

      {/* 사장님 답변 */}
      {detail.ownerReply && (
        <OwnerAnswerCard
          content={detail.ownerReply}
          createdAt={detail.createdAt}
      />
      )}


      <BottomBar active="posit" onChange={() => {}} />
    </div>
  );
}
