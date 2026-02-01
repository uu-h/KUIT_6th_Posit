import AppBar from "./AppBar";
import { useNavigate } from "react-router-dom";

const POLICY_DATA = [
  {
    title: "제1조 (목적)",
    content:
      "본 약관은 'POSiT!' 서비스(이하 '서비스')가 제공하는 모든 기능 및 콘텐츠를 이용함에 있어, 서비스와 이용자 간의 권리, 의무 및 책임 사항을 규정함을 목적으로 합니다.",
  },
  {
    title: "제2조 (용어의 정의)",
    content: [
      "게스트: 서비스를 통해 매장 사장님의 고민에 답변을 남기고 쿠폰을 제공받는 이용자를 말합니다.",
      "사장님: 매장을 운영하며 고민을 등록하고, 게스트의 답변을 채택하여 쿠폰을 발행하는 이용자를 말합니다.",
      "POSiT!: 게스트가 사장님의 고민에 대해 작성하는 답변 콘텐츠를 의미합니다.",
    ],
  },
  {
    title: "제3조 (서비스 이용 및 제한)",
    content: [
      "이용자는 본 약관에 동의함과 동시에 서비스를 이용할 수 있습니다.",
      "타인의 정보를 도용하거나 서비스의 정상적인 운영을 방해하는 경우, 이용이 제한될 수 있습니다.",
      "사장님은 사업자 등록번호 인증을 통해 매장 권한을 획득하며, 1개 계정당 1개의 매장 매칭을 원칙으로 합니다.",
    ],
  },
  {
    title: "제4조 (쿠폰 발행 및 사용)",
    content: [
      "사장님은 게스트의 답변을 채택할 시 약속된 쿠폰을 발행해야 합니다.",
      "발행된 쿠폰은 정해진 유효기간 내에 해당 매장에서만 사용 가능합니다.",
      "쿠폰 사용 시 매장 직원의 확인(비밀번호 입력 등) 절차가 필요하며, 사용 완료 처리된 쿠폰은 복구되지 않습니다.",
    ],
  },
  {
    title: "제5조 (개인정보 보호 의무)",
    content:
      "서비스는 이용자의 개인정보를 보호하기 위해 '개인정보 처리방침'을 수립하고 이를 준수합니다. 이용자의 명시적인 동의 없이 제3자에게 개인정보를 제공하지 않습니다.",
  },
  {
    title: "제6조 (게시물의 저작권 및 책임)",
    content: [
      "게스트가 작성한 'POSiT!' 답변의 저작권은 작성자에게 있습니다.",
      "단, 사장님은 채택된 답변 내용을 매장 운영 및 개선의 목적으로 활용할 수 있습니다.",
      "비속어, 비방, 허위 사실 유포 등 부적절한 게시물은 사전 통보 없이 삭제될 수 있습니다.",
    ],
  },
];

export default function PolicyContent() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden">
      {/* 상단 바 */}
      <AppBar layout="center" leftType="left" onBack={() => navigate(-1)} />

      {/* 약관 본문 스크롤 영역 */}
      <div className="flex-1 overflow-y-auto mt-[13px] px-[20px] no-scrollbar">
        <h1 className="typo-sub-title mb-[35px]">약관 및 정책</h1>

        <div className="flex flex-col gap-[40px] pb-[182px]">
          {POLICY_DATA.map((item, index) => (
            <section key={index} className="flex flex-col">
              <h2 className="text-[#5D5D5D] typo-16-regular mb-[2px]">
                {item.title}
              </h2>

              {Array.isArray(item.content) ? (
                <div className="flex flex-col gap-[2px]">
                  {item.content.map((line, i) => (
                    <div
                      key={i}
                      className="flex gap-[8px] text-[#5D5D5D] typo-16-regular"
                    >
                      <span className="shrink-0">{i + 1}.</span>
                      <span>{line}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[#5D5D5D] typo-16-regular">{item.content}</p>
              )}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
