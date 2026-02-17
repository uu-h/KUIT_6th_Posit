const DAY_KR: Record<string, string> = {
  MON: "월요일",
  TUE: "화요일",
  WED: "수요일",
  THU: "목요일",
  FRI: "금요일",
  SAT: "토요일",
  SUN: "일요일",
};

export function dayCodeToKr(
  code: string | string[] | null | undefined,
): string | null {
  if (!code) return null;

  const parts = Array.isArray(code) ? code : String(code).split(/[\s,|/]+/);

  const mapped = parts
    .map((p) => String(p).trim())
    .filter(Boolean)
    .map((p) => DAY_KR[p] ?? p);

  return mapped.length ? mapped.join(", ") : null;
}
