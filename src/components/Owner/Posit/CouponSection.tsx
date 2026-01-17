import CouponRadioGroup, { type CouponOption } from "./CouponRadioGroup";
import InfoLine from "./InfoLine";

type CouponSectionProps = {
  value: CouponOption | "";
  onChange: (value: CouponOption) => void;
};

export default function CouponSection({ value, onChange }: CouponSectionProps) {
  return (
    <section className="mt-[15px]">
      <h2 className="typo-15-medium">채택 시 쿠폰 지급 설정</h2>

      <CouponRadioGroup value={value} onChange={onChange} />

      <InfoLine
        className="mt-[20px]"
        text="사용자의 아이디어가 채택되면 자동으로 쿠폰이 지급됩니다."
      />
    </section>
  );
}
