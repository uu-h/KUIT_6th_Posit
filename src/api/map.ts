import type { StoreDetail, StoreInfoRow, StoreMenuItem } from "../types/store";
import { categoryCodeText, typeCodeText } from "../utils/category";
import { dayCodeToKr } from "../utils/date";
import { mapMyPosit, mapOwnerPosit } from "../utils/posit";
import { statusCodeToText } from "../utils/status";
import { http } from "./http";

/** =========================
 *  Common API Envelope
 *  ========================= */
export type ApiResponse<T> = {
  isSuccess: boolean;
  data: T;
  meta?: {
    orderType?: string;
    nextCursor?: string;
    hasNext?: boolean;
  };
};

/** =========================
 *  Marker API
 *  ========================= */
export type StoreMarker = {
  storeId: number;
  name: string;
  lat: number;
  lng: number;
};

export type MarkerQuery = {
  swLat: number;
  swLng: number;
  neLat: number;
  neLng: number;
  keyword?: string;
  type?: string; // e.g. "DESSERT"
  limit?: number; // default 20
};

/** =========================
 *  Store Detail DTO (Server)
 *  - 서버 응답 기준으로 하나만 유지!
 *  ========================= */
export type StoreImageDto = {
  imageId: number;
  imageUrl: string | null;
  thumbnailUrl: string | null;
  order: number | null;
};

export type StoreAddressDto = {
  road: string | null;
  lot: string | null;
};

export type StoreLocationDto = {
  lat: number;
  /** 서버가 "Lng"로 주는 케이스가 있어서 그대로 받되, 바뀔 가능성 대비 */
  Lng?: number | null;
  lng?: number | null;
};

export type StoreConvinceDto = {
  displayName: string | null;
};

export type StoreMenuDto = {
  imageUrl: string | null;
  name: string | null;
  price: number | null;
  order: number | null;
};

export type PositConcernDto = {
  concernId: number;
  content: string | null;
};

export type PositMemoDto = {
  memoId: number;
  content: string | null;
};

export type PositPreviewDto = {
  concern: PositConcernDto | null;
  memos: PositMemoDto[];
};

export type StoreDetailDto = {
  storeId: number;
  name: string;
  category: string;
  typeCode: string;
  description: string | null;
  phone: string | null;
  statusCode: string | null;
  openTime: string | null;
  notOpen: string | null;
  address: StoreAddressDto;
  location: StoreLocationDto;
  snsLink: string | null;
  convince: StoreConvinceDto[];
  images: StoreImageDto[];
  menu: StoreMenuDto[];
  positPreview: PositPreviewDto;
};

/** =========================
 *  API functions
 *  ========================= */
export const mapApi = {
  getMarkers: (params: MarkerQuery) =>
    http.get<ApiResponse<{ stores: StoreMarker[] }>>("/map/stores/markers", {
      params: { ...params, limit: params.limit ?? 20 },
    }),

  getStoreDetail: (storeId: number) =>
    http.get<ApiResponse<StoreDetailDto>>(`/map/stores/${storeId}`),

  getStores: (params: Record<string, unknown>) =>
    http.get<ApiResponse<unknown>>("/map/stores", { params }),
};

/** =========================
 *  Mapper: DTO -> Domain(StoreDetail)
 *  ========================= */
export function mapStoreDetailDtoToStoreDetail(
  dto: StoreDetailDto,
): StoreDetail {
  const road = dto.address?.road ?? "";
  const lot = dto.address?.lot ?? "";

  const images = Array.isArray(dto.images)
    ? dto.images
        .slice()
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .map((img) => img.thumbnailUrl ?? img.imageUrl)
        .filter((v): v is string => Boolean(v))
    : [];

  const lng = dto.location?.Lng ?? dto.location?.lng ?? 0;

  const convinces = Array.isArray(dto.convince)
    ? dto.convince
        .map((c) => c.displayName)
        .filter((v): v is string => Boolean(v))
    : [];

  const openTimeText = dto.openTime ?? "정보 없음";
  const notOpenKr = dayCodeToKr(dto.notOpen);
  const hoursValue = notOpenKr
    ? `${openTimeText}, 정기휴무:${notOpenKr}`
    : `매일 ${openTimeText}`;

  const infoRows: StoreInfoRow[] = [
    {
      key: "address",
      label: "주소",
      value: road,
      extra: road,
    },
    {
      key: "hours",
      label: "영업시간",
      value: hoursValue,
      extra: hoursValue,
    },
    ...(dto.phone
      ? ([
          {
            key: "phone",
            label: "전화번호",
            value: dto.phone,
          },
        ] as StoreInfoRow[])
      : []),
    ...(dto.snsLink
      ? ([
          {
            key: "snslink",
            label: "링크",
            value: dto.snsLink,
          },
        ] as StoreInfoRow[])
      : []),

    ...(convinces.length
      ? ([
          {
            key: "convince",
            label: "편의",
            value: convinces.join(", "),
            extra: convinces.map((v) => `• ${v}`).join("\n"),
          },
        ] as StoreInfoRow[])
      : []),
  ];

  const menus: StoreMenuItem[] = (dto.menu ?? [])
    .slice()
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((m, idx) => ({
      id: `menu_${dto.storeId}_${m.order ?? idx}`, // ✅ key용
      name: m.name ?? "-",
      price: m.price ?? 0,
      imageUrl: m.imageUrl ?? undefined,
    }));

  return {
    id: `store_${dto.storeId}`,
    name: dto.name,

    categoryText: categoryCodeText(dto.category),
    typeCode: typeCodeText(dto.typeCode),
    statusText: statusCodeToText(dto.statusCode ?? "UNKNOWN"),

    shortAddress: lot,
    fullAddress: road || lot,

    images,
    lat: dto.location?.lat ?? 0,
    lng,

    infoRows,

    ownerPosit: mapOwnerPosit(dto.positPreview),
    myPosit: mapMyPosit(dto.positPreview),

    menus,

    // 있으면 UI 확장용
    description: dto.description ?? undefined,
    convinces,
    snsLink: dto.snsLink,
  };
}
