import { useEffect, useRef, useState } from "react";

export function useFixedOnScroll(topOffset: number) {
  const [isFixed, setIsFixed] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsFixed(!entry.isIntersecting),
      {
        root: null,
        threshold: 0,
        rootMargin: `-${topOffset}px 0px 0px 0px`,
      },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [topOffset]);

  return { isFixed, sentinelRef };
}
