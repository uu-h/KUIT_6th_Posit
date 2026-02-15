import { useQuery } from "@tanstack/react-query";
import { getMe } from "../api/user";

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    staleTime: 60_000, // 1분 정도는 캐시 사용
  });
}
