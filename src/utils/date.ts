const DAY_KR: Record<string, string> = {
  MON: "월",
  TUE: "화",
  WED: "수",
  THU: "목",
  FRI: "금",
  SAT: "토",
  SUN: "일",
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
