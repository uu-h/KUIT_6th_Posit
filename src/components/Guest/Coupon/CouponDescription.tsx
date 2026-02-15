interface DescriptionProps {
  expiration: string; 
  brand: string;
}

export default function CouponDescription({ expiration, brand }: DescriptionProps) {

  const dateOnly = expiration.split("T")[0];
  const [y, m, d] = dateOnly.split("-");
  
  const month = m ? String(Number(m)) : m;
  const day = d ? String(Number(d)) : d;
  
  const formattedDate = y && month && day ? `${y}년 ${month}월 ${day}일` : expiration;

  return (
    <section
      className="
        flex flex-col gap-[20px]
        typo-15-semibold
        [&>div]:flex
        [&>div]:justify-between
        [&>div>span:first-child]:text-neutrals-07
        w-full
        pt-[35px]
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