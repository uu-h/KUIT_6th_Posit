export type PlaceStatus = "영업 중" | "영업 종료";

export type Place = {
  id: number;
  name: string;
  description: string;
  status: PlaceStatus;
  address: string;
  images: string[];
};
