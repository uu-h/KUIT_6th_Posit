import type { StorePositPreview } from "../types/store";

type PositPreviewDto = {
  concern: unknown | null;
  memos: unknown[];
};

function toConcernContent(v: unknown): string | null {
  if (!v || typeof v !== "object") return null;
  const o = v as Record<string, unknown>;
  const c = o.content;
  return typeof c === "string" && c.trim() ? c.trim() : null;
}

function toMemoContent(v: unknown): string | null {
  if (!v || typeof v !== "object") return null;
  const o = v as Record<string, unknown>;
  const c = o.content;
  return typeof c === "string" && c.trim() ? c.trim() : null;
}

function pickMemoContents(dto: PositPreviewDto, max: number): string[] {
  const out: string[] = [];
  for (const m of dto.memos ?? []) {
    const c = toMemoContent(m);
    if (c) out.push(c);
    if (out.length >= max) break;
  }
  return out;
}

export function mapOwnerPosit(dto: PositPreviewDto): StorePositPreview {
  const concernText = toConcernContent(dto.concern);
  return { title: "", subtitle: "", quotes: concernText ? [concernText] : [] };
}

export function mapMyPosit(dto: PositPreviewDto): StorePositPreview {
  const quotes = pickMemoContents(dto, 2);
  return { title: "", subtitle: "", quotes };
}
