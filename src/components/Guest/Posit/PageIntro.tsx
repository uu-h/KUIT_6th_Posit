type PageIntroProps = {
  title: string;
};

export default function PageIntro({ title }: PageIntroProps) {
  return (
    <div className="mt-[21px]">
      <h1 className="whitespace-pre-line text-[22px] font-Pretendard leading-[130%]">
        {title}
      </h1>
    </div>
  );
}
