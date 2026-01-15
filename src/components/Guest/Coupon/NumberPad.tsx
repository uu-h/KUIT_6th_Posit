interface NumberPadProps {
  onPress: (num: string) => void;
  onDelete: () => void;
  onClear: () => void;
}

export default function NumberPad({
  onPress,
  onDelete,
  onClear,
}: NumberPadProps) {
  const numbers = ["1","2","3","4","5","6","7","8","9"];

  return (
    <div className="w-full mb-[54px] px-[32px]">
      <div className="grid grid-cols-3 gap-y-[33px] gap-x-[85px] text-center">
        {numbers.map((num) => (
          <button
            key={num}
            onClick={() => onPress(num)}
            className="text-[32px] font-regular active:scale-95"
          >
            {num}
          </button>
        ))}

        {/* delete */}
        <button
          onClick={onDelete}
          className="text-[32px] font-normal active:scale-95"
        >
          <img src="src/assets/Guest/Coupon/Delete.svg" alt="" />
        </button>

        {/* 0 */}
        <button
          onClick={() => onPress("0")}
          className="text-[32px] font-normal active:scale-95"
        >
          0
        </button>

        {/* clear */}
        <button
          onClick={onClear}
          className="typo-16-regular"
        >
          CLEAR
        </button>
      </div>
    </div>
  );
}
