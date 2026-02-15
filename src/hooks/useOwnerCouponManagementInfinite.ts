import { useInfiniteQuery } from "@tanstack/react-query";
import { getOwnerCouponManagement } from "../api/ownerCouponManagement";

type ApiResponse = Awaited<ReturnType<typeof getOwnerCouponManagement>>;

export function useOwnerCouponManagementInfinite(size = 10) {
  return useInfiniteQuery({
    queryKey: ["owner", "coupon-management", size],
    initialPageParam: undefined as string | undefined,

    queryFn: ({ pageParam }) =>
      getOwnerCouponManagement({
        size,
        // 서버는 meta.nextCursor를 주고, 요청은 cursorId로 받는다고 했으니 cursorId에 넣기
        cursorId: pageParam,
      }),

    getNextPageParam: (lastPage: ApiResponse) => {
      // meta 기반
      const hasNext = lastPage.meta?.hasNext;
      const nextCursor = lastPage.meta?.nextCursor;
      return hasNext ? (nextCursor ?? undefined) : undefined;
    },

    select: (data) => {
      const pages = data.pages;

      const summary = pages[0]?.data.summary;
      const flatItems = pages.flatMap((p) => p.data.items);

      return {
        ...data,
        summary,
        flatItems,
      };
    },
  });
}
