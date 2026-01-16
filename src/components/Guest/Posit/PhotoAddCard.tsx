import { useRef } from "react";
import PhotoPlus from "../../../assets/Guest/Posit/Phto_Plus.svg";

type PhotoAddCardProps = {
  image: File | null;
  onAdd: (file: File) => void;
  onRemove: () => void;
};

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes}B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)}KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(1)}MB`;
}

export default function PhotoAddCard({
  image,
  onAdd,
  onRemove,
}: PhotoAddCardProps) {
  const fileRef = useRef<HTMLInputElement | null>(null);

  const handleClick = () => fileRef.current?.click();

  const handlePick: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    onAdd(files[0]); // 1개만
    e.target.value = ""; // 같은 파일 재선택 가능
  };

  if (image) {
    return (
      <div className="mt-4 w-[343px] h-[83px] rounded-[16px] bg-white shadow-[0_0_4px_rgba(0,0,0,0.25)] px-[30px] py-3">
        <button
          type="button"
          onClick={onRemove}
          className="text-[11px] font-semibold text-neutrals-07"
        >
          파일 삭제
        </button>

        <div className="mt-2 text-[11px] font-semibold text-shades-02">
          {image.name}({formatFileSize(image.size)})
        </div>
      </div>
    );
  }
  return (
    <section className="mt-6">
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handlePick}
        className="hidden"
      />

      <button
        type="button"
        onClick={handleClick}
        className="
    flex flex-col items-end gap-[8px]
    w-[343px] h-[83px]
    pt-[12px] pr-[152px] pb-[10px] pl-[30px]
    shrink-0
    rounded-[16px] bg-white
    shadow-[0_0_4px_rgba(0,0,0,0.25)]
  "
      >
        <img src={PhotoPlus} alt="사진 추가" className="h-[40px] w-[40px]" />
        <span className="text-[11px] font-semibold text-neutrals-08">
          사진 추가
        </span>
      </button>
    </section>
  );
}
