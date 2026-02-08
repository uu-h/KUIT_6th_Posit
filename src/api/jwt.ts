// src/api/jwt.ts
export type JwtPayload = {
  exp?: number; // 만료 시간 (UNIX seconds)
  iat?: number; // 발급 시간 (UNIX seconds)
  [key: string]: unknown;
};

// JWT는 base64url이라 atob 전에 변환 필요
function base64UrlDecode(input: string): string {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const pad = base64.length % 4;
  const padded = base64 + (pad ? "=".repeat(4 - pad) : "");

  // UTF-8 안전 디코딩
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function parseJwt(token: string): JwtPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payloadJson = base64UrlDecode(parts[1]);
    return JSON.parse(payloadJson) as JwtPayload;
  } catch {
    return null;
  }
}

export function getJwtExpiryMs(token: string): number | null {
  const payload = parseJwt(token);
  if (!payload?.exp) return null;
  return payload.exp * 1000;
}

export function getJwtRemainingMs(token: string): number | null {
  const expMs = getJwtExpiryMs(token);
  if (expMs == null) return null;
  return expMs - Date.now();
}

// skewMs: 서버/클라 시간차, 네트워크 지연 대비 "여유" (기본 30초)
export function isJwtExpired(token: string, skewMs = 30_000): boolean {
  const remain = getJwtRemainingMs(token);
  if (remain == null) return true; // exp 없으면 보수적으로 만료 취급
  return remain <= skewMs;
}

export function formatRemaining(remainMs: number): string {
  if (remainMs <= 0) return "만료됨";
  const sec = Math.floor(remainMs / 1000);
  const min = Math.floor(sec / 60);
  const rsec = sec % 60;
  return `${min}분 ${rsec}초`;
}

export function getJwtTtlSeconds(token: string): number | null {
  const payload = parseJwt(token);
  if (!payload?.exp || !payload?.iat) return null;
  return payload.exp - payload.iat;
}
