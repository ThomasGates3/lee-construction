"use client";

import { useEffect, useState, type ReactNode } from "react";

/** Transparent over the build scene, solid once you scroll into the light sections. */
export function SiteHeader({ children }: { children: ReactNode }) {
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const build = document.getElementById("build");
    const onScroll = () => {
      if (!build) return;
      setSolid(window.scrollY > build.offsetTop + build.offsetHeight - window.innerHeight * 0.5);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <header
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        solid ? "bg-stone-900/90 shadow-lg shadow-black/10 backdrop-blur" : "bg-transparent"
      }`}
    >
      {children}
    </header>
  );
}
