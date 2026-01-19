import { ownerHomeMock } from "./home.mock";
import AppBar from "../../../components/Common/AppBar";
import StatSummary from "../../../components/Owner/Home/StatSummary";
import QuickActions from "../../../components/Owner/Home/QuickActions";

export default function OwnerHomePage() {
  const { stats } = ownerHomeMock;

  return (
    <div className="min-h-dvh bg-white pb-[92px]">
      <AppBar title="HOME" layout="center" />

      <main className="px-[16px] pt-[26px]">
        <StatSummary title="누적 아이디어 현황" items={stats} />

        <div className="mt-[32px]">
          <QuickActions
            left={{ label: "고민 올리기", onClick: () => {} }}
            right={{ label: "쿠폰 관리", onClick: () => {} }}
          />
        </div>
      </main>

      {/* 하단 네비게이션 바 */}
    </div>
  );
}
