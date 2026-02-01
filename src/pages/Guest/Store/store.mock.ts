import type { StoreDetail } from "../../../types/store";

const statusText = "영업중";

export const storeDetailMocks: StoreDetail[] = [
  {
    id: "store_001",
    name: "카페 레이지아워",
    categoryText: "카페, 디저트",
    statusText,
    shortAddress: "서울 광진구 화양동 3-75", // 지번
    fullAddress: "서울 광진구 아차산로33길 68 지하1층", //도로명
    images: ["/img1.png", "/img2.png", "/img3.png"],

    lat: 37.54312,
    lng: 127.071253,

    infoRows: [
      {
        key: "address",
        label: "주소",
        value: "서울 광진구 아차산로33길 68 지하1층",
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
        extra: "가게로 연결되는 번호입니다.",
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
      quotes: [
        "매장 조명을 조금 더 밝게 바꿔야 할까요?",
        "새로운 두바이 디저트 메뉴로 어떤 것이 좋을까요?",
      ],
    },

    myPosit: {
      title: "내 의견 POSiT! 하러가기",
      subtitle:
        "카페를 이용하고 자유로운 의견을 \n POSiT으로 보내, 무료 음료 얻으러 가기",
      quotes: [
        "유리창 근처 좌석에 햇빛이 너무 강해요.",
        "노래가 조금 시끄러워요.",
      ],
    },

    menus: [
      {
        id: "store_001_m1",
        category: "Coffee",
        name: "솔티 아이스페너",
        price: 4800,
        imageUrl: "/menu1.png",
      },
      {
        id: "store_001_m2",
        category: "Dessert",
        name: "뺑 오 스위스",
        price: 6000,
        imageUrl: "/menu2.png",
      },
      {
        id: "store_001_m3",
        category: "Dessert",
        name: "깍뚝 말차",
        price: 5500,
        imageUrl: "/menu3.png",
      },
    ],
  },
  {
    id: "store_002",
    name: "마이 디어 버터하우스",
    categoryText: "디저트 카페",
    statusText,
    shortAddress: "서울 광진구 화양동 16-37",
    fullAddress: "서울 광진구 능동로13길 74 1층",
    images: ["/img1.png", "/img2.png", "/img3.png"],

    lat: 37.544966,
    lng: 127.069126,

    infoRows: [
      { key: "address", label: "주소", value: "서울 광진구 능동로13길 74 1층" },
      {
        key: "hours",
        label: "영업",
        value: `${statusText} · 22:00에 영업 종료`,
        extra: "매일 12:00 - 22:00",
      },
      {
        key: "phone",
        label: "전화",
        value: "0507-1331-9074",
        extra: "가게로 연결되는 번호입니다.",
      },
      {
        key: "link",
        label: "링크",
        value:
          "https://www.instagram.com/my_dear_butterhouse/profilecard/?igsh=MWh6ZzUzam9iNGRyZA%3D%3D",
      },
      {
        key: "amenities",
        label: "편의",
        value: "무선 인터넷, 단체 이용 가능, 포장, 배달",
      },
    ],

    ownerPosit: {
      title: "사장님 고민 POSiT! 하러가기",
      subtitle: "사장님 고민거리를 보고, \n POSiT을 보내 무료 음료 얻으러 가기",
      quotes: [
        "키티 휘낭시에 맛을 다양화할까요?",
        "티라미수에 코코아 파우더가 너무 많나요?",
      ],
    },

    myPosit: {
      title: "내 의견 POSiT! 하러가기",
      subtitle:
        "카페를 이용하고 자유로운 의견을 \n POSiT으로 보내, 무료 음료 얻으러 가기",
      quotes: ["좋은 공간이에요!"],
    },

    menus: [
      {
        id: "store_002_m1",
        category: "Dessert",
        name: "판나코타",
        price: 6000,
        imageUrl: "/menu1.png",
      },
      {
        id: "store_002_m2",
        category: "Dessert",
        name: "하트 티라미수",
        price: 7000,
        imageUrl: "/menu2.png",
      },
      {
        id: "store_002_m3",
        category: "Dessert",
        name: "휘낭시에",
        price: 3800,
        imageUrl: "/menu3.png",
      },
    ],
  },

  {
    id: "store_003",
    name: "도우터",
    categoryText: "브런치 카페",
    statusText,
    shortAddress: "화양동 11-17",
    fullAddress: "서울 광진구 아차산로31길 40 1층",
    images: ["/img1.png", "/img2.png", "/img3.png"],

    lat: 37.542712,
    lng: 127.070158,

    infoRows: [
      {
        key: "address",
        label: "주소",
        value: "서울 광진구 아차산로31길 40 1층",
      },
      {
        key: "hours",
        label: "영업",
        value: `${statusText} ·  22:30에 영업 종료`,
        extra: "매일 11:00 - 22:30",
      },
      {
        key: "phone",
        label: "전화",
        value: "0507-1478-0559",
        extra: "가게로 연결되는 번호입니다.",
      },
      {
        key: "link",
        label: "링크",
        value: "https://www.instagram.com/daughter_cafe.bar",
      },
      {
        key: "amenities",
        label: "편의",
        value: "단체 이용 가능, 무선 인터넷, 포장",
      },
    ],

    ownerPosit: {
      title: "사장님 고민 POSiT! 하러가기",
      subtitle: "사장님 고민거리를 보고, \n POSiT을 보내 무료 음료 얻으러 가기",
      quotes: ["플레이트에 바질 추가는 어떤가요?"],
    },

    myPosit: {
      title: "내 의견 POSiT! 하러가기",
      subtitle:
        "카페를 이용하고 자유로운 의견을 \n POSiT으로 보내, 무료 음료 얻으러 가기",
      quotes: ["좋은 공간이에요!"],
    },

    menus: [
      {
        id: "store_003_m1",
        category: "Brunch",
        name: "연어 차지키 샤워도우",
        price: 26000,
        imageUrl: "/menu1.png",
      },
      {
        id: "store_003_m2",
        category: "Brunch",
        name: "브런치 플레이트",
        price: 23000,
        imageUrl: "/menu2.png",
      },
      {
        id: "store_003_m3",
        category: "Brunch",
        name: "씨리얼프렌치 토스트 브리오슈",
        price: 15000,
        imageUrl: "/menu3.png",
      },
    ],
  },

  {
    id: "store_004",
    name: "cafe 462",
    categoryText: "디저트 카페",
    statusText,
    shortAddress: "화양동 46-2",
    fullAddress: "서울 광진구 동일로24길 54 1층",
    images: ["/img1.png", "/img2.png", "/img3.png"],

    lat: 37.543181,
    lng: 127.06788,

    infoRows: [
      { key: "address", label: "주소", value: "서울 광진구 동일로24길 54 1층" },
      {
        key: "hours",
        label: "영업",
        value: `${statusText} ·  20:30에 영업 종료`,
        extra: "매일 12:00 - 20:30",
      },
      {
        key: "phone",
        label: "전화",
        value: "0507-1341-8216",
        extra: "가게로 연결되는 번호입니다.",
      },
      { key: "amenities", label: "편의", value: "포장, 예약, 무선 인터넷" },
    ],

    ownerPosit: {
      title: "사장님 고민 POSiT! 하러가기",
      subtitle: "사장님 고민거리를 보고, \n POSiT을 보내 무료 음료 얻으러 가기",
      quotes: ["단일 초코 케이크를 메뉴에 추가할까요?"],
    },

    myPosit: {
      title: "내 의견 POSiT! 하러가기",
      subtitle:
        "카페를 이용하고 자유로운 의견을 \n POSiT으로 보내, 무료 음료 얻으러 가기",
      quotes: ["좋은 공간이에요!"],
    },

    menus: [
      {
        id: "store_004_m1",
        category: "Coffee",
        name: "462판단라떼",
        price: 5000,
        imageUrl: "/menu1.png",
      },
      {
        id: "store_004_m2",
        category: "Dessert",
        name: "빅토리아케이크",
        price: 9500,
        imageUrl: "/menu2.png",
      },
      {
        id: "store_004_m3",
        category: "Dessert",
        name: "체리베리케이크",
        price: 8500,
        imageUrl: "/menu3.png",
      },
    ],
  },

  {
    id: "store_005",
    name: "카페 언필드",
    categoryText: "디저트 카페, 브런치 카페",
    statusText,
    shortAddress: "서울 광진구 화양동 49-15",
    fullAddress: "서울 광진구 동일로22길 30 2층",
    images: ["/img1.png", "/img2.png", "/img3.png"],

    lat: 37.542093,
    lng: 127.06594,

    infoRows: [
      { key: "address", label: "주소", value: "서울 광진구 동일로22길 30 2층" },
      {
        key: "hours",
        label: "영업",
        value: `${statusText} ·  22:00에 영업 종료`,
        extra: "매일 12:00 - 22:00 · 휴무: 화요일",
      },
      {
        key: "phone",
        label: "전화",
        value: "0507-1374-6750",
        extra: "가게로 연결되는 번호입니다.",
      },
      {
        key: "link",
        label: "링크",
        value: "https://www.instagram.com/cafe.unfield",
      },
      {
        key: "amenities",
        label: "편의",
        value: "포장, 무선 인터넷, 배달, 단체 이용 가능",
      },
    ],

    ownerPosit: {
      title: "사장님 고민 POSiT! 하러가기",
      subtitle: "사장님 고민거리를 보고, \n POSiT을 보내 무료 음료 얻으러 가기",
      quotes: ["프렌치토스트에 과일 추가 시 가격이 얼마가 적당할까요?"],
    },

    myPosit: {
      title: "내 의견 POSiT! 하러가기",
      subtitle:
        "카페를 이용하고 자유로운 의견을 \n POSiT으로 보내, 무료 음료 얻으러 가기",
      quotes: ["좋은 공간이에요!"],
    },

    menus: [
      {
        id: "store_005_m1",
        category: "Dessert",
        name: "프렌치토스트",
        price: 8200,
        imageUrl: "/menu1.png",
      },
      {
        id: "store_005_m2",
        category: "Dessert",
        name: "바닐라카라멜 푸딩",
        price: 5800,
        imageUrl: "/menu2.png",
      },
      {
        id: "store_005_m3",
        category: "Dessert",
        name: "브륄레치즈케이크",
        price: 6900,
        imageUrl: "/menu3.png",
      },
    ],
  },

  {
    id: "store_006",
    name: "더이퀄브리엄카페",
    categoryText: "디저트 카페",
    statusText,
    shortAddress: "서울 광진구 자양동 7-30",
    fullAddress: "서울 광진구 아차산로30길 7 3층 더이퀼리브리엄커피",
    images: ["/img1.png", "/img2.png", "/img3.png"],

    lat: 37.540266,
    lng: 127.067795,

    infoRows: [
      {
        key: "address",
        label: "주소",
        value: "서울 광진구 아차산로30길 7 3층 더이퀼리브리엄커피",
      },
      {
        key: "hours",
        label: "영업",
        value: `${statusText} ·  22:00에 영업 종료`,
        extra: "매일 12:00 - 22:00 · 휴무: 화요일",
      },
      {
        key: "phone",
        label: "전화",
        value: "0507-1332-6073",
        extra: "가게로 연결되는 번호입니다.",
      },
      {
        key: "link",
        label: "링크",
        value: "https://www.instagram.com/eqbmcoffee",
      },
      { key: "amenities", label: "편의", value: "무선 인터넷, 포장" },
    ],

    ownerPosit: {
      title: "사장님 고민 POSiT! 하러가기",
      subtitle: "사장님 고민거리를 보고, \n POSiT을 보내 무료 음료 얻으러 가기",
      quotes: ["디저트 류에 제철과일을 같이 곁들이는 건 어떤가요?'"],
    },

    myPosit: {
      title: "내 의견 POSiT! 하러가기",
      subtitle:
        "카페를 이용하고 자유로운 의견을 \n POSiT으로 보내, 무료 음료 얻으러 가기",
      quotes: ["좋은 공간이에요!"],
    },

    menus: [
      {
        id: "store_006_m1",
        category: "Coffee",
        name: "수제 밀크티",
        price: 9000,
        imageUrl: "/menu1.png",
      },
      {
        id: "store_006_m2",
        category: "Coffee",
        name: "화이트슈페너",
        price: 6500,
        imageUrl: "/menu2.png",
      },
      {
        id: "store_006_m3",
        category: "Coffee",
        name: "트와일라잇",
        price: 8000,
        imageUrl: "/menu3.png",
      },
    ],
  },
];

// 한 개만 쓸 때
// const stores = [storeDetailMock];
export const storeDetailMock: StoreDetail = storeDetailMocks[0];
