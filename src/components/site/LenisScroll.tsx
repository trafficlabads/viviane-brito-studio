import Lenis from "lenis";
import { useRouterState } from "@tanstack/react-router";
import { createContext, useContext, useEffect, useRef, type ReactNode } from "react";

import "lenis/dist/lenis.css";

type LenisScrollContextValue = {
  scrollToId: (id: string) => void;
  scrollToTop: () => void;
};

const LenisScrollContext = createContext<LenisScrollContextValue | null>(null);

export function useLenisScroll() {
  return useContext(LenisScrollContext);
}

const LENIS_OPTIONS: ConstructorParameters<typeof Lenis>[0] = {
  lerp: 0.09,
  duration: 1.45,
  smoothWheel: true,
  wheelMultiplier: 0.85,
  touchMultiplier: 1.1,
  respectReducedMotion: true,
  stopInertiaOnNavigate: true,
};

export function LenisScrollProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const hash = useRouterState({ select: (s) => s.location.hash });

  useEffect(() => {
    const lenis = new Lenis(LENIS_OPTIONS);
    lenisRef.current = lenis;

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;

    if (!hash) {
      lenis.scrollTo(0, { immediate: false, duration: 1.2 });
      return;
    }

    const id = hash.replace(/^#/, "");
    const target = document.getElementById(id);
    if (target) {
      lenis.scrollTo(target, { offset: -96, duration: 1.45 });
    }
  }, [pathname, hash]);

  const value: LenisScrollContextValue = {
    scrollToId: (id) => {
      const lenis = lenisRef.current;
      const target = document.getElementById(id);
      if (lenis && target) lenis.scrollTo(target, { offset: -96, duration: 1.45 });
      else target?.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    scrollToTop: () => {
      const lenis = lenisRef.current;
      if (lenis) lenis.scrollTo(0, { duration: 1.45 });
      else window.scrollTo({ top: 0, behavior: "smooth" });
    },
  };

  return <LenisScrollContext.Provider value={value}>{children}</LenisScrollContext.Provider>;
}
