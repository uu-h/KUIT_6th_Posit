import ProfilIcon from "../../../assets/Common/GenericAvatar.svg";

type Answer = {
  id: number | string;
  author: string;
  content: string;
  createdAt: string;
};

type Props = {
  answers: Answer[];
  onItemClick?: (id: Answer["id"]) => void;
};

export default function AnswerListCard({ answers, onItemClick }: Props) {
  return (
    <section className="mt-[34px]">
      <h2 className="typo-16-bold">받은 답변</h2>

      <div
        className="
          mt-[8px] px-[15px] py-[16px]
          w-full
  rounded-[16px]
  bg-white
  shadow-[0px_0px_10px_0px_#D8D8D8]
  border border-neutrals-03
  overflow-hidden
  
        "
      >
        {answers.map((a) => (
          <div
            key={a.id}
            onClick={() => onItemClick?.(a.id)}
            className="px-[15px] py-[16px] 
            transition-colors
          hover:bg-[#FFF1F0]
        active:bg-[#FFF1F0] "
          >
            <div className="flex items-start justify-between gap-[12px]">
              <div className="min-w-0">
                <div className="flex items-center gap-[4px]">
                  <img
                    src={ProfilIcon}
                    alt="프로필이미지"
                    className="h-[14px]"
                  />
                  <p className="typo-12-regular text-neutrals-09">{a.author}</p>
                </div>

                <p className="mt-[10px] whitespace-pre-line typo-14-regular">
                  {a.content}
                </p>
              </div>

              <span className="shrink-0 typo-12-regular text-neutrals-09">
                {a.createdAt}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
