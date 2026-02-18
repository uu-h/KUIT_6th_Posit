import { useEffect, useMemo, useRef } from "react";
import AppBar from "../../../components/Common/AppBar";
import ConcernList from "../../../components/Owner/Home/ConcernList";
import { useMyConcernsInfinite } from "../../../hooks/useMyConcernsInfinite";
import { useNavigate } from "react-router-dom";

type Concern = {
  id: number | string;
  title: string;
  content: string;
  createdAt: string;
  commentCount: number;
};

export default function OwnerMyConcernsPage() {
  const navigate = useNavigate();

  const {
    data,
    isLoading,
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
  } = useMyConcernsInfinite({ size: 10 });

  // 18시간 보정 + 상대시간 직접 계산
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

  const items: Concern[] = useMemo(() => {
    const list = ((data as any)?.flat ?? []) as any[];

    return list.map((c) => ({
      id: c.concernId,
      title: c.title ?? c.content ?? "",
      content: c.content ?? "",
      createdAt: formatRelativeTime(c.createdAt),
      commentCount: c.commentCount ?? 0,
    }));
  }, [data]);

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (!first?.isIntersecting) return;
        if (hasNextPage && !isFetchingNextPage) fetchNextPage();
      },
      { root: null, threshold: 0.1 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="min-h-dvh bg-white">
      <AppBar layout="left" leftType="left" />

      <div className="px-[16px]">
        <h1 className="typo-sub-title">내가 올린 고민</h1>
      </div>

      <main className="px-[16px] pb-[24px]">
        {isLoading && <p className="typo-14-regular">불러오는 중...</p>}

        {isError && (
          <div className="py-4">
            <p className="typo-14-regular">목록을 불러오지 못했어요.</p>
            <button
              type="button"
              className="typo-14-semibold"
              onClick={() => refetch()}
            >
              다시 시도
            </button>
          </div>
        )}

        {!isLoading && !isError && (
          <ConcernList
            items={items}
            onItemClick={(item) => {
              navigate(`/owner/home/concerns/${item.id}`);
            }}
          />
        )}

        <div ref={sentinelRef} className="h-[1px]" />

        {isFetchingNextPage && (
          <p className="typo-12-medium text-center py-3">
            더 불러오는 중...
          </p>
        )}

        {!hasNextPage && !isLoading && items.length > 0 && (
          <p className="typo-12-medium text-center py-3">마지막이에요</p>
        )}

        {!isLoading && !isError && items.length === 0 && (
          <p className="typo-14-regular py-6 text-center">
            아직 작성한 고민이 없어요!
          </p>
        )}
      </main>
    </div>
  );
}
