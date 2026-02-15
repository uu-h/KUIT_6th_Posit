// 사장님 고민 목록 훅

import { getMyConcerns } from "../api/concerns";
import { useConcernsInfiniteBase } from "./useConcernsInfiniteBase";

export function useMyConcernsInfinite(options: { size?: number } = {}) {
  return useConcernsInfiniteBase({
    queryKey: ["concerns", "mine", { size: options.size ?? 10 }],
    size: options.size,
    fetchPage: (q) => getMyConcerns(q),
  });
}
