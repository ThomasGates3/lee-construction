"use client";

import { useEffect, useState } from "react";
import { site } from "@/lib/site";
import { ChatIcon, PhoneIcon } from "./Icons";

/**
 * Phone-only bar with Call, Text and Estimate. It waits until the build story is
 * over (so it never covers the captions) and steps aside while the form is on screen.
 */
export function MobileActionBar() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const build = document.getElementById("build");
    const contact = document.getElementById("contact");
    const onScroll = () => {
      if (!build || !contact) return;
      const pastBuild = window.scrollY > build.offsetTop + build.offsetHeight - window.innerHeight;
      const r = contact.getBoundingClientRect();
      const atForm = r.top < window.innerHeight * 0.6 && r.bottom > 0;
      setShow(pastBuild && !atForm);
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
    <div
      aria-hidden={!show}
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-stone-900/95 px-3 pt-3 backdrop-blur transition-transform duration-300 md:hidden ${
        show ? "translate-y-0" : "pointer-events-none translate-y-full"
      }`}
    >
      <div className="grid grid-cols-[1fr_1fr_1.4fr] gap-2 text-sm font-semibold">
        <a href={site.phoneHref} tabIndex={show ? 0 : -1} className="flex items-center justify-center gap-2 rounded-full border border-white/20 py-3 text-stone-50">
          <PhoneIcon /> Call
        </a>
        <a href={site.smsHref} tabIndex={show ? 0 : -1} className="flex items-center justify-center gap-2 rounded-full border border-white/20 py-3 text-stone-50">
          <ChatIcon /> Text
        </a>
        <a href="#contact" tabIndex={show ? 0 : -1} className="flex items-center justify-center rounded-full bg-copper-400 py-3 text-stone-900">
          Free estimate
        </a>
      </div>
    </div>
  );
}
