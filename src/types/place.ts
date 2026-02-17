export type PlaceStatus = "영업 중" | "정기휴무" | "영업 종료";

export type Place = {
  id: number;
  name: string;
  description: string;
  status: PlaceStatus;
  address: string;
  images: string[];
};
