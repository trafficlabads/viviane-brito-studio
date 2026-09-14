import { useEffect, useRef, useState, type ReactNode } from "react";
export function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null); const [shown, setShown] = useState(false);
  useEffect(() => { const el = ref.current; if (!el) return; const obs = new IntersectionObserver(([entry]) => { if (entry?.isIntersecting) { setShown(true); obs.disconnect(); } }, { threshold: .12 }); obs.observe(el); return () => obs.disconnect(); }, []);
  return <div ref={ref} className={`reveal ${shown ? "is-visible" : ""} ${className}`}>{children}</div>;
}
