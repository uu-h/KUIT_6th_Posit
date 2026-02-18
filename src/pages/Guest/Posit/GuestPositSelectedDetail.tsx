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
  const { id } = useParams();
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

  // 18시간 보정
  const formatCreatedAt = (iso: string) => {
    const d = new Date(iso);
    d.setHours(d.getHours() + 18);
    return d.toISOString();
  };

  return (
    <div className="flex flex-col h-screen">
      <AppBar title="채택 된 답변" layout="left" leftType="left" />

      <div className="flex-1 overflow-y-auto pb-[120px] no-scrollbar">
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
            createdAt={formatCreatedAt(detail.createdAt)} // 보정 적용
            content={detail.memoContent}
            images={detail.images}
          />
        </div>

        {detail.ownerReply && (
          <OwnerAnswerCard
            content={detail.ownerReply}
            createdAt={formatCreatedAt(detail.createdAt)} // 보정 적용
          />
        )}
      </div>

      <BottomBar active="posit" onChange={() => {}} />
    </div>
  );
}
