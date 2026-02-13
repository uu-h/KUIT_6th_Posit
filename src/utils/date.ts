const DAY_KR: Record<string, string> = {
  MON: "월요일",
  TUE: "화요일",
  WED: "수요일",
  THU: "목요일",
  FRI: "금요일",
  SAT: "토요일",
  SUN: "일요일",
};

export function dayCodeToKr(code: string | null | undefined): string | null {
  if (!code) return null;

  // 혹시 "SUN,MON" / "SUN|MON" 같은 형태로 올 수도 있으니 안전 처리
  const parts = code.split(/[\s,|/]+/).filter(Boolean);
  const mapped = parts.map((p) => DAY_KR[p] ?? p);

  return mapped.join(", ");
}
