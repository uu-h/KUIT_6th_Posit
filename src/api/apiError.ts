export type DtoFieldError = { field: string; message: string };

export type ApiErrorNormalized = {
  status?: number;
  errorCode?: string;
  code?: number;
  message?: string;
  errors?: DtoFieldError[];
};

export function normalizeApiError(err: any): ApiErrorNormalized {
  const res = err?.response;
  const data = res?.data ?? {};

  return {
    status: res?.status,
    errorCode: data?.errorCode,
    code: data?.code,
    message: data?.message,
    errors: Array.isArray(data?.errors) ? data.errors : undefined,
  };
}

/** errors 배열을 { [field]: message } 형태로 */
export function toFieldErrorMap(errors?: DtoFieldError[]) {
  const map: Record<string, string> = {};
  if (!errors) return map;

  for (const e of errors) {
    // 같은 field가 여러 개면 마지막이 덮어씀 (원하면 첫 번째만 유지하도록 바꿔도 됨)
    map[e.field] = e.message;
  }
  return map;
}
