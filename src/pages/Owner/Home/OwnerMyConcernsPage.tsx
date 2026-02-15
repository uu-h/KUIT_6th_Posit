import { useEffect, useMemo, useRef } from "react";
import AppBar from "../../../components/Common/AppBar";
import ConcernList from "../../../components/Owner/Home/ConcernList";
import { useMyConcernsInfinite } from "../../../hooks/useMyConcernsInfinite";
import { timeAgo } from "../../../utils/timeAgo";

type Concern = {
  id: number | string;
  title: string;
  createdAt: string; // "2일 전"
  commentCount: number;
};

export default function OwnerMyConcernsPage() {
  const {
    data,
    isLoading,
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
  } = useMyConcernsInfinite({ size: 10 });

  // ✅ 서버가 준 순서 그대로 + timeAgo만 적용
  const items: Concern[] = useMemo(() => {
    const list = ((data as any)?.flat ?? []) as any[];

    return list.map((c) => ({
      id: c.concernId,
      title: c.title ?? c.content ?? "",
      createdAt: timeAgo(c.createdAt),
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
            onItemClick={(id) => {
              // TODO: 고민 상세 연결
              console.log("clicked concern:", id);
            }}
          />
        )}

        <div ref={sentinelRef} className="h-[1px]" />

        {isFetchingNextPage && (
          <p className="typo-12-medium text-center py-3">더 불러오는 중...</p>
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
