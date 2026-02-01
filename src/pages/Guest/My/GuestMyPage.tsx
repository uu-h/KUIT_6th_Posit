import AppBar from "../../../components/Common/AppBar";
import MenuItem from "../../../components/Owner/My/MenuItem";
import ProfileHeader from "../../../components/Owner/My/ProfileHeader";
import { useNavigate } from "react-router-dom";
import GuestLayout from "../../../layouts/GuestLayout";

type Menu = { key: string; label: string; onClick?: () => void };

export default function MyPage() {
  const navigate = useNavigate();

  //나중에 API 붙이면 여기만 교체
  const profile = {
    name: "김쿠잇",
    handle: "@kuit_posit",
  };

  const menus: Menu[] = [
    {
      key: "policy",
      label: "약관 및 정책",
      onClick: () => navigate("/guest/my/policy"),
    },
    {
      key: "account",
      label: "내 계정 관리",
      onClick: () => navigate("/guest/my/account"),
    },
  ];

  return (
    <GuestLayout active="my">
      <AppBar title="MY" layout="center" onBack={() => navigate(-1)} />

      <main className="px-[16px] pt-[24px]">
        {/* 프로필 영역 */}
        <ProfileHeader {...profile} />

        {/* 메뉴 리스트 */}
        <nav className="flex flex-col pt-[78px]">
          {menus.map((m) => (
            <MenuItem key={m.key} label={m.label} onClick={m.onClick} />
          ))}
        </nav>
      </main>
    </GuestLayout>
  );
}
