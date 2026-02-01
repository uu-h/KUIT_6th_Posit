import AppBar from "../../../components/Common/AppBar";
import MenuItem from "../../../components/Owner/My/MenuItem";
import ProfileHeader from "../../../components/Owner/My/ProfileHeader";
import { useNavigate } from "react-router-dom";
import OwnerLayout from "../../../layouts/OwnerLayout";

type Menu = { key: string; label: string; onClick?: () => void };

export default function MyPage() {
  const navigate = useNavigate();

  //나중에 API 붙이면 여기만 교체
  const profile = {
    name: "뉴베이크",
    handle: "@tera_coffee_owner",
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
  ];

  return (
    <OwnerLayout active="my">
      <AppBar title="MY" layout="center" />

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
    </OwnerLayout>
  );
}
