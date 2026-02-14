import { useInfiniteQuery } from "@tanstack/react-query";
import { getMyConcerns, type ConcernDto } from "../api/concerns";

type Options = {
  size?: number;
  onlyUnresolved?: boolean; // 기본 true로 해서 “채택 안된 것만” 화면에 쓰기 좋게
};

function toCursorId(nextCursor: string | null) {
  if (!nextCursor) return undefined;
  const n = Number(nextCursor);
  return Number.isFinite(n) ? n : undefined;
}

export function useMyConcernsInfinite(options: Options = {}) {
  const { size = 10, onlyUnresolved = false } = options;

  const query = useInfiniteQuery({
    queryKey: ["concerns", "mine", { size, onlyUnresolved }],
    queryFn: ({ pageParam }) =>
      getMyConcerns({
        cursorId: pageParam as number | undefined,
        size,
      }),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => {
      if (!lastPage?.meta?.hasNext) return undefined;
      return toCursorId(lastPage.meta.nextCursor);
    },
    select: (data) => {
      // pages를 그대로 유지하면서, 화면에서 쓰기 쉬운 flat list도 같이 뽑기
      const all = data.pages.flatMap((p) => p.data.concerns);
      const filtered = onlyUnresolved ? all.filter((c) => !c.resolved) : all;
      return { ...data, flat: filtered };
    },
  });

  return query;
}
