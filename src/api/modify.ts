import { http } from "./http";

export const getStoreDetail = (storeId: number) =>
  http.get(`/map/stores/${storeId}`);

export const updateStore = ( body: any) =>
  http.put(`/owner/store`, body);
