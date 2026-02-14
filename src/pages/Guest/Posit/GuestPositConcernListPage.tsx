import AppBar from "../../../components/Common/AppBar";
import ConcernList from "../../../components/Owner/Home/ConcernList";

type Concern = {
  id: number | string;
  title: string;
  createdAt: string;
  commentCount: number;
};

//TODO : 클릭시 연결
type Props = {
  items?: Concern[]; // 나중에 API 연동 시 외부에서 주입 가능
  onItemClick?: (id: Concern["id"]) => void;
};

const mockConcerns: Concern[] = [
  {
    id: 1,
    title: "매장 조명을 조금 더 밝게 바꿔야 할까요?",
    createdAt: "2일 전",
    commentCount: 4,
  },
  {
    id: 2,
    title: "신메뉴 반응이 너무 안 좋아요...",
    createdAt: "2일 전",
    commentCount: 6,
  },
  {
    id: 3,
    title: "인스타로 홍보 열심히 하는데 효과가 없어요..",
    createdAt: "9일 전",
    commentCount: 7,
  },
  {
    id: 4,
    title: "1인 세트 메뉴를 만들면 괜찮을까요?",
    createdAt: "9일 전",
    commentCount: 5,
  },
  {
    id: 5,
    title: "주문 방식을 QR로 바꾸는 거 너무 불편할까요?",
    createdAt: "10일 전",
    commentCount: 4,
  },
];

export default function GuestPositConcernListPage({
  items = mockConcerns,
  onItemClick,
}: Props) {
  return (
    <div className="min-h-dvh bg-white">
      {/* 상단바 */}
      <AppBar layout="left" leftType="left" />

      <div className="px-[16px]">
        {/* 제목 */}
        <h1 className="typo-sub-title">내가 올린 고민</h1>
      </div>

      {/* 리스트 영역 */}
      <main className="px-[16px] pb-[24px]">
        <ConcernList items={items} onItemClick={onItemClick} />
      </main>
    </div>
  );
}
