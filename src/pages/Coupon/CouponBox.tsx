import CouponCard from "./components/CouponCard";
import { useState } from "react";
import BottomBar from "../../components/BottomBar";

const couponsData = [
  { brand: "테라커피", menu: "아이스 아메리카노 1잔 무료", expiration: "2025.12.19까지", brandImg: "src/assets/Guest/Coupon/TerraCoffee.svg" },
  { brand: "카페 레이지아워", menu: "아이스 아메리카노 1잔 무료", expiration: "2026.02.24까지", brandImg: "src/assets/Guest/Coupon/LazyHour.svg" },
  { brand: "카페 언필드", menu: "아이스 아메리카노 1잔 무료", expiration: "2026.05.26까지", brandImg: "src/assets/Guest/Coupon/CafeUnfield.svg" },
  { brand: "도우터", menu: "아이스 아메리카노 1잔 무료", expiration: "2025.11.30까지", brandImg: "src/assets/Guest/Coupon/CafeDaughter.svg" },
];

export default function CouponBox() {
  const [selectedTab, setSelectedTab] = useState<"available" | "used">("available");

  return (
    <div className="h-full w-full flex flex-col mt-[22px]">
      <header className="flex flex-col gap-[26px] px-[16px]">
        <div className="flex items-start justify-start gap-[12px]">
          <img src="src/assets/Guest/Coupon/LeftArrow.svg" alt="왼쪽 화살표" />
          <h1 className="typo-sub-title">쿠폰함</h1>
        </div>
      </header>

      <div className="flex pt-[58px]">
        <button
          onClick={() => setSelectedTab("available")}
          className={` 
            w-[187px] h-[36px]
            flex flex-col items-center
            ${selectedTab === "available" ? "border-b-2 border-black" : "border-b-1 border-[#717171] text-neutrals-06"}
          `}
        >
          <span className="typo-16-semibold">사용가능 4</span>

        </button>
        <button
          onClick={() => setSelectedTab("used")}
          className={`
            w-[187px] h-[36px]
            flex flex-col items-center
            ${selectedTab === "used" ? "border-b-2 border-black" : "border-b-1 border-[#717171] text-neutrals-06"}
          `}
        >
          <span className="typo-16-semibold">사용완료 4</span>
        </button>
    </div>

    <div className="overflow-y-auto pt-[57px] pb-[177px] scrollbar-hide">
        <div className="flex flex-col gap-[37px] items-center">
          {couponsData.map((coupon, idx) => (
            <CouponCard
              key={idx}
              brand={coupon.brand}
              menu={coupon.menu}
              expiration={coupon.expiration}
              brandImg={coupon.brandImg}
              selectedTab={selectedTab}
            />
          ))}
        </div>
      </div>

      <BottomBar active="coupon" onChange={(key) => console.log(key)} />
    </div>
  );
}
