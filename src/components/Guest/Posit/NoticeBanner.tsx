type NoticeBannerVariant = "opinion" | "concernReply";

type NoticeBannerProps = {
  storeName: string; // 나중에 API/라우트에서 받아오면 됨
  menu: string;
  variant?: NoticeBannerVariant; // 기본값: opinion
};

export default function NoticeBanner({
  storeName,
  menu,
  variant = "opinion",
}: NoticeBannerProps) {
  const firstLine =
    variant === "concernReply"
      ? `이 메모는 '${storeName}'의 고민에 대한 답변이며,`
      : `이 메모는 '${storeName}'에게 보내지는 나의 의견이며,`;

  return (
    <div
      className="
        flex w-[343px] h-[52px] p-[8px]
        justify-center items-center gap-[10px]
        rounded-[8px] border border-neutrals-06
        text-center
        text-[12px] font-normal leading-[150%] tracking-[-0.228px]
        text-neutrals-09
      "
    >
      {firstLine}
      <br />
      채택 시 {menu} 쿠폰이 지급됩니다!
    </div>
  );
}
