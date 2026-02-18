export function statusCodeToText(code: string): string {
  switch (code) {
    case "OPEN":
      return "영업중";
    case "HOLIDAY":
      return "정기휴무";
    case "CLOSED":
      return "영업종료";
    case "UNKNOWN":
    default:
      return "정보 없음";
  }
}
