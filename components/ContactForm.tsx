"use client";

import { useEffect, useState, type FormEvent } from "react";
import { site } from "@/lib/site";
import { CheckIcon } from "./Icons";

/**
 * Two-step estimate form: easy taps about the project first, contact details second.
 * Demo only: it shows a thank-you state and sends nothing.
 * Before launch, post the fields to the builder's CRM or inbox (a Next.js route with
 * Resend, Formspree, GoHighLevel, etc.) and fire the missed-call text-back from there.
 */
const projectTypes = ["New custom home", "Build on my lot", "Addition or renovation"];
const lotStatus = ["Yes, I own a lot", "Under contract", "Still looking"];
const timelines = ["As soon as possible", "Within 6 months", "6 to 12 months", "A year or more"];
const budgets = ["Under $400k", "$400k to $700k", "$700k to $1M", "$1M and up", "Not sure yet"];

function Chips({ name, options, value, onChange }: { name: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {options.map((o) => (
        <label
          key={o}
          className={`cursor-pointer rounded-full border px-4 py-2 text-sm transition ${
            value === o ? "border-copper-300 bg-copper-300/15 text-copper-300" : "border-white/15 text-stone-200 hover:border-white/35"
          }`}
        >
          <input type="radio" name={name} value={o} checked={value === o} onChange={() => onChange(o)} className="sr-only" />
          {o}
        </label>
      ))}
    </div>
  );
}

export function ContactForm() {
  const [step, setStep] = useState<1 | 2 | "sent">(1);
  const [type, setType] = useState("");
  const [lot, setLot] = useState("");
  const [timeline, setTimeline] = useState("");
  const [budget, setBudget] = useState("");
  const [plan, setPlan] = useState("");
  const [first, setFirst] = useState("");

  useEffect(() => {
    const pick = (e: Event) => {
      setPlan((e as CustomEvent<string>).detail);
      setStep(1);
    };
    window.addEventListener("pick-plan", pick);
    return () => window.removeEventListener("pick-plan", pick);
  }, []);

  const field =
    "mt-2 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-stone-50 placeholder:text-stone-500 focus:border-copper-300 focus:outline-none focus:ring-2 focus:ring-copper-300/30";

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const name = String(new FormData(e.currentTarget).get("name") ?? "");
    setFirst(name.trim().split(/\s+/)[0] ?? "");
    setStep("sent");
  };

  if (step === "sent") {
    return (
      <div className="flex flex-col justify-center rounded-3xl bg-white/5 p-8 ring-1 ring-white/10 md:p-10">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-copper-400 text-stone-900">
          <CheckIcon className="h-6 w-6" />
        </span>
        <p className="mt-6 font-display text-3xl">Thanks{first ? `, ${first}` : ""}. Your request is in.</p>
        <p className="mt-3 leading-relaxed text-stone-300">
          A member of our team will call you within one business day to set up your free consultation. Need us sooner? Call{" "}
          <a href={site.phoneHref} className="text-copper-300 underline-offset-4 hover:underline">{site.phone}</a>.
        </p>
        <p className="mt-6 text-xs text-stone-500">Demo only: this form isn&apos;t connected yet, so nothing was sent.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="relative rounded-3xl bg-white/5 p-6 ring-1 ring-white/10 md:p-8" aria-label="Request a free estimate">
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-stone-400">
        <span>Free estimate</span>
        <span>Step {step} of 2</span>
      </div>
      <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/10">
        <div className={`h-full rounded-full bg-copper-300 transition-all duration-500 ${step === 1 ? "w-1/2" : "w-full"}`} />
      </div>

      {/* step 1 stays mounted (hidden) so its answers submit with step 2 */}
      <div className={step === 1 ? "mt-7 grid gap-6" : "hidden"}>
        <fieldset>
          <legend className="text-sm text-stone-300">What are you planning?</legend>
          <Chips name="project" options={projectTypes} value={type} onChange={setType} />
        </fieldset>
        <fieldset>
          <legend className="text-sm text-stone-300">Do you own a lot?</legend>
          <Chips name="lot" options={lotStatus} value={lot} onChange={setLot} />
        </fieldset>
        <fieldset>
          <legend className="text-sm text-stone-300">When would you like to start?</legend>
          <Chips name="timeline" options={timelines} value={timeline} onChange={setTimeline} />
        </fieldset>
        <fieldset>
          <legend className="text-sm text-stone-300">
            Budget range <span className="text-stone-500">(optional)</span>
          </legend>
          <Chips name="budget" options={budgets} value={budget} onChange={setBudget} />
        </fieldset>
        {plan && (
          <p className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3 text-sm text-stone-200">
            <span>
              Plan: <span className="text-copper-300">{plan}</span>
            </span>
            <button type="button" onClick={() => setPlan("")} className="text-stone-400 hover:text-stone-200">
              Clear
            </button>
          </p>
        )}
        <input type="hidden" name="plan" value={plan} />
        <button
          type="button"
          onClick={() => setStep(2)}
          className="rounded-full bg-copper-400 px-6 py-3.5 font-semibold text-stone-900 transition hover:bg-copper-300"
        >
          Next: your details
        </button>
      </div>

      {step === 2 && (
        <div className="mt-7 grid gap-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="text-sm text-stone-300">
              Full name
              <input required name="name" autoComplete="name" className={field} placeholder="Jordan Smith" />
            </label>
            <label className="text-sm text-stone-300">
              Phone
              <input required name="phone" type="tel" autoComplete="tel" className={field} placeholder="(404) 555-0123" />
            </label>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="text-sm text-stone-300">
              Email
              <input required name="email" type="email" autoComplete="email" className={field} placeholder="you@email.com" />
            </label>
            <label className="text-sm text-stone-300">
              City or ZIP of the build
              <input name="location" autoComplete="postal-code" className={field} placeholder="Fayetteville or 30214" />
            </label>
          </div>
          <label className="text-sm text-stone-300">
            Anything else we should know? <span className="text-stone-500">(optional)</span>
            <textarea name="message" rows={3} className={field} placeholder="Size, style, must-haves..." />
          </label>
          {/* honeypot: real visitors never see or fill this, bots do */}
          <input type="text" name="company_website" tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] h-0 w-0 opacity-0" />
          <label className="flex gap-3 text-xs leading-relaxed text-stone-400">
            <input type="checkbox" name="sms_ok" className="mt-0.5 h-4 w-4 flex-none accent-[#dc9a5e]" />
            Text me about my request. Message and data rates may apply. Reply STOP to opt out.
          </label>
          <div className="flex flex-col-reverse gap-3 sm:flex-row">
            <button type="button" onClick={() => setStep(1)} className="rounded-full border border-white/20 px-6 py-3.5 font-semibold text-stone-100 transition hover:bg-white/10">
              Back
            </button>
            <button type="submit" className="flex-1 rounded-full bg-copper-400 px-6 py-3.5 font-semibold text-stone-900 transition hover:bg-copper-300">
              Request my free consultation
            </button>
          </div>
          <p className="text-xs text-stone-500">No cost, no obligation. We reply within one business day and never share your information.</p>
        </div>
      )}
    </form>
  );
}
