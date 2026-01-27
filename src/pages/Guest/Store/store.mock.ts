import type { StoreDetail } from "../../../types/store";

const statusText = "영업중";

export const storeDetailMock: StoreDetail = {
  id: "store_001",
  name: "카페 레이지아워",
  categoryText: "카페, 디저트",
  statusText,
  shortAddress: "서울 광진구 화양동 3-75",
  fullAddress: "서울 광진구 아차산로33길 68 지하1층 레이지아워",
  images: ["/img1.png", "/img2.png", "/img3.png"],

  lat: 37.543284,
  lng: 127.071256,

  infoRows: [
    {
      key: "address",
      label: "주소",
      value: "서울 광진구 아차산로33길 68 지하1층 레이지아워",
    },
    {
      key: "hours",
      label: "영업",
      value: `${statusText} · 24:00에 영업 종료`,
      extra: "매일 10:00 - 24:00",
    },
    {
      key: "phone",
      label: "전화",
      value: "02-XXXX-XXXX",
      extra:
        "카페 레이지아워로 연결되는 번호입니다. \n 휴대전화번호 010-xxxx-xxxx",
    },
    {
      key: "link",
      label: "링크",
      value: "https://www.instagram.com/lazyhou_r?igsh=MWJI...",
    },
    {
      key: "amenities",
      label: "편의",
      value: "포장, 예약, 단체 이용 가능, 무선 인터넷, 반려동물 동반",
    },
  ],

  ownerPosit: {
    title: "사장님 고민 POSiT! 하러가기",
    subtitle: "사장님 고민거리를 보고, \n POSiT을 보내 무료 음료 얻으러 가기",
    quotes: ["매장 조명을 조금 더 밝게 바꿔야 할..."],
  },

  myPosit: {
    title: "내 의견 POSiT! 하러가기",
    subtitle:
      "카페를 이용하고 자유로운 의견을 \n POSiT으로 보내, 무료 음료 얻으러 가기",
    quotes: ["유리창 근처 좌석에 햇빛이 너무 강해요.", "노래가 조금 시끄..."],
  },

  menus: [
    {
      id: "m1",
      category: "Coffee",
      name: "솔티 아이스페너",
      price: 4800,
      imageUrl: "/menu1.png",
    },
    {
      id: "m2",
      category: "Bakery",
      name: "뺑 오 스위스",
      price: 6000,
      imageUrl: "/menu2.png",
    },
    {
      id: "m3",
      category: "Bakery",
      name: "깍뚝 말차",
      price: 5500,
      imageUrl: "/menu3.png",
    },
  ],
};
