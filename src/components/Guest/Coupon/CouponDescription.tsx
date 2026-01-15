export default function CouponDescription() {
  return (
    <section
      className="
        flex flex-col gap-[20px]
        typo-15-semibold
        [&>div]:flex
        [&>div]:justify-between
        [&>div>span:first-child]:text-neutrals-07
        pt-[20px]
      "
    >
      <div><span>조건</span><span>교환 장소에 방문 후 쿠폰 제시</span></div>
      <div><span>유효기간</span><span>2025년 11월 24일</span></div>
      <div><span>쿠폰 사용처</span><span>카페 레이지아워</span></div>
    </section>
  );
}
