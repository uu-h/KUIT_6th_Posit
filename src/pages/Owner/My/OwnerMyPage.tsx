import AppBar from "../../../components/Common/AppBar";
import MenuItem from "../../../components/Owner/My/MenuItem";
import ProfileHeader from "../../../components/Owner/My/ProfileHeader";

type Menu = { key: string; label: string; onClick?: () => void };

export default function MyPage() {
  //나중에 API 붙이면 여기만 교체
  const profile = {
    name: "뉴베이크",
    handle: "@tera_coffee_owner",
    onClickSetting: () => {
      // TODO: 라우팅 연결
      console.log("setting");
    },
  };

  const menus: Menu[] = [
    {
      key: "support",
      label: "고객센터",
      onClick: () => console.log("support"),
    },
    {
      key: "policy",
      label: "약관 및 정책",
      onClick: () => console.log("policy"),
    },
    {
      key: "account",
      label: "내 계정 관리",
      onClick: () => console.log("account"),
    },
    {
      key: "pin",
      label: "쿠폰 비밀번호 설정",
      onClick: () => console.log("pin"),
    },
  ];

  return (
    <div className="min-h-dvh w-full bg-white">
      <AppBar title="MY" layout="center" />

      <main className="px-[16px] pt-[24px]">
        {/* 프로필 영역 */}
        <ProfileHeader {...profile} />

        {/* 메뉴 리스트 */}
        <nav className="flex flex-col pt-[27px]">
          {menus.map((m) => (
            <MenuItem key={m.key} label={m.label} onClick={m.onClick} />
          ))}
        </nav>
      </main>

      {/* 하단 네비게이션바 */}
    </div>
  );
}
