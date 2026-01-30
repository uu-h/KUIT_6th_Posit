import Setting from "../../../assets/Owner/My/Setting.svg";
import Avatar from "../../../assets/Common/GenericAvatar.svg";

type Profile = {
  name: string;
  handle: string; // @tera_coffee_owner
  onClickSetting?: () => void; // 나중에 설정 화면 라우팅
};

export default function ProfileHeader({
  name,
  handle,
  onClickSetting,
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

      <button
        type="button"
        aria-label="설정"
        onClick={onClickSetting}
        className="w-[24px] h-[24px] flex items-center justify-center"
      >
        <img src={Setting} alt="설정" className="h-[20px]" />
      </button>
    </div>
  );
}
