// 공통 무한 스크롤 훅

import { useInfiniteQuery } from "@tanstack/react-query";
import type {
  ConcernsResponse,
  ConcernDto,
  CursorQuery,
} from "../api/concerns";

function toCursorId(nextCursor: string | null) {
  if (!nextCursor) return undefined;
  const n = Number(nextCursor);
  return Number.isFinite(n) ? n : undefined;
}

export function useConcernsInfiniteBase(params: {
  queryKey: unknown[];
  size?: number;
  fetchPage: (q: CursorQuery) => Promise<ConcernsResponse>;
  enabled?: boolean;
}) {
  const { queryKey, size = 10, fetchPage, enabled = true } = params;

  return useInfiniteQuery({
    queryKey,
    enabled,
    queryFn: ({ pageParam }) =>
      fetchPage({ cursorId: pageParam as number | undefined, size }),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.meta?.hasNext ? toCursorId(lastPage.meta.nextCursor) : undefined,
    select: (data) => {
      const flat: ConcernDto[] = data.pages.flatMap((p) => p.data.concerns);
      return { ...data, flat };
    },
  });
}
