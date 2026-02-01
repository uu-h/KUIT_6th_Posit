import AppBar from "../../../components/Common/AppBar";
import ConcernReadonlyCard from "../../../components/Owner/Posit/ConcernReadonlyCard";
import AdoptionHeader from "../../../components/Owner/Coupon/AdoptionHeader";

import type { CouponAdoptionDetail } from "../../../types/couponAdoption.types";
// 목업 사용 시
import {
  couponAdoptionMock_concern,
  //   couponAdoptionMock_free,
} from "./couponAdoption.mock";

export default function OwnerCouponAdoptionDetailPage() {
  // mock으로 스위치
  const data: CouponAdoptionDetail = couponAdoptionMock_concern;
  //   const data: CouponAdoptionDetail = couponAdoptionMock_free;

  return (
    <div className="min-h-dvh w-full bg-white">
      <AppBar layout="left" leftType="left" className="bg-white" />

      <main className="mt-[16px] p-[16px]">
        <AdoptionHeader
          mode={data.source}
          concernTitle={
            data.source === "CONCERN" ? data.concern.title : undefined
          }
        />

        <div className="mt-[18px]">
          <ConcernReadonlyCard
            name={data.answer.name}
            gender={data.answer.gender}
            age={data.answer.age}
            title={data.answer.title}
            content={data.answer.content}
            date={data.answer.date}
            imageUrl={data.answer.imageUrl}
          />
        </div>
      </main>
    </div>
  );
}
