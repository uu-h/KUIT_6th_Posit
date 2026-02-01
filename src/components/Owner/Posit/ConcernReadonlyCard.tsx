import ProfileIcon from "../../../assets/Owner/Posit/Profile.svg";

type ConcernReadonlyCardProps = {
  name: string;
  age: number;
  gender: string;
  title: string;
  content: string;
  date: string;

  //추가: 이미지가 있으면 렌더
  imageUrl?: string;
};

export default function ConcernReadonlyCard({
  name,
  age,
  gender,
  title,
  content,
  date,
  imageUrl,
}: ConcernReadonlyCardProps) {
  return (
    <div
      className="
        mt-[12px]
        mx-auto w-[343px]
        rounded-[16px]
        bg-corals-000
        p-[16px] pb-[42px]
        min-h-[350px]
      "
    >
      {/* 상단 프로필 영역 */}
      <div className="flex items-start justify-between">
        <div className="flex gap-[19px]">
          <img src={ProfileIcon} alt="profile" className="w-[56px] h-[56px]" />

          <div className="flex flex-col justify-center gap-[8px]">
            <p className="typo-14-semibold text-black">{name}</p>
            <p className="typo-12-regular text-neutrals-07">
              {gender} 만 {age}세
            </p>
          </div>
        </div>
      </div>

      {/* 제목 / 날짜 */}
      <div className="mt-[24px] flex flex-col gap-[16px]">
        <p className="typo-16-semibold text-black">{title}</p>
        <p className="typo-12-semibold text-neutrals-07">{date}</p>
      </div>

      {/* 구분선 */}
      <div className="h-[1px] bg-neutrals-05 mt-[16px] mb-[16px]" />

      {/* 이미지 (있을 때만) */}
      {imageUrl && (
        <div>
          <img
            src={imageUrl}
            alt="answer"
            className="w-full h-[232px] w-[311px] object-cover rounded-[8px]"
          />
        </div>
      )}

      {/* 내용 */}
      <p className="pt-[16px] typo-14-regular text-black leading-[175%] whitespace-pre-line">
        {content}
      </p>
    </div>
  );
}
