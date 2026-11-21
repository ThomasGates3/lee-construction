import { ScrollStory } from "@/components/ScrollStory";
import { ContactForm } from "@/components/ContactForm";
import { SiteHeader } from "@/components/SiteHeader";
import { MobileActionBar } from "@/components/MobileActionBar";
import { PlanButton } from "@/components/PlanButton";
import {
  BadgeIcon,
  CameraIcon,
  ChatIcon,
  CheckIcon,
  ClockIcon,
  DocIcon,
  MailIcon,
  PhoneIcon,
  PinIcon,
  ShieldIcon,
  StarIcon,
} from "@/components/Icons";
import { photoFrames, photoScene } from "@/scenes/photo/photoBuild";
import { site } from "@/lib/site";

const trustIcons = [ShieldIcon, DocIcon, BadgeIcon, CameraIcon];
const addressLine = `${site.address.street}, ${site.address.city}, ${site.address.state} ${site.address.zip}`;

const nav = [
  { href: "#services", label: "What we build" },
  { href: "#plans", label: "Plans" },
  { href: "#process", label: "Our process" },
  { href: "#reviews", label: "Reviews" },
  { href: "#faq", label: "FAQ" },
];

function Logo() {
  return (
    <a href="#top" className="flex items-center gap-2.5 text-stone-50">
      <svg viewBox="0 0 32 32" className="h-8 w-8 flex-none" aria-hidden>
        <rect width="32" height="32" rx="7" fill="#9b4a34" />
        <path d="M7 23 L16 10 L25 23" fill="none" stroke="#faf8f4" strokeWidth="2.6" strokeLinejoin="round" />
        <path d="M11 23 V18 H21 V23" fill="none" stroke="#faf8f4" strokeWidth="2.2" />
      </svg>
      <span className="font-display text-lg leading-none tracking-tight">
        <span className="sm:hidden">{site.shortName}</span>
        <span className="hidden sm:inline">{site.name}</span>
      </span>
    </a>
  );
}

function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <p className={`text-xs font-semibold uppercase tracking-[0.25em] ${light ? "text-copper-300" : "text-copper-600"}`}>{children}</p>
  );
}

function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: site.name,
    slogan: site.tagline,
    telephone: site.phone,
    email: site.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressRegion: site.address.state,
      postalCode: site.address.zip,
      addressCountry: "US",
    },
    areaServed: site.serviceAreas,
    openingHours: "Mo-Fr 08:00-17:00",
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export function HomePage() {
  return (
    <main id="top">
      <JsonLd />

      <SiteHeader>
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 md:px-8">
          <Logo />
          <nav className="hidden items-center gap-7 text-sm text-stone-100 lg:flex">
            {nav.map((n) => (
              <a key={n.href} href={n.href} className="hover:text-copper-300">
                {n.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2 sm:gap-4">
            <a
              href={site.phoneHref}
              aria-label={`Call ${site.name} at ${site.phone}`}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 text-stone-50 transition hover:bg-white/10 sm:h-auto sm:w-auto sm:gap-2 sm:border-0 sm:text-sm sm:font-semibold sm:hover:bg-transparent sm:hover:text-copper-300"
            >
              <PhoneIcon />
              <span className="hidden sm:inline">{site.phone}</span>
            </a>
            <a
              href="#contact"
              className="whitespace-nowrap rounded-full bg-copper-400 px-4 py-2.5 text-sm font-semibold text-stone-900 shadow-lg shadow-black/20 transition hover:bg-copper-300"
            >
              Free estimate
            </a>
          </div>
        </div>
      </SiteHeader>

      <ScrollStory
        config={photoScene}
        frames={photoFrames}
        introActions={
          <>
            <a href="#contact" className="rounded-full bg-copper-400 px-5 py-3 text-sm font-semibold text-stone-900 transition hover:bg-copper-300">
              Get a free estimate
            </a>
            <a href="#services" className="text-sm font-semibold text-stone-200 underline-offset-4 hover:underline">
              Skip the tour
            </a>
          </>
        }
        finalActions={
          <>
            <a href="#contact" className="rounded-full bg-copper-400 px-4 py-2.5 text-sm font-semibold text-stone-900 transition hover:bg-copper-300 sm:px-5 sm:py-3">
              Book a free site walk
            </a>
            <a href="#plans" className="rounded-full border border-stone-300/60 px-4 py-2.5 text-sm sm:px-5 sm:py-3 font-semibold text-stone-50 transition hover:bg-white/10">
              See our plans
            </a>
          </>
        }
      />

      {/* trust strip */}
      <section aria-label="Why homeowners choose us" className="bg-stone-900 text-stone-50">
        <div className="mx-auto grid max-w-7xl gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {site.trust.map((t, i) => {
            const Icon = trustIcons[i % trustIcons.length];
            return (
              <div key={t.title} className="bg-stone-900 px-6 py-8 md:px-8 md:py-10">
                <Icon className="h-6 w-6 text-copper-300" />
                <p className="mt-4 font-semibold">{t.title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-stone-400">{t.body}</p>
              </div>
            );
          })}
        </div>
        <p className="mx-auto max-w-7xl px-5 py-4 text-xs text-stone-500 md:px-8">{site.license} · Fully insured</p>
      </section>

      {/* services */}
      <section id="services" className="scroll-mt-20 bg-stone-50 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Eyebrow>What we build</Eyebrow>
          <div className="mt-3 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <h2 className="max-w-2xl font-display text-4xl leading-tight tracking-tight text-stone-900 md:text-5xl">
              One builder from the first stake to the last brick.
            </h2>
            <p className="max-w-md leading-relaxed text-stone-600">
              {site.name} builds new homes across {site.serviceArea}. One team handles the plans, the permits and the build, so you never chase subcontractors.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {site.services.map((s, i) => (
              <article key={s.title} className="rounded-2xl border border-stone-200 bg-white p-7 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-stone-300/40">
                <p className="font-display text-sm text-copper-600">0{i + 1}</p>
                <h3 className="mt-4 text-lg font-semibold text-stone-900">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">{s.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* plans */}
      <section id="plans" className="scroll-mt-20 bg-white py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Eyebrow>Our plans</Eyebrow>
          <h2 className="mt-3 max-w-2xl font-display text-4xl leading-tight tracking-tight text-stone-900 md:text-5xl">
            Start from a plan. Make it yours.
          </h2>
          <p className="mt-5 max-w-xl leading-relaxed text-stone-600">
            Every plan can be changed, from the kitchen layout to the brick color. Pricing depends on your lot and finishes, so we give you a number after a free site walk.
          </p>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {site.plans.map((p) => (
              <article key={p.name} className="flex flex-col rounded-2xl border border-stone-200 bg-stone-50 p-7">
                <svg viewBox="0 0 120 60" className="h-16 w-32 text-stone-400" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M8 56V30L40 8l32 22v26zM72 56V36h40v20zM28 56V40h12v16M50 34h10v8H50z" />
                </svg>
                <h3 className="mt-6 font-display text-2xl text-stone-900">{p.name}</h3>
                <dl className="mt-4 grid grid-cols-4 gap-2 border-y border-stone-200 py-4 text-center">
                  {[
                    [p.beds, "Beds"],
                    [p.baths, "Baths"],
                    [p.sqft, "Sq ft"],
                    [p.garage.replace("-car", ""), "Car garage"],
                  ].map(([v, l]) => (
                    <div key={String(l)}>
                      <dd className="text-lg font-semibold text-stone-900">{v}</dd>
                      <dt className="text-[11px] uppercase tracking-wider text-stone-500">{l}</dt>
                    </div>
                  ))}
                </dl>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-stone-600">{p.note}</p>
                <div className="mt-6">
                  <PlanButton plan={p.name} />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* process */}
      <section id="process" className="scroll-mt-20 bg-stone-100 py-20 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 md:px-8 lg:grid-cols-[1fr_1.3fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Eyebrow>Our process</Eyebrow>
            <h2 className="mt-3 font-display text-4xl leading-tight tracking-tight text-stone-900 md:text-5xl">
              You always know where your home stands.
            </h2>
            <p className="mt-5 max-w-md leading-relaxed text-stone-600">
              Building a home is the biggest purchase most families make. We keep it calm with a fixed plan, honest numbers and a builder who picks up the phone.
            </p>
            <ul className="mt-8 grid gap-4">
              {site.promises.map((p) => (
                <li key={p.title} className="flex gap-3">
                  <CheckIcon className="mt-0.5 h-5 w-5 flex-none text-copper-600" />
                  <p className="text-sm leading-relaxed text-stone-600">
                    <span className="font-semibold text-stone-900">{p.title}.</span> {p.body}
                  </p>
                </li>
              ))}
            </ul>
            <a href="#contact" className="mt-10 inline-block rounded-full bg-stone-900 px-6 py-3.5 text-sm font-semibold text-stone-50 transition hover:bg-stone-800">
              Schedule your consultation
            </a>
          </div>
          <ol className="relative grid gap-4">
            {site.process.map((p, i) => (
              <li key={p.title} className="relative flex gap-5 rounded-2xl bg-white p-6">
                <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-[#9b4a34] font-display text-stone-50">{i + 1}</span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-copper-600">{p.time}</p>
                  <h3 className="mt-1 text-lg font-semibold text-stone-900">{p.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-stone-600">{p.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* reviews */}
      <section id="reviews" className="scroll-mt-20 bg-stone-50 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Eyebrow>Reviews</Eyebrow>
          <h2 className="mt-3 max-w-3xl font-display text-4xl leading-tight tracking-tight text-stone-900 md:text-5xl">
            What homeowners say after move-in.
          </h2>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {site.reviews.map((r, i) => (
              <figure key={i} className="flex flex-col rounded-2xl border border-stone-200 bg-white p-7">
                <div className="flex items-center justify-between">
                  <div className="flex gap-0.5 text-copper-500">
                    {Array.from({ length: 5 }, (_, k) => (
                      <StarIcon key={k} />
                    ))}
                  </div>
                  <span className="rounded-full bg-stone-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-stone-500">Sample review</span>
                </div>
                <blockquote className="mt-5 flex-1 leading-relaxed text-stone-700">&ldquo;{r.quote}&rdquo;</blockquote>
                <figcaption className="mt-6 text-sm text-stone-500">
                  <span className="font-semibold text-stone-900">{r.name}</span> · {r.area}
                </figcaption>
              </figure>
            ))}
          </div>
        <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <a href={site.phoneHref} className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-6 py-3.5 text-sm font-semibold text-stone-50 transition hover:bg-stone-800">
              <PhoneIcon /> Talk to a builder: {site.phone}
            </a>
            <a href={site.social.find((x) => x.label.startsWith("Google"))?.href ?? "#"} className="text-sm font-semibold text-stone-600 underline-offset-4 hover:underline">
              Read more reviews on Google
            </a>
          </div>
        </div>
      </section>

      {/* land & financing */}
      <section id="land" className="scroll-mt-20 bg-white py-20 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 md:px-8 lg:grid-cols-2">
          <article className="rounded-3xl bg-stone-100 p-8 md:p-10">
            <Eyebrow>Build on your lot</Eyebrow>
            <h2 className="mt-3 font-display text-3xl leading-tight tracking-tight text-stone-900 md:text-4xl">Already own land? We take it from there.</h2>
            <p className="mt-4 leading-relaxed text-stone-600">
              We walk the lot with you and check what it needs before you commit: survey, soil test, grading, driveway and the cost to bring water, sewer or septic and power to the house.
            </p>
            <p className="mt-4 leading-relaxed text-stone-600">Still looking? We&apos;ll look at lots with you and tell you which ones make sense to build on.</p>
          </article>
          <article className="rounded-3xl bg-stone-900 p-8 text-stone-50 md:p-10">
            <Eyebrow light>Financing your build</Eyebrow>
            <h2 className="mt-3 font-display text-3xl leading-tight tracking-tight md:text-4xl">We work with your construction lender.</h2>
            <p className="mt-4 leading-relaxed text-stone-300">
              Most new homes are paid for with a construction-to-permanent loan: one closing, with the bank paying in draws as each stage passes inspection. We give your lender the plans, specs, fixed price and draw schedule they ask for.
            </p>
            <a href="#contact" className="mt-6 inline-block rounded-full bg-copper-400 px-5 py-3 text-sm font-semibold text-stone-900 transition hover:bg-copper-300">
              Talk through your budget
            </a>
          </article>
        </div>
      </section>

      {/* service area */}
      <section id="area" className="scroll-mt-20 bg-[#2f4330] py-16 text-stone-50 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 md:px-8 lg:grid-cols-[1fr_1.4fr] lg:items-center">
          <div>
            <Eyebrow light>Where we build</Eyebrow>
            <h2 className="mt-3 font-display text-3xl leading-tight tracking-tight md:text-4xl">Building across {site.region}.</h2>
            <p className="mt-4 max-w-md leading-relaxed text-stone-300">
              Local crews who know the county inspectors, the permit offices and the clay. Building somewhere else in Georgia? Ask us.
            </p>
          </div>
          <ul className="flex flex-wrap gap-2.5">
            {site.serviceAreas.map((a) => (
              <li key={a} className="flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm">
                <PinIcon className="h-3.5 w-3.5 text-copper-300" /> {a}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* faq */}
      <section id="faq" className="scroll-mt-20 bg-white py-20 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 md:px-8 lg:grid-cols-[1fr_1.5fr]">
          <div>
            <Eyebrow>FAQ</Eyebrow>
            <h2 className="mt-3 font-display text-4xl leading-tight tracking-tight text-stone-900 md:text-5xl">Questions we hear every week.</h2>
            <p className="mt-5 max-w-sm leading-relaxed text-stone-600">
              Don&apos;t see yours? Call{" "}
              <a href={site.phoneHref} className="font-semibold text-stone-900 underline-offset-4 hover:underline">{site.phone}</a> and talk to a builder, not a call center.
            </p>
          </div>
          <div className="divide-y divide-stone-200 border-y border-stone-200">
            {site.faqs.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-left font-semibold text-stone-900 [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full border border-stone-300 text-stone-500 transition group-open:rotate-45" aria-hidden>
                    +
                  </span>
                </summary>
                <p className="mt-3 max-w-2xl leading-relaxed text-stone-600">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* contact */}
      <section id="contact" className="relative scroll-mt-16 overflow-hidden bg-stone-900 py-20 text-stone-50 md:py-28">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
          aria-hidden
        />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-5 md:px-8 lg:grid-cols-2">
          <div>
            <Eyebrow light>Start your build</Eyebrow>
            <h2 className="mt-3 font-display text-4xl leading-tight tracking-tight md:text-5xl">Have a lot, a plan, or just an idea?</h2>
            <p className="mt-5 max-w-md leading-relaxed text-stone-300">
              Tell us where you are. We&apos;ll walk the land with you, talk budget honestly and send a written plan within a week.
            </p>
            <ol className="mt-8 grid gap-3 text-sm text-stone-300">
              {["We call you within one business day.", "We meet at your lot or our office.", "You get a written plan and budget range."].map((t, i) => (
                <li key={t} className="flex items-center gap-3">
                  <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full border border-copper-300/60 text-xs text-copper-300">{i + 1}</span>
                  {t}
                </li>
              ))}
            </ol>
            <div className="mt-10 grid gap-3 sm:grid-cols-2">
              <a href={site.phoneHref} className="flex items-center gap-3 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10 transition hover:bg-white/10">
                <PhoneIcon className="h-5 w-5 text-copper-300" />
                <span>
                  <span className="block text-xs text-stone-400">Call us</span>
                  <span className="text-lg">{site.phone}</span>
                </span>
              </a>
              <a href={site.smsHref} className="flex items-center gap-3 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10 transition hover:bg-white/10">
                <ChatIcon className="h-5 w-5 text-copper-300" />
                <span>
                  <span className="block text-xs text-stone-400">Text us</span>
                  <span className="text-lg">{site.phone}</span>
                </span>
              </a>
            </div>
            <p className="mt-5 flex items-center gap-2 text-sm text-stone-400">
              <ClockIcon /> {site.hours}
            </p>
          </div>
          <ContactForm />
        </div>
      </section>

      <footer className="bg-stone-950 pb-28 pt-14 text-sm text-stone-400 md:pb-10" style={{ backgroundColor: "#141210" }}>
        <div className="mx-auto grid max-w-7xl gap-10 px-5 md:grid-cols-[1.4fr_1fr_1fr] md:px-8">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs leading-relaxed">{site.tagline}</p>
            <p className="mt-4 text-xs text-stone-500">{site.license}</p>
          </div>
          <div>
            <p className="font-semibold text-stone-100">Contact</p>
            <ul className="mt-4 grid gap-2.5">
              <li><a href={site.phoneHref} className="flex items-center gap-2 hover:text-copper-300"><PhoneIcon /> {site.phone}</a></li>
              <li><a href={`mailto:${site.email}`} className="flex items-center gap-2 hover:text-copper-300"><MailIcon /> {site.email}</a></li>
              <li className="flex items-start gap-2"><PinIcon className="mt-0.5 h-4 w-4 flex-none" /> {addressLine}</li>
              <li className="flex items-start gap-2"><ClockIcon className="mt-0.5 h-4 w-4 flex-none" /> {site.hours}</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-stone-100">Explore</p>
            <ul className="mt-4 grid gap-2.5">
              {nav.map((n) => (
                <li key={n.href}><a href={n.href} className="hover:text-copper-300">{n.label}</a></li>
              ))}
              <li><a href="#contact" className="hover:text-copper-300">Free estimate</a></li>
            </ul>
            <ul className="mt-6 flex flex-wrap gap-4">
              {site.social.map((s) => (
                <li key={s.label}><a href={s.href} className="hover:text-copper-300">{s.label}</a></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mx-auto mt-12 flex max-w-7xl flex-col gap-2 border-t border-white/10 px-5 pt-6 text-xs text-stone-500 md:flex-row md:items-center md:justify-between md:px-8">
          <p>© {new Date().getFullYear()} {site.name}. All rights reserved. Equal Housing Opportunity.</p>
          <p>{site.demoNotice}</p>
        </div>
      </footer>

      <MobileActionBar />
    </main>
  );
}
