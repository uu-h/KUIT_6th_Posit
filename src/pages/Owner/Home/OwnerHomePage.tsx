import { ownerHomeMock } from "./home.mock";
import AppBar from "../../../components/Common/AppBar";
import StatSummary from "../../../components/Owner/Home/StatSummary";
import QuickActions from "../../../components/Owner/Home/QuickActions";
import SectionHeader from "../../../components/Owner/Home/SectionHeader";
import ConcernList from "../../../components/Owner/Home/ConcernList";
import OwnerLayout from "../../../layouts/OwnerLayout";
import { useNavigate } from "react-router-dom";

export default function OwnerHomePage() {
  const { stats, concerns } = ownerHomeMock;
  const navigate = useNavigate();

  return (
    <OwnerLayout active="home">
      <AppBar title="HOME" layout="center" />
      <main className="px-[16px] pt-[26px]">
        <StatSummary title="누적 아이디어 현황" items={stats} />

        <div className="mt-[32px]">
          <QuickActions
            left={{ label: "고민 올리기", onClick: () => navigate("/owner/home/post-concern") }}
            right={{ label: "쿠폰 관리", onClick: () => navigate("/owner/home/coupon-manage") }}
          />
        </div>

        <div className="mt-[43px]">
          <SectionHeader
            title="내가 올린 고민"
            actionText="전체 고민 보기"
            onActionClick={() => navigate("/owner/home/concern") }
          />
          <ConcernList items={concerns} />
        </div>
      </main>
    </OwnerLayout>
  );
}
