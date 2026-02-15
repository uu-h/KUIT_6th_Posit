import { http } from "./http";
import type { OwnerHomeResponse, OwnerHomeData } from "../types/ownerHome";

export const ownerApi = {
  getHome: async (): Promise<OwnerHomeData> => {
    const res = await http.get<OwnerHomeResponse>("/owner/home");
    if (!res.data.isSuccess) {
      throw new Error("Owner home API failed");
    }
    return res.data.data;
  },
};
