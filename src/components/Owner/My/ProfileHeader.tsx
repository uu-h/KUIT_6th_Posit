import Avatar from "../../../assets/Owner/My/GenericAvatar.svg";

type Profile = {
  name: string;
  handle: string; // @tera_coffee_owner
};

export default function ProfileHeader({
  name,
  handle,
}: Profile) {
  return (
    <div className=" flex items-center justify-between">
      {/* 왼쪽: 아바타 + 텍스트 */}
      <div className="flex items-center gap-[16px]">
        <img src={Avatar} alt="프로필이미지" className="h-[56px]" />

        <div className="flex flex-col gap-[8px]">
          <span className="typo-16-medium">{name}</span>
          <span className="text-[12px] font-normal leading-[16px] tracking-[0.4px] text-neutrals-07 font-roboto">
            {handle}
          </span>
        </div>
      </div>
    </div>
  );
}
