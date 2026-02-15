import { useEffect, useMemo, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import AppBar from "../../../components/Common/AppBar";
import ConcernList from "../../../components/Owner/Home/ConcernList";
import { useStoreConcernsInfinite } from "../../../hooks/useStoreConcernsInfinite";
import { timeAgo } from "../../../utils/timeAgo";
import type { ConcernDto } from "../../../api/concerns";

type Concern = {
  id: number | string;
  title: string;
  content: string;
  createdAt: string;
  commentCount: number;
};

export default function GuestPositConcernListPage() {
  const navigate = useNavigate();

  const location = useLocation();
  const { storeId } = useParams();
  const storeIdNum = Number(storeId);

  // storeId가 이상하면 훅 호출 전에 바로 return (가독성/안전성)
  if (!Number.isFinite(storeIdNum) || storeIdNum <= 0) {
    return (
      <div className="min-h-dvh bg-white">
        <AppBar layout="left" leftType="left" />
        <main className="px-[16px] py-6">
          <p className="typo-14-regular">잘못된 접근입니다. (storeId 없음)</p>
        </main>
      </div>
    );
  }

  const {
    data,
    isLoading,
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
  } = useStoreConcernsInfinite(storeIdNum, { size: 10 });

  const items: Concern[] = useMemo(() => {
    const list: ConcernDto[] = (data as any)?.flat ?? [];
    return list.map((c) => ({
      id: c.concernId,
      title: c.title,
      content: c.content,
      createdAt: timeAgo(c.createdAt),
      commentCount: c.commentCount,
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
        <h1 className="typo-sub-title">사장님 고민 목록</h1>
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
            onItemClick={(c) => {
              navigate(`/guest/stores/${storeIdNum}/posit/concerns/${c.id}`, {
                state: {
                  storeName: (location.state as any)?.storeName,
                  restore: (location.state as any)?.restore,
                  concern: {
                    id: c.id,
                    title: c.title,
                    content: c.content,
                  },
                },
              });
            }}
          />
        )}

        {/* sentinel */}
        <div ref={sentinelRef} className="h-[1px]" />

        {isFetchingNextPage && (
          <p className="typo-12-medium text-center py-3">더 불러오는 중...</p>
        )}

        {!hasNextPage && !isLoading && items.length > 0 && (
          <p className="typo-12-medium text-center py-3">마지막이에요</p>
        )}

        {!isLoading && !isError && items.length === 0 && (
          <p className="typo-14-regular py-6 text-center">
            아직 고민이 없어요!
          </p>
        )}
      </main>
    </div>
  );
}
