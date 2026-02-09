import { http } from "./http";

export type ApiResponse<T> = {
  isSuccess: boolean;
  data: T;
  meta?: {
    orderType?: string;
    nextCursor?: string;
    hasNext?: boolean;
  };
};

export type StoreMarker = {
  storeId: number;
  name: string;
  lat: number;
  lng: number;
};

// ✅ 마커 조회 쿼리 타입
export type MarkerQuery = {
  swLat: number;
  swLng: number;
  neLat: number;
  neLng: number;
  keyword?: string;
  type?: string; // 1차 필터 코드, "DESSERT" 같은 값
  limit?: number; //기본 20
};

export const mapApi = {
  // ✅ 마커 조회: bounds 필수이므로 params를 받도록 변경
  getMarkers: (params: MarkerQuery) =>
    http.get<ApiResponse<{ stores: StoreMarker[] }>>("/map/stores/markers", {
      params: { ...params, limit: params.limit ?? 20 },
    }),

  getStoreDetail: (storeId: number) =>
    http.get<ApiResponse<unknown>>(`/map/stores/${storeId}`),

  getStores: (params: Record<string, unknown>) =>
    http.get("/map/stores", { params }),
};
