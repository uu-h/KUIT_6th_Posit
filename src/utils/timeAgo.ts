export function timeAgo(iso: string) {
  const t = new Date(iso).getTime();
  const now = Date.now();
  const diff = Math.max(0, now - t);

  const min = Math.floor(diff / 60000);
  if (min < 60) return `${min}분 전`;

  const h = Math.floor(min / 60);
  if (h < 24) return `${h}시간 전`;

  const d = Math.floor(h / 24);
  return `${d}일 전`;
}
