// 게스트 가게별 고민 목록 훅

import { useInfiniteQuery } from "@tanstack/react-query";
import { getStoreConcerns, type ConcernDto } from "../api/concerns";

type Options = {
  size?: number;
};

function toCursorId(nextCursor: string | null) {
  if (!nextCursor) return undefined;
  const n = Number(nextCursor);
  return Number.isFinite(n) ? n : undefined;
}

/** 게스트: 특정 가게(storeId)의 사장님 고민 목록 무한스크롤 */
export function useStoreConcernsInfinite(
  storeId: number,
  options: Options = {},
) {
  const { size = 10 } = options;

  return useInfiniteQuery({
    queryKey: ["concerns", "store", storeId, { size }],
    enabled: Number.isFinite(storeId) && storeId > 0, // storeId 준비 전 호출 방지
    queryFn: ({ pageParam }) =>
      getStoreConcerns({
        storeId,
        cursorId: pageParam as number | undefined,
        size,
      }),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => {
      if (!lastPage?.meta?.hasNext) return undefined;
      return toCursorId(lastPage.meta.nextCursor);
    },
    select: (data) => {
      const flat: ConcernDto[] = data.pages.flatMap((p) => p.data.concerns);
      return { ...data, flat };
    },
  });
}
