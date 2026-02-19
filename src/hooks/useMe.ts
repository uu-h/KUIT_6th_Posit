import { useQuery } from "@tanstack/react-query";
import { getMe } from "../api/user";

export function useMe() {
  const role = localStorage.getItem("role") ?? "guest";

  return useQuery({
    queryKey: ["me", role],
    queryFn: getMe,
    staleTime: 60_000,
  });
}
