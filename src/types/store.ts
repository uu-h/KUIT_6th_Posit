export type StoreMenuItem = {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  category?: string;
};

export type StoreInfoRow = {
  key: "address" | "hours" | "phone" | "snslink" | "convince";
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
  categoryText: string;
  statusText: string;

  shortAddress: string;
  fullAddress: string;

  images: string[];

  lat: number;
  lng: number;

  infoRows: StoreInfoRow[];

  ownerPosit: unknown;
  myPosit: unknown;

  menus: StoreMenuItem[];

  description?: string;
  convinces?: string[]; // “포장 가능/예약 가능 …”
  snsLink?: string | null;
};
