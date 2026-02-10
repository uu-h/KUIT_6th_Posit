import type { StoreDetail } from "../types/store";
import { categoryCodeText } from "../utils/category";
import { mapMyPosit, mapOwnerPosit } from "../utils/posit";
import { statusCodeToText } from "../utils/status";

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

export type StoreDetailDto = {
  storeId: number;
  name: string;
  category: "CAFE" | "RESTAURANT" | string;
  statusCode: string;
  openTime: string | null; // "매일 10:00 - 24:00"
  address: {
    road: string | null;
    lot: string | null;
  };
  location: {
    lat: number;
    Lng?: number; // ⚠️ 서버가 Lng로 내려줌 (대문자 L)
    lng?: number; // 혹시 서버가 바뀔 가능성도 대비
  };
  images: {
    imageUrl: string;
    order: number;
  }[];
  menu: unknown[];
  positPreview: {
    concern: unknown | null;
    memos: unknown[];
  };
};

export const mapApi = {
  // ✅ 마커 조회: bounds 필수이므로 params를 받도록 변경
  getMarkers: (params: MarkerQuery) =>
    http.get<ApiResponse<{ stores: StoreMarker[] }>>("/map/stores/markers", {
      params: { ...params, limit: params.limit ?? 20 },
    }),

  getStoreDetail: (storeId: number) =>
    http.get<ApiResponse<StoreDetailDto>>(`/map/stores/${storeId}`),

  getStores: (params: Record<string, unknown>) =>
    http.get("/map/stores", { params }),
};

export function mapStoreDetailDtoToStoreDetail(
  dto: StoreDetailDto,
): StoreDetail {
  return {
    id: `store_${dto.storeId}`,
    name: dto.name,

    categoryText: categoryCodeText(dto.category),
    statusText: statusCodeToText(dto.statusCode),

    shortAddress: dto.address.lot ?? "",
    fullAddress: dto.address.road ?? dto.address.lot ?? "",

    images: dto.images.sort((a, b) => a.order - b.order).map((i) => i.imageUrl),

    lat: dto.location.lat,
    lng: dto.location.Lng ?? 0,

    infoRows: [
      {
        key: "address",
        label: "주소",
        value: dto.address.road ?? "-",
      },
      {
        key: "hours",
        label: "영업시간",
        value: dto.openTime ?? "정보 없음",
      },
    ],

    ownerPosit: mapOwnerPosit(dto.positPreview),
    //     ownerPosit: {
    //   ...mapOwnerPosit(dto.positPreview),
    //   onClick: () => navigate(`/stores/${dto.storeId}/posit/owner`)
    // }

    myPosit: mapMyPosit(dto.positPreview),

    menus: [], // menu API 붙으면 여기서 변환
  };
}
