import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import AppBar from "../../../components/Common/AppBar";
import ConcernReadonlyCard from "../../../components/Owner/Posit/ConcernReadonlyCard";
import AdoptionHeader from "../../../components/Owner/Coupon/AdoptionHeader";

import { getMemoAdoption, getMemoDetail } from "../../../api/posit";

type AdoptionData = Awaited<ReturnType<typeof getMemoAdoption>>;
type MemoDetailData = Awaited<ReturnType<typeof getMemoDetail>>;

export default function OwnerCouponAdoptionDetailPage() {
  const { memoId } = useParams();
  const numericMemoId = memoId ? Number(memoId) : NaN;

  const [adoption, setAdoption] = useState<AdoptionData | null>(null);
  const [memoDetail, setMemoDetail] = useState<MemoDetailData | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!memoId || Number.isNaN(numericMemoId)) {
      setError("잘못된 접근입니다.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [adoptionRes, memoRes] = await Promise.all([
          getMemoAdoption(numericMemoId),
          getMemoDetail(numericMemoId),
        ]);

        setAdoption(adoptionRes);
        setMemoDetail(memoRes);
      } catch (e) {
        console.error(e);
        setError("채택 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [memoId, numericMemoId]);

  if (loading) return <div className="p-4">불러오는 중...</div>;
  if (error) return <div className="p-4">{error}</div>;
  if (!adoption || !memoDetail)
    return <div className="p-4">데이터가 없습니다.</div>;

  const title = memoDetail.title ?? "";
  const content = memoDetail.content ?? "";
  const imageUrl = memoDetail.images?.[0];
  const writer = memoDetail.writer?.name ?? adoption.writer ?? "";
  const adoptedAt = adoption.adoptedAt ?? "";
  const reward = adoption.reward ?? "";

  const mode = adoption.concernTitle ? "CONCERN" : "FREE";

  return (
    <div className="min-h-dvh w-full bg-white">
      <AppBar layout="left" leftType="left" className="bg-white" />

      <main className="mt-[16px] p-[16px]">
        <AdoptionHeader
          mode={mode}
          concernTitle={adoption.concernTitle || undefined}
        />

        <div className="mt-[18px]">
          <ConcernReadonlyCard
            name={writer}
            title={title}
            content={content}
            date={adoptedAt}
            imageUrl={imageUrl}
          />
        </div>
      </main>
    </div>
  );
}
