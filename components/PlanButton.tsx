"use client";

/** Jumps to the form with this plan already picked. */
export function PlanButton({ plan }: { plan: string }) {
  return (
    <a
      href="#contact"
      onClick={() => window.dispatchEvent(new CustomEvent("pick-plan", { detail: plan }))}
      className="inline-flex items-center gap-2 text-sm font-semibold text-copper-600 hover:text-copper-500"
    >
      Ask about this plan <span aria-hidden>→</span>
    </a>
  );
}
