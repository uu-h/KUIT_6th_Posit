import closeIcon from "../../../assets/Guest/Posit/Close.svg";

type ModalHeaderProps = {
  title: string;
  onClose: () => void;
};

export default function ModalHeader({ title, onClose }: ModalHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h1 className="typo-sub-title">{title}</h1>

      <button
        type="button"
        onClick={onClose}
        className="grid w-[24px] aspect-square place-items-center rounded-full"
        aria-label="닫기"
      >
        <img src={closeIcon} className="h-[15px] w-[15px]" />
      </button>
    </div>
  );
}
