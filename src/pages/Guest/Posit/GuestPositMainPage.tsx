import WaitingIcon from "../../../assets/Guest/Posit/Waiting.svg";
import SelectedIcon from "../../../assets/Guest/Posit/Selected.svg";
import PositMainCard from "../../../components/Guest/Posit/PositMainCard";
import AppBar from "../../../components/Common/AppBar";
import BottomBar from "../../../components/BottomBar/BottomBar";

export default function GuestPositMainPage() {

  const cards = [
    {
      key: "pending",
      title: "대기 중인 답변",
      description: "내가 보낸 답변을 확인할 수 있어요.",
      iconSrc: WaitingIcon,
      onClick: () => {}, // TODO: 라우팅 연결
    },
    {
      key: "selected",
      title: "채택된 답변",
      description: "지금 받은 쿠폰을 확인해보세요.",
      iconSrc: SelectedIcon,
      onClick: () => {}, // TODO: 라우팅 연결
    },
  ] as const;

  return (
    <div className="min-h-dvh w-full bg-white">
      {/* 상단 */}
      <AppBar title="POSiT!" layout="center" />

      {/* 안내 문구 */}
      <section className="mt-[1px] mx-4">
        <p className="typo-16-regular ">
          채택된 답변은 알림이 뜨지만,
          <br />
          채택되지 않은 답변은 알림이 따로 가지 않아요 :)
        </p>

        {/* 카드 2개 */}
        <div className="mt-[22px] flex flex-col gap-[25px]">
          {cards.map((c) => (
            <PositMainCard
              key={c.key}
              title={c.title}
              description={c.description}
              iconSrc={c.iconSrc}
              onClick={c.onClick}
            />
          ))}
        </div>
      </section>

      {/* 하단바 */}
      <BottomBar active="posit" onChange={() => {}} />
    </div>
  );
}
