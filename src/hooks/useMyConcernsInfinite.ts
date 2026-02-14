import { useInfiniteQuery } from "@tanstack/react-query";
import { getMyConcerns } from "../api/concerns";

type Options = {
  size?: number;
};

function toCursorId(nextCursor: string | null) {
  if (!nextCursor) return undefined;
  const n = Number(nextCursor);
  return Number.isFinite(n) ? n : undefined;
}

export function useMyConcernsInfinite(options: Options = {}) {
  const { size = 10 } = options;

  return useInfiniteQuery({
    queryKey: ["concerns", "mine", { size }],
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
      const flat = data.pages.flatMap((p) => p.data.concerns);
      return { ...data, flat };
    },
  });
}
