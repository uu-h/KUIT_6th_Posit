import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import AppBar from "../../../components/Common/AppBar";
import StatSummary from "../../../components/Owner/Home/StatSummary";
import QuickActions from "../../../components/Owner/Home/QuickActions";
import SectionHeader from "../../../components/Owner/Home/SectionHeader";
import ConcernList from "../../../components/Owner/Home/ConcernList";
import OwnerLayout from "../../../layouts/OwnerLayout";

import { ownerApi } from "../../../api/owner";
import type { OwnerHomeData } from "../../../types/ownerHome";

export default function OwnerHomePage() {
  const navigate = useNavigate();

  const [home, setHome] = useState<OwnerHomeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setErrorMsg(null);

        const data = await ownerApi.getHome();
        if (!alive) return;

        setHome(data);
      } catch (e) {
        if (!alive) return;
        setErrorMsg(e instanceof Error ? e.message : "Unknown error");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const statItems = useMemo(
    () => [
      {
        label: "누적 메모",
        value: home?.stats.totalMemoCount ?? 0,
        unit: "개",
      },
      {
        label: "쿠폰 발행",
        value: home?.stats.issuedCouponCount ?? 0,
        unit: "장",
      },
      {
        label: "반영 완료",
        value: home?.stats.adoptedCount ?? 0,
        unit: "건",
      },
    ],
    [home],
  );

  // 18시간 보정 + 상대시간 계산
  const formatRelativeTime = (iso: string) => {
    const d = new Date(iso);

    // 18시간 수동 보정
    d.setHours(d.getHours() + 18);

    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffMin < 1) return "방금 전";
    if (diffMin < 60) return `${diffMin}분 전`;
    if (diffHour < 24) return `${diffHour}시간 전`;
    if (diffDay < 10) return `${diffDay}일 전`;

    return d.toLocaleDateString("ko-KR");
  };

  const concerns = useMemo(() => {
    const raw = home?.myConcerns ?? [];

    return raw.map((c) => ({
      id: c.concernId,
      title: c.content,
      content: c.content ?? "",
      createdAt: formatRelativeTime(c.createdAt),
      commentCount: c.commentCount,
    }));
  }, [home]);

  return (
    <OwnerLayout active="home">
      <AppBar title="HOME" layout="center" />

      <main className="px-[16px] pt-[26px]">
        {loading && (
          <p className="typo-14-regular text-neutrals-08">
            불러오는 중...
          </p>
        )}

        {errorMsg && (
          <div className="rounded-[12px] border border-red-200 bg-red-50 p-3">
            <p className="typo-14-regular text-red-600">
              에러: {errorMsg}
            </p>
            <button
              type="button"
              className="mt-2 underline text-red-700"
              onClick={() => window.location.reload()}
            >
              새로고침
            </button>
          </div>
        )}

        {!loading && !errorMsg && (
          <>
            <StatSummary title="누적 아이디어 현황" items={statItems} />

            <div className="mt-[32px]">
              <QuickActions
                left={{
                  label: "고민 올리기",
                  onClick: () =>
                    navigate("/owner/home/post-concern"),
                }}
                right={{
                  label: "쿠폰 관리",
                  onClick: () =>
                    navigate("/owner/home/coupon-manage"),
                }}
              />
            </div>

            <div className="mt-[43px]">
              <SectionHeader
                title="내가 올린 고민"
                actionText="전체 고민 보기"
                onActionClick={() =>
                  navigate("/owner/home/concerns")
                }
              />

              <ConcernList
                items={concerns}
                onItemClick={(item) =>
                  navigate(`/owner/home/concerns/${item.id}`)
                }
              />
            </div>
          </>
        )}
      </main>
    </OwnerLayout>
  );
}
