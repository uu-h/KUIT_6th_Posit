import { useEffect, useCallback } from "react";
import DeleteIcon from "../../../assets/Guest/Coupon/Delete.svg";

interface NumberPadProps {
  onPress: (num: string) => void;
  onDelete: () => void;
  onClear: () => void;
}

export default function NumberPad({ onPress, onDelete, onClear }: NumberPadProps) {
  
  const rows = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    ["DELETE", "0", "CLEAR"], 
  ];

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.repeat) return;

    if (/^[0-9]$/.test(e.key)) {
      onPress(e.key);
    } else if (e.key === "Backspace") {
      onDelete();
    } else if (e.key === "Escape") {
      onClear();
    }
  }, [onPress, onDelete, onClear]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="w-full mb-[20px] px-[32px] select-none">
      <div className="grid grid-cols-3 gap-y-[33px] gap-x-[85px] text-center items-center">
        {rows.flat().map((item) => {
          if (item === "CLEAR") {
            return (
              <button
                key="clear"
                onClick={onClear}
                className="typo-16-regular active:scale-95 transition-transform"
              >
                CLEAR
              </button>
            );
          }
          
          if (item === "DELETE") {
            return (
              <button
                key="delete"
                onClick={onDelete}
                className="flex justify-center items-center active:scale-95 transition-transform"
              >
                <img src={DeleteIcon} alt="삭제" className="w-[32px] h-[32px]" />
              </button>
            );
          }

          return (
            <button
              key={item}
              onClick={() => onPress(item)}
              className="text-[32px] font-regular active:scale-95 transition-transform"
            >
              {item}
            </button>
          );
        })}
      </div>
    </div>
  );
}