"use client";

import { useState, type FormEvent } from "react";

/**
 * Demo form: shows a thank-you state, sends nothing.
 * Wire `onSubmit` to the builder's CRM / email (Resend, Formspree, a Next.js route, etc.) before launch.
 */
export function ContactForm() {
  const [sent, setSent] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSent(true);
  };

  if (sent) {
    return (
      <div className="flex flex-col justify-center rounded-3xl bg-white/5 p-8 ring-1 ring-white/10">
        <p className="font-display text-3xl">Thanks, we&apos;ll be in touch.</p>
        <p className="mt-3 text-stone-300">Demo only: this form isn&apos;t connected yet, so nothing was sent.</p>
      </div>
    );
  }

  const field =
    "mt-2 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-stone-50 placeholder:text-stone-500 focus:border-copper-300 focus:outline-none focus:ring-2 focus:ring-copper-300/30";

  return (
    <form onSubmit={onSubmit} className="grid gap-5 rounded-3xl bg-white/5 p-6 ring-1 ring-white/10 md:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="text-sm text-stone-300">
          Name
          <input required id="lead-name" name="name" autoComplete="name" className={field} placeholder="Jordan Smith" />
        </label>
        <label className="text-sm text-stone-300">
          Phone
          <input required id="lead-phone" name="phone" type="tel" autoComplete="tel" className={field} placeholder="(404) 555-0123" />
        </label>
      </div>
      <label className="text-sm text-stone-300">
        Email
        <input id="lead-email" name="email" type="email" autoComplete="email" className={field} placeholder="you@email.com" />
      </label>
      <label className="text-sm text-stone-300">
        Where are you in the process?
        <select id="lead-stage" name="stage" className={field} defaultValue="">
          <option value="" disabled>Choose one</option>
          <option>I own a lot</option>
          <option>Looking for land</option>
          <option>Have plans, need a builder</option>
          <option>Just exploring</option>
        </select>
      </label>
      <label className="text-sm text-stone-300">
        Tell us about your home
        <textarea id="lead-message" name="message" rows={4} className={field} placeholder="4 bed, 2.5 bath two-story brick home, about 2,600 sq ft..." />
      </label>
      <button type="submit" className="rounded-full bg-copper-400 px-6 py-3.5 font-semibold text-stone-900 transition hover:bg-copper-300">
        Book a free site walk
      </button>
    </form>
  );
}
