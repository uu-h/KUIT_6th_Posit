import Toast from "../../../assets/Guest/Posit/Toast.svg";
type BottomToastProps = {
  open: boolean;
  message: string;
};

export default function BottomToast({ open, message }: BottomToastProps) {
  if (!open) return null;

  return (
    <div className="fixed left-1/2 bottom-[120px] z-[60] -translate-x-1/2 px-4">
      <div
        className="
          flex items-center gap-2
          w-[343px] h-[60px] px-4
          rounded-[16px]
          bg-neutrals-07 text-white
        "
        role="status"
        aria-live="polite"
      >
        <img src={Toast} alt="토스트메시지" className="h-[24px] w-[23px]" />

        <span className="ml-4 my-[21px] typo-15-semibold text-shades-01">
          {message}
        </span>
      </div>
    </div>
  );
}
