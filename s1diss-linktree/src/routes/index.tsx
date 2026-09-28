import { createFileRoute } from "@tanstack/react-router";
import { Mic2, SlidersHorizontal, Music4, Instagram } from "lucide-react";
import { useCookieConsent } from "../components/cookie-consent";

const SPOTIFY_URL = "https://open.spotify.com/artist/0kEr1Y5oPvtNtz9L4DLSBC";
const APPLE_MUSIC_URL = "https://music.apple.com/gr/artist/s1diss/6785485694?l=el";
const INSTAGRAM_URL = "https://instagram.com/s1diss";


const services = [
  {
    icon: Mic2,
    title: "Recording Session",
    price: "€10",
    unit: "/ hour",
    desc: "Studio time, tracked and comped in the room.",
  },
  {
    icon: SlidersHorizontal,
    title: "Mixing & Mastering",
    price: "€40",
    unit: "/ track",
    desc: "Radio-ready balance, depth and loudness.",
  },
  {
    icon: Music4,
    title: "Beat License",
    price: "€50",
    unit: "MP3 / WAV",
    desc: "Exclusive-feel license with stems on request.",
  },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "linktreeS — S1diss | Beats, Mixing & Studio Sessions" },
      {
        name: "description",
        content:
          "S1diss: recording sessions €10/h, mixing & mastering €40/track, beat licenses €50. Stream on Spotify.",
      },
      { property: "og:title", content: "linktreeS — S1diss" },
      {
        property: "og:description",
        content: "Dark, hard-hitting production. Sessions, mixing & mastering, beat licenses.",
      },
      { property: "og:type", content: "website" },

      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const { hasExternalContentConsent, openSettings } = useCookieConsent();

  return (
    <main className="min-h-screen px-5 py-12">
      <div className="mx-auto w-full max-w-[520px]">
        {/* Header */}
        <header className="animate-fade-up flex flex-col items-center text-center">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-primary/30 blur-2xl" aria-hidden />
            <div className="glass-card relative flex size-24 items-center justify-center rounded-full">
              <span className="font-display text-3xl font-extrabold tracking-tight text-primary text-glow">
                S1
              </span>
            </div>
          </div>
          <h1 className="font-display mt-6 text-4xl font-extrabold tracking-tight">S1diss</h1>
          <p className="mt-2 text-sm font-medium uppercase tracking-[0.28em] text-muted-foreground">
            Music Producer
          </p>
          <p className="mt-4 max-w-[380px] text-sm leading-relaxed text-muted-foreground">
            Dark, hard-hitting production. Beats, mixing &amp; mastering, and studio sessions.
          </p>
        </header>

        {/* Spotify link */}
        <a
          href={SPOTIFY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="glass-card animate-fade-up animate-soft-pulse mt-8 flex items-center justify-center gap-3 rounded-2xl px-6 py-4 text-sm font-semibold tracking-wide"
          style={{ animationDelay: "0.1s" }}
        >
          <Music4 className="size-4 text-primary" aria-hidden />
          Listen on Spotify
        </a>

        {/* Apple Music link */}
        <a
          href={APPLE_MUSIC_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="glass-card animate-fade-up animate-soft-pulse mt-3 flex items-center justify-center gap-3 rounded-2xl px-6 py-4 text-sm font-semibold tracking-wide"
          style={{ animationDelay: "0.12s" }}
        >
          <Music4 className="size-4 text-primary" aria-hidden />
          Listen on Apple Music
        </a>

        {/* Spotify embed — no third-party request before explicit consent. */}
        <section
          className="animate-fade-up mt-6 overflow-hidden rounded-2xl border border-border"
          style={{ animationDelay: "0.15s" }}
          aria-label="Spotify player"
        >
          {hasExternalContentConsent ? (
            <iframe
              title="S1dis on Spotify"
              src="https://open.spotify.com/embed/artist/0kEr1Y5oPvtNtz9L4DLSBC?utm_source=generator"
              width="100%"
              height="352"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              className="block w-full"
            />
          ) : (
            <div className="spotify-consent-placeholder">
              <Music4 className="size-8 text-primary" aria-hidden />
              <h2>Το Spotify player είναι απενεργοποιημένο</h2>
              <p>Ενεργοποιήστε το «Εξωτερικό περιεχόμενο» για να φορτώσει το player από το Spotify.</p>
              <button type="button" className="cookie-button cookie-button--primary" onClick={openSettings}>
                Ρυθμίσεις Cookies
              </button>
            </div>
          )}
        </section>

        {/* Services */}
        <section className="mt-10" aria-labelledby="services-heading">
          <h2
            id="services-heading"
            className="font-display animate-fade-up text-center text-xs font-bold uppercase tracking-[0.32em] text-muted-foreground"
            style={{ animationDelay: "0.2s" }}
          >
            Services
          </h2>

          <ul className="mt-5 space-y-4">
            {services.map((s, i) => (
              <li
                key={s.title}
                className="glass-card animate-fade-up rounded-2xl p-5"
                style={{ animationDelay: `${0.25 + i * 0.07}s` }}
              >
                <div className="flex items-start gap-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary/60 text-primary">
                    <s.icon className="size-5" aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="font-display truncate text-base font-bold">{s.title}</h3>
                      <span className="shrink-0 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                        {s.price}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {s.unit} · {s.desc}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Info / DM */}
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="glass-card animate-fade-up mt-6 block rounded-2xl p-5 text-center"
          style={{ animationDelay: "0.5s" }}
        >
          <span className="inline-flex items-center gap-2 text-sm font-semibold tracking-wide">
            <Instagram className="size-4 text-primary" aria-hidden />
            Στείλε DM στο Instagram
          </span>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            Για πληροφορίες, διαθεσιμότητα studio, custom beats ή οτιδήποτε άλλο — γράψε μου DM και
            απαντάω άμεσα.
          </p>
        </a>

        <footer className="mt-10 pb-6 text-center text-[11px] uppercase tracking-[0.25em] text-muted-foreground/70">
          <div>© {new Date().getFullYear()} S1diss</div>
          <div className="mt-4 flex justify-center gap-4 normal-case tracking-normal">
            <a href="/cookie-policy" className="footer-link">
              Πολιτική Cookies
            </a>
            <button type="button" className="footer-link" onClick={openSettings}>
              Ρυθμίσεις Cookies
            </button>
          </div>
        </footer>

      </div>
    </main>
  );
}
