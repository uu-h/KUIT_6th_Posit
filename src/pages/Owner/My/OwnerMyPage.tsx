import AppBar from "../../../components/Common/AppBar";
import MenuItem from "../../../components/Owner/My/MenuItem";
import ProfileHeader from "../../../components/Owner/My/ProfileHeader";
import { useNavigate } from "react-router-dom";
import OwnerLayout from "../../../layouts/OwnerLayout";
import { useMe } from "../../../hooks/useMe";
import { useQueryClient } from "@tanstack/react-query";

type Menu = { key: string; label: string; onClick?: () => void };

export default function MyPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: me, isLoading, isError } = useMe();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("autoLogin");
    localStorage.removeItem("role");

    // 캐시 정리
    queryClient.clear();

    navigate("/type", { replace: true });
  };

  const menus: Menu[] = [
    {
      key: "policy",
      label: "약관 및 정책",
      onClick: () => navigate("/owner/my/policy"),
    },
    {
      key: "account",
      label: "내 계정 관리",
      onClick: () => navigate("/owner/my/account"),
    },
    {
      key: "coupon",
      label: "쿠폰 비밀번호 설정",
      onClick: () => navigate("/owner/my/coupon"),
    },
    {
      key: "store",
      label: "내 가게 관리",
      onClick: () => navigate("/owner/my/store"),
    },
    {
      key: "logout",
      label: "로그아웃",
      onClick: handleLogout,
    },
  ];

  // ProfileHeader가 name/handle만 받는 구조
  // handle은 일단 loginId 기반
  const profile = me
    ? { name: me.name, handle: `@${me.loginId}` }
    : { name: "", handle: "" };

  return (
    <OwnerLayout active="my">
      <AppBar title="MY" layout="center" />

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
    </OwnerLayout>
  );
}
