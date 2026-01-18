import ProfileIcon from "../../../assets/Owner/Posit/Profile.svg";

type ConcernReadonlyCardProps = {
  name: string;
  age: number;
  gender: string;
  adoptionRate: number;
  title: string;
  content: string;
  date: string;
  isAdmin?: boolean;
};

export default function ConcernReadonlyCard({
  name,
  age,
  gender,
  adoptionRate,
  title,
  content,
  date,
  isAdmin = false,
}: ConcernReadonlyCardProps) {
  return (
    <div className="mt-[12px] mx-auto w-[343px] h-[391px] rounded-[8px] bg-corals-000 p-[16px] flex flex-col gap-[8px]">
      {/* 상단 프로필 영역 */}
        <div className="flex justify-between items-center">
        <div className="flex gap-[19px]">
            <img
            src={ProfileIcon}
            alt="profile"
            className="w-[56px] h-[56px]"
            />

            <div className="flex flex-col justify-center gap-[8px]">
            <p className="typo-14-semibold text-black">{name}</p>
            <p className="typo-12-regular text-neutrals-07">
                {gender}  만 {age}세
            </p>
            </div>
        </div>

        <p className="typo-12-regular text-neutrals-07">
            채택률 : {adoptionRate}%
        </p>
        </div>
    

      {/* 운영팀 뱃지 */}
      {isAdmin && (
        <span
        className="
            mt-[8px]
            mb-[12px]
            inline-flex items-center justify-center
            h-[28px]
            w-[68.25px]
            px-[8px]
            rounded-[100px]
            bg-primary-01
            text-corals-000
            typo-12-semibold
        "
        >
        운영팀
        </span>

      )}

        <div className="flex flex-col gap-[16px]">
        <p className="typo-16-semibold text-black">
            {title}
        </p>

        <p className="typo-12-semibold text-neutrals-07">
            {date}
        </p>
        </div>


      {/* 구분선 */}
      <div className="h-[1px] bg-neutrals-05 mt-[16px] mb-[24px]" />

      {/* 내용 */}
      <p className="typo-14-medium text-black leading-[175%] whitespace-pre-line overflow-hidden">
        {content}
      </p>
    </div>
  );
}
