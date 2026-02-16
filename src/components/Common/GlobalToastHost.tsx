import { useEffect, useRef, useState } from "react";
import BottomToast from "../Guest/Posit/BottomToast"; // 너희 경로에 맞게 수정
import { subscribeToast } from "../../utils/toastBus"; // 경로 맞게 수정

export default function GlobalToastHost() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return subscribeToast(({ message, durationMs = 2000 }) => {
      setMessage(message);
      setOpen(true);

      if (timerRef.current) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => {
        setOpen(false);
      }, durationMs);
    });
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  return <BottomToast open={open} message={message} />;
}
