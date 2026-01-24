export type StoreMenuItem = {
  id: string;
  category?: string; // [카페, 디저트] 같은 표기용
  name: string;
  price: number; // 4800
  imageUrl?: string;
};

export type StoreInfoRow = {
  key: "address" | "hours" | "phone" | "link" | "amenities";
  label: string;
  value: string;
  extra?: string;
};

export type StorePositPreview = {
  title: string; // 섹션 타이틀
  subtitle: string; // 설명
  quotes: string[]; // 미리보기 문구들 (1~n)
  onClick?: () => void;
};

export type StoreDetail = {
  id: string;
  name: string;
  categoryText: string; // "카페, 디저트"
  statusText: string; // "영업중"
  shortAddress: string; // "서울 광진구 화양동 3-75"
  fullAddress: string;
  images: string[]; // 가게 이미지들

  infoRows: StoreInfoRow[];

  ownerPosit: StorePositPreview;
  myPosit: StorePositPreview;

  menus: StoreMenuItem[];
};
