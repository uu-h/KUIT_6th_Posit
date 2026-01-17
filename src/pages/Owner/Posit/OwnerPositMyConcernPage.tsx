import { useState } from "react";
import AppBar from "../../../components/Common/AppBar";

type CouponOption = "americano" | "dessert" | "icetea";

export default function OwnerPositMyConcernPage() {
  const [content, setContent] = useState("");
  const [coupon, setCoupon] = useState<CouponOption | "">("");

  const isEnabled = content.trim().length > 0 && coupon !== "";

  return (
    <div className="min-h-dvh bg-white flex flex-col">
      {/* Header */}
      <AppBar
        title="나의 고민거리"
        layout="center"
        leftType="left"
        rightType="close"
      />

      {/* Body */}
      <main className="px-[16px] flex-1">
        {/* Textarea Card */}
        <div className="mt-[10px]">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="내용을 입력해주세요."
            className={[
              "w-full h-[270px] resize-none",
              "rounded-[16px] bg-[#FBECEC]",
              "px-[16px] py-[14px]",
              "text-[14px] leading-[150%] text-black",
              "placeholder:text-[#8B8B8B]",
              "outline-none",
            ].join(" ")}
          />
        </div>

        {/* Divider */}
        <div className="mt-[18px] h-[1px] w-full bg-[#E6E6E6]" />

        {/* Coupon Section */}
        <section className="mt-[18px]">
          <h2 className="text-[14px] font-semibold text-black">
            채택 시 쿠폰 지급 설정
          </h2>

          <div className="mt-[12px] space-y-[12px]">
            <label className="flex items-center gap-[10px] cursor-pointer select-none">
              <input
                type="radio"
                name="coupon"
                checked={coupon === "americano"}
                onChange={() => setCoupon("americano")}
                className="h-[18px] w-[18px]"
              />
              <span className="text-[14px] text-black">
                아이스 아메리카노 1잔 무료
              </span>
            </label>

            <label className="flex items-center gap-[10px] cursor-pointer select-none">
              <input
                type="radio"
                name="coupon"
                checked={coupon === "dessert"}
                onChange={() => setCoupon("dessert")}
                className="h-[18px] w-[18px]"
              />
              <span className="text-[14px] text-black">
                디저트 20% 할인 쿠폰
              </span>
            </label>

            <label className="flex items-center gap-[10px] cursor-pointer select-none">
              <input
                type="radio"
                name="coupon"
                checked={coupon === "icetea"}
                onChange={() => setCoupon("icetea")}
                className="h-[18px] w-[18px]"
              />
              <span className="text-[14px] text-black">아이스티 1잔 무료</span>
            </label>
          </div>

          {/* Info line */}
          <div className="mt-[14px] flex items-start gap-[6px]">
            <span className="text-[#7A7A7A] text-[12px] leading-[18px]">ⓘ</span>
            <p className="text-[#7A7A7A] text-[12px] leading-[18px]">
              사용자의 아이디어가 채택되면 자동으로 쿠폰이 지급됩니다.
            </p>
          </div>
        </section>
      </main>

      {/* Bottom Button */}
      <div className="px-[16px] pb-[20px] pt-[14px]">
        <button
          type="button"
          disabled={!isEnabled}
          onClick={() => {
            // UI-only: 나중에 submit 연결
            console.log({ content, coupon });
          }}
          className={[
            "w-full h-[52px] rounded-[14px]",
            "text-[16px] font-semibold",
            "bg-[#FF6B63] text-white",
            "disabled:opacity-50 disabled:cursor-not-allowed",
          ].join(" ")}
        >
          확인
        </button>
      </div>
    </div>
  );
}
