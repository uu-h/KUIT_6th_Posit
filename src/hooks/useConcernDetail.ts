import { useQuery } from "@tanstack/react-query";
import { getConcernDetail } from "../api/concern";

export function useConcernDetail(concernId?: string) {
  return useQuery({
    queryKey: ["concernDetail", concernId],
    queryFn: () => getConcernDetail(concernId!),
    enabled: !!concernId,
  });
}
