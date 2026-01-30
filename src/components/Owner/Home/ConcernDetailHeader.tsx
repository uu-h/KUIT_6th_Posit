type Props = {
  concernTitle: string; // 고민 제목
};

export default function ConcernDetailHeader({ concernTitle }: Props) {
  return (
    <section className="pt-[20px]">
      <h1 className="typo-16-bold ">내가 올린 고민</h1>

      <p className="mt-[9px] typo-15-medium text-neutrals-08">{concernTitle}</p>
    </section>
  );
}
