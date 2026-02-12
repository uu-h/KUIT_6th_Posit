import { http } from "./http";

export type StoreType = "STUDY" | "BRUNCH" | "DESSERT";

export interface CreateStoreRequest {
  name: string;
  address: {
    roadAddress: string;
    detailAddress: string;
  };
  type: StoreType;
  phone: string;
  snsUrl?: string;
  description: string;
  couponPin: string;
  imageUrls: string[];
  operation: {
    regularHolidays: string[];
    openDay: string[];
    openTime: string;
    closeTime: string;
  };
  convinces: string[];
  menus: {
    name: string;
    price: number;
    imageUrl: string;
  }[];
}

export const createStore = async (data: CreateStoreRequest) => {
  const res = await http.post("/stores", data);
  return res.data;
};
