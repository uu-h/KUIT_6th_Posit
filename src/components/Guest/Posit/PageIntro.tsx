type PageIntroProps = {
  title: string;
};

export default function PageIntro({ title }: PageIntroProps) {
  return (
    <div className="mt-[21px]">
      <h1 className="whitespace-pre-line text-[22px] font-semibold leading-[32px] tracking-[0.1px] text-black">
        {title}
      </h1>
    </div>
  );
}
