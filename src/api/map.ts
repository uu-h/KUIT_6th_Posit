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

export const mapApi = {
  // 마커 조회
  getMarkers: () =>
    http.get<ApiResponse<{ stores: StoreMarker[] }>>("/map/stores/markers"),

  // 상세 조회 (필요할 때)
  getStoreDetail: (storeId: number) =>
    http.get<ApiResponse<unknown>>(`/map/stores/${storeId}`),

  // 리스트 조회 (bounds/myLatLng/cursor 등 필요)
  getStores: (params: Record<string, unknown>) =>
    http.get("/map/stores", { params }),
};
