import ChatIcon from "../../../assets/Owner/Home/Chat.svg";

type Concern = {
  id: number | string;
  title: string;
  content: string;
  createdAt: string;
  commentCount: number;
};

type Props = {
  items: Concern[];
  onItemClick?: (item: Concern) => void;
};

export default function ConcernList({ items, onItemClick }: Props) {
  return (
    <div className="mt-[16px] space-y-[8px]">
      {items.map((c) => (
        <button
          key={c.id}
          type="button"
          onClick={() => onItemClick?.(c)}
          className="
            w-full text-left
            rounded-[16px] border border-neutrals-04
            px-[16px] py-[16px]
            cursor-pointer transition
        hover:bg-corals-000 hover:border-primary-01
        active:bg-corals-000 active:border-primary-01
          "
        >
          <p className="text-[14px] font-medium text-black leading-[21px] line-clamp-2">
            {c.title}
          </p>

          <div className="mt-[12px] flex items-center justify-between">
            <span className="typo-12-medium text-neutrals-08">
              {c.createdAt}
            </span>
            <span className="typo-12-medium text-neutrals-08 flex items-center gap-[4px]">
              <img src={ChatIcon} alt="답변" className="h-[19px]" />
              {c.commentCount}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}
