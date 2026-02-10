export function categoryCodeText(code: string): string {
  switch (code) {
    case "CAFE":
      return "카페";
    case "DESSERT":
      return "디저트";
    case "RESTAURANT":
      return "식당";
    default:
      return code; // 서버에서 새로운 값 와도 깨지지 않게
  }
}
