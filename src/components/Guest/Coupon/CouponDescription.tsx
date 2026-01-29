interface DescriptionProps {
  expiration: string; 
  brand: string;
}

export default function CouponDescription({ expiration, brand }: DescriptionProps) {

  const dateParts = expiration.split(".");
  
  const formattedDate = dateParts.length === 3 
    ? `${dateParts[0]}년 ${dateParts[1]}월 ${dateParts[2]}일`
    : expiration;

  return (
    <section
      className="
        flex flex-col gap-[20px]
        typo-15-semibold
        [&>div]:flex
        [&>div]:justify-between
        [&>div>span:first-child]:text-neutrals-07
        w-full
        pt-[20px]
      "
    >
      <div>
        <span>조건</span>
        <span>교환 장소에 방문 후 쿠폰 제시</span>
      </div>
      <div>
        <span>유효기간</span>
        <span>{formattedDate}</span> 
      </div>
      <div>
        <span>쿠폰 사용처</span>
        <span>{brand}</span>
      </div>
    </section>
  );
}