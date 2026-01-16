import SubmitCheck from "../../../assets/Guest/Posit/Check.svg";
type SuccessModalProps = {
  open: boolean;
  onConfirm: () => void;
};

export default function SuccessModal({ open, onConfirm }: SuccessModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* dim */}
      <div className="absolute inset-0 bg-black/50" />

      {/* modal */}
      <div className="absolute inset-0 flex items-center justify-center px-6">
        <div className="w-[312px] h-[275px] rounded-[32px] bg-corals-000 px-[70px] py-[50px] text-center">
          {/* 체크 아이콘 */}
          <img
            src={SubmitCheck}
            alt="체크"
            className="h-9 w-9 my-[4.5px] mx-auto"
          />

          <h3 className="typo-24-semibold text-[#1D1B20] my-2">작성 완료</h3>
          <p className="typo-14-regular text-[#49454F]">
            나의 POSiT이 업로드되었어요!
            <br />
            채택되면 알려드릴게요.
          </p>

          <button
            type="button"
            onClick={onConfirm}
            className="mt-[19px] typo-16-regular text-black"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
