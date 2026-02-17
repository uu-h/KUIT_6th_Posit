import type { CouponIssuedSection } from "../../../types/coupon.types";
import CouponCard from "./CouponCard";

type Props = {
  sections: CouponIssuedSection[];
  onDetailClick?: (memoId: number) => void; 
};

export default function CouponIssuedSectionList({
  sections,
  onDetailClick,
}: Props) {
  return (
    <div className="space-y-[22px]">
      {sections.map((section) => (
        <section key={section.issuedAt}>
          <p className="typo-14-regular">
            발행일{" "}
            <span className="typo-14-semibold">{section.issuedAt}</span>
          </p>

          <div className="mt-[9px] space-y-[12px]">
            {section.items.map((coupon) => (
              <CouponCard
                key={coupon.id} 
                coupon={coupon}
                onDetailClick={() =>
                  onDetailClick?.(coupon.memoId) 
                }
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
