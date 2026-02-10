import type { StorePositPreview } from "../types/store";

type PositPreviewDto = {
  concern: unknown | null;
  memos: unknown[];
};

// memo가 문자열이 아닐 수도 있으니 안전하게 문자열로 뽑아내는 함수
function toText(v: unknown): string | null {
  if (typeof v === "string") return v.trim() || null;
  if (v && typeof v === "object") {
    // 서버 memo 구조가 나중에 { content: "..." } 같은 형태일 가능성 대비
    const anyObj = v as Record<string, unknown>;
    const c = anyObj.content;
    if (typeof c === "string") return c.trim() || null;
    const t = anyObj.text;
    if (typeof t === "string") return t.trim() || null;
  }
  return null;
}

function pickQuotes(dto: PositPreviewDto, max = 3): string[] {
  const quotes: string[] = [];
  for (const m of dto.memos ?? []) {
    const t = toText(m);
    if (t) quotes.push(t);
    if (quotes.length >= max) break;
  }
  return quotes;
}

export function mapOwnerPosit(dto: PositPreviewDto): StorePositPreview {
  const quotes = pickQuotes(dto, 3);

  // concern이 null이면 아직 사장님 포짓이 없다는 의미로 처리
  const hasOwnerPosit = dto.concern !== null;

  if (!hasOwnerPosit) {
    return {
      title: "사장님 포짓",
      subtitle: "아직 등록된 사장님 포짓이 없어요.",
      quotes: quotes.length ? quotes : ["첫 포짓을 등록해보세요!"],
    };
  }

  return {
    title: "사장님 포짓",
    subtitle: "사장님의 고민/메모 미리보기",
    quotes: quotes.length ? quotes : ["등록된 메모가 아직 없어요."],
  };
}

export function mapMyPosit(_dto: PositPreviewDto): StorePositPreview {
  // API에 '내 포짓'이 아직 없으니 기본 상태로
  return {
    title: "내 포짓",
    subtitle: "내가 작성한 포짓이 아직 없어요.",
    quotes: ["첫 포짓을 남겨보세요!"],
  };
}
