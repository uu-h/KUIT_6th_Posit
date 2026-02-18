import AppBar from "../../../components/Common/AppBar";
import MenuItem from "../../../components/Owner/My/MenuItem";
import ProfileHeader from "../../../components/Owner/My/ProfileHeader";
import { useNavigate } from "react-router-dom";
import GuestLayout from "../../../layouts/GuestLayout";
import { useMe } from "../../../hooks/useMe";

type Menu = { key: string; label: string; onClick?: () => void };

export default function MyPage() {
  const navigate = useNavigate();

  const { data: me, isLoading, isError } = useMe();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("autoLogin");
    localStorage.removeItem("role");

    navigate("/type", { replace: true });
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
    {
      key: "logout",
      label: "로그아웃",
      onClick: handleLogout,
    },
  ];

  const profile = me
    ? { name: me.name, handle: `@${me.loginId}` }
    : { name: "", handle: "" };

  return (
    <GuestLayout active="my">
      <AppBar title="MY" layout="center" onBack={() => navigate(-1)} />

      <main className="px-[16px] pt-[24px]">
        {/* 프로필 영역 */}
        {isLoading ? (
          <div className="h-[64px] rounded-[12px] bg-neutrals-02" />
        ) : isError ? (
          <div className="rounded-[12px] bg-neutrals-01 p-[12px] text-neutrals-07">
            프로필 정보를 불러오지 못했어요.
          </div>
        ) : (
          <ProfileHeader {...profile} />
        )}

        {/* 메뉴 리스트 */}
        <nav className="flex flex-col pt-[36px]">
          {menus.map((m) => (
            <MenuItem key={m.key} label={m.label} onClick={m.onClick} />
          ))}
        </nav>
      </main>
    </GuestLayout>
  );
}
