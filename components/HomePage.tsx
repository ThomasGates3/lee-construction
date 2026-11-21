import { ScrollStory } from "@/components/ScrollStory";
import { ContactForm } from "@/components/ContactForm";
import { SiteHeader } from "@/components/SiteHeader";
import { HouseScene, houseScene } from "@/scenes/house/HouseScene";
import { site } from "@/lib/site";

function Logo() {
  return (
    <a href="#top" className="flex items-center gap-2.5 text-stone-50">
      <svg viewBox="0 0 32 32" className="h-8 w-8" aria-hidden>
        <rect width="32" height="32" rx="7" fill="#9b4a34" />
        <path d="M7 23 L16 10 L25 23" fill="none" stroke="#faf8f4" strokeWidth="2.6" strokeLinejoin="round" />
        <path d="M11 23 V18 H21 V23" fill="none" stroke="#faf8f4" strokeWidth="2.2" />
      </svg>
      <span className="font-display text-lg tracking-tight">{site.name}</span>
    </a>
  );
}

export function HomePage() {
  return (
    <main id="top">
      {/* nav sits over the sticky scene */}
      <SiteHeader>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
          <Logo />
          <nav className="hidden items-center gap-8 text-sm text-stone-100 md:flex">
            <a href="#build" className="hover:text-copper-300">The build</a>
            <a href="#services" className="hover:text-copper-300">Services</a>
            <a href="#process" className="hover:text-copper-300">How we work</a>
            <a href={site.phoneHref} className="hover:text-copper-300">{site.phone}</a>
          </nav>
          <a
            href="#contact"
            className="rounded-full bg-copper-400 px-4 py-2 text-sm font-semibold text-stone-900 shadow-lg shadow-black/20 transition hover:bg-copper-300"
          >
            Start your build
          </a>
        </div>
      </SiteHeader>

      <ScrollStory
        config={houseScene}
        finalActions={
          <>
            <a href="#contact" className="rounded-full bg-copper-400 px-5 py-3 text-sm font-semibold text-stone-900 transition hover:bg-copper-300">
              Book a free site walk
            </a>
            <a href="#services" className="rounded-full border border-stone-300/60 px-5 py-3 text-sm font-semibold text-stone-50 transition hover:bg-white/10">
              See what we build
            </a>
          </>
        }
      >
        <HouseScene />
      </ScrollStory>

      {/* highlights */}
      <section className="bg-stone-900 text-stone-50">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px bg-white/10 md:grid-cols-4">
          {site.highlights.map((h) => (
            <div key={h.label} className="bg-stone-900 px-6 py-10 md:px-8 md:py-14">
              <p className="font-display text-4xl text-copper-300 md:text-5xl">{h.value}</p>
              <p className="mt-2 text-sm text-stone-300">{h.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* services */}
      <section id="services" className="bg-stone-50 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-copper-600">What we build</p>
          <h2 className="mt-3 max-w-2xl font-display text-4xl leading-tight tracking-tight text-stone-900 md:text-5xl">
            One builder from the first stake to the last brick.
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {site.services.map((s, i) => (
              <article key={s.title} className="group rounded-2xl border border-stone-200 bg-white p-7 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-stone-300/40">
                <p className="font-display text-sm text-copper-600">0{i + 1}</p>
                <h3 className="mt-4 text-lg font-semibold text-stone-900">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">{s.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* how we work */}
      <section id="process" className="bg-stone-100 py-20 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 md:px-8 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-copper-600">How we work</p>
            <h2 className="mt-3 font-display text-4xl leading-tight tracking-tight text-stone-900 md:text-5xl">
              You always know where your home stands.
            </h2>
            <p className="mt-5 max-w-md leading-relaxed text-stone-600">
              Building a home is the biggest purchase most families make. We keep it calm with a fixed plan, honest numbers and a builder who picks up the phone.
            </p>
          </div>
          <ul className="grid gap-4">
            {site.promises.map((p) => (
              <li key={p.title} className="flex gap-5 rounded-2xl bg-white p-6">
                <span className="mt-1 h-3 w-3 flex-none rounded-sm bg-[#9b4a34]" aria-hidden />
                <div>
                  <h3 className="font-semibold text-stone-900">{p.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-stone-600">{p.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* contact */}
      <section id="contact" className="relative overflow-hidden bg-stone-900 py-20 text-stone-50 md:py-28">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
          aria-hidden
        />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-5 md:px-8 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-copper-300">Start your build</p>
            <h2 className="mt-3 font-display text-4xl leading-tight tracking-tight md:text-5xl">
              Have a lot, a plan, or just an idea?
            </h2>
            <p className="mt-5 max-w-md leading-relaxed text-stone-300">
              Tell us where you are. We&apos;ll walk the land with you, talk budget honestly, and send a written plan within a week.
            </p>
            <dl className="mt-10 grid gap-6 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-stone-400">Call</dt>
                <dd className="mt-1 text-lg"><a href={site.phoneHref} className="hover:text-copper-300">{site.phone}</a></dd>
              </div>
              <div>
                <dt className="text-stone-400">Serving</dt>
                <dd className="mt-1 text-lg">{site.serviceArea}</dd>
              </div>
            </dl>
          </div>
          <ContactForm />
        </div>
      </section>

      <footer className="bg-stone-900 pb-10 text-stone-400">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 border-t border-white/10 px-5 pt-8 text-xs md:flex-row md:items-center md:justify-between md:px-8">
          <p>© {new Date().getFullYear()} {site.name} · {site.region}</p>
          <p>{site.demoNotice}</p>
        </div>
      </footer>
    </main>
  );
}
