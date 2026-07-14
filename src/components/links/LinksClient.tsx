"use client";

import { PledgeHeart } from "@/components/ImpactPledge";
import { IconArrow, IconInsta, IconTiktok, IconFb } from "@/components/icons";
import { StatusBadge, pick } from "@/components/public/impactUi";
import type { InitiativeDTO } from "@/lib/dashboard/dto";
import { LANG_COOKIE, langAtom, type Lang } from "@/store/lang";
import { useAtom } from "jotai";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Link } from "sanity/router";

/* ── Small link-hub-only icons (kept local so the hub stays self-contained) ── */

const IconGlobe = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18" />
    <path d="M12 3a15 15 0 0 1 0 18" />
    <path d="M12 3a15 15 0 0 0 0 18" />
  </svg>
);

const IconBag = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

const IconHills = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M3 19h18" />
    <path d="M3 19 8 9l4 5 3-6 6 11" />
  </svg>
);

const IconPin = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const IconNews = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M7 9h10" />
    <path d="M7 13h6" />
  </svg>
);

const IconMail = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m4 7 8 6 8-6" />
  </svg>
);

const Arrow = () => (
  <svg
    className="lk-arrow"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

/* ── Copy ── */

type Copy = {
  tagline: [string, string];
  eyebrow: string;
  intro: React.ReactNode;
  pledgeTop: string;
  pledgeSub: string;
  focusKicker: string;
  focusCta: string;
  stepsWord: string;
  backTo: string;
  primaryLabel: string;
  primaryHint: string;
  linksTitle: string;
  socialTitle: string;
  contactTitle: string;
  comingSoon: string;
  entity: string;
  footer: string;
  links: {
    label: string;
    hint: string;
    href: string;
    icon: React.ReactNode;
    primary?: boolean;
    soon?: boolean;
    external?: boolean;
  }[];
};

const COPY: Record<Lang, Copy> = {
  bg: {
    tagline: ["Вкусно за теб.", "Смислено за общността."],
    eyebrow: "Барче с характер, вдъхновено от Пловдив",
    intro: (
      <>
        Барче със <strong>солен карамел</strong>, създадено в Пловдив — ниски
        нетни въглехидрати, високо съдържание на фибри и{" "}
        <strong>мисия зад всяка покупка</strong>.
      </>
    ),
    pledgeTop: "0.15 € от всяко барче",
    pledgeSub: "влизат във фонд ТЕПЕ bite Impact",
    focusKicker: "Инициатива на фокус",
    focusCta: "Разгледай инициативата",
    stepsWord: "стъпки",
    backTo: "Назад към",
    primaryLabel: "Поръчай онлайн",
    primaryHint: "Изпробвай барчето — и подкрепи каузата",
    linksTitle: "Открий ни",
    socialTitle: "Последвай ни",
    contactTitle: "Свържи се с нас",
    comingSoon: "Очаквайте",
    entity: "БАИР ЕООД",
    footer: "ТЕПЕ bite · Пловдив",
    links: [
      {
        label: "Уебсайтът ни",
        hint: "Историята и продуктът в детайли",
        href: "/",
        icon: <IconGlobe />,
        external: false,
      },
      {
        label: "Instagram",
        hint: "Новини и прогрес по бранда",
        href: "https://www.instagram.com/tepe.bite/",
        icon: <IconInsta />,
        external: true,
      },
      {
        label: "TikTok",
        hint: "Кратки видеа и зад кулисите",
        href: "https://www.tiktok.com/@tepe.bite",
        icon: <IconTiktok />,
        external: true,
      },
      {
        label: "Нашите инициативи",
        hint: "Каузи, партньорства и въздействие",
        href: "/initiatives",
        icon: <IconHills />,
        external: false,
      },
      {
        label: "Къде да ни намериш",
        hint: "Партниращи обекти в Пловдив",
        href: "/partnering-locations",
        icon: <IconPin />,
        external: false,
      },
      {
        label: "Новини",
        hint: "Публикации, интервюта и истории",
        href: "/news",
        icon: <IconNews />,
        external: false,
      },
      {
        label: "Facebook",
        hint: "Общност, новини и събития",
        href: "",
        icon: <IconFb />,
        soon: true,
      },
    ],
  },
  en: {
    tagline: ["Delicious for you.", "Thoughtful for the community."],
    eyebrow: "A bar with character, inspired by Plovdiv",
    intro: (
      <>
        A <strong>salted caramel</strong> bar made in Plovdiv — low in net
        carbs, high in fibre, with a{" "}
        <strong>mission behind every purchase</strong>.
      </>
    ),
    pledgeTop: "0.15 € from every bar",
    pledgeSub: "goes to the ТЕПЕ bite Impact fund",
    focusKicker: "Initiative in focus",
    focusCta: "Explore the initiative",
    stepsWord: "steps",
    backTo: "Back to",
    primaryLabel: "Order online",
    primaryHint: "Taste the bar — and back the cause",
    linksTitle: "Find us",
    socialTitle: "Follow us",
    contactTitle: "Get in touch",
    comingSoon: "Soon",
    entity: "BAIR LTD",
    footer: "ТЕПЕ bite · Plovdiv",
    links: [
      {
        label: "Our website",
        hint: "The story and product in detail",
        href: "/",
        icon: <IconGlobe />,
        external: false,
      },
      {
        label: "Instagram",
        hint: "News and brand progress",
        href: "https://www.instagram.com/tepe.bite/",
        icon: <IconInsta />,
        external: true,
      },
      {
        label: "TikTok",
        hint: "Short videos and behind-the-scenes",
        href: "https://www.tiktok.com/@tepe.bite",
        icon: <IconTiktok />,
        external: true,
      },
      {
        label: "Our initiatives",
        hint: "Causes, partnerships and impact",
        href: "/initiatives",
        icon: <IconHills />,
        external: false,
      },
      {
        label: "Where to find us",
        hint: "Partnering locations in Plovdiv",
        href: "/partnering-locations",
        icon: <IconPin />,
        external: false,
      },
      {
        label: "News",
        hint: "Articles, interviews and stories",
        href: "/news",
        icon: <IconNews />,
        external: false,
      },
      {
        label: "Facebook",
        hint: "Community, news and events",
        href: "",
        icon: <IconFb />,
        soon: true,
      },
    ],
  },
};

/* Short, 1–2-word names for the "Back to …" note, keyed by route base. */
const ROUTE_NAMES: { test: (p: string) => boolean; name: [string, string] }[] =
  [
    { test: (p) => p === "/", name: ["Начало", "Home"] },
    { test: (p) => p.startsWith("/product"), name: ["Продукт", "Product"] },
    {
      test: (p) => p.startsWith("/initiatives"),
      name: ["Инициативи", "Initiatives"],
    },
    { test: (p) => p.startsWith("/impact"), name: ["Impact", "Impact"] },
    {
      test: (p) => p.startsWith("/partnering-locations"),
      name: ["Обекти", "Locations"],
    },
    { test: (p) => p.startsWith("/news"), name: ["Новини", "News"] },
    { test: (p) => p.startsWith("/order"), name: ["Поръчка", "Order"] },
    { test: (p) => p.startsWith("/cart"), name: ["Количка", "Cart"] },
    { test: (p) => p.startsWith("/checkout"), name: ["Плащане", "Checkout"] },
    { test: (p) => p.startsWith("/legal"), name: ["Правно", "Legal"] },
  ];

function routeName(pathname: string): [string, string] {
  return ROUTE_NAMES.find((r) => r.test(pathname))?.name ?? ["Сайта", "Site"];
}

type BackTarget = { href: string; name: [string, string] };

export default function LinksClient({
  featured,
}: {
  featured: InitiativeDTO | null;
}) {
  const [lang, setLang] = useAtom(langAtom);
  const t = COPY[lang];

  // "Back to …" note — only when the visitor arrived from our own site.
  // Resolved after mount (needs document.referrer), so it fades in client-side.
  const [back, setBack] = useState<BackTarget | null>(null);
  useEffect(() => {
    try {
      if (!document.referrer) return;
      const ref = new URL(document.referrer);
      if (ref.origin !== window.location.origin) return;
      if (ref.pathname === "/links" || ref.pathname.startsWith("/links/"))
        return;
      setBack({
        href: ref.pathname + ref.search,
        name: routeName(ref.pathname),
      });
    } catch {
      /* malformed referrer — no back note */
    }
  }, []);

  const setLanguage = (value: Lang) => {
    setLang(value);
    if (typeof document !== "undefined") {
      document.cookie = `${LANG_COOKIE}=${encodeURIComponent(
        value,
      )}; path=/; max-age=31536000; samesite=lax`;
    }
  };

  // Featured initiative (real data) → focus card values.
  const focusTitle = featured
    ? pick(lang, featured.titleBg, featured.titleEn)
    : "";
  const focusDesc = featured
    ? pick(lang, featured.descriptionBg, featured.descriptionEn)
    : "";
  const focusPlace = featured
    ? pick(lang, featured.locationBg, featured.locationEn)
    : "";
  const totalSteps = featured?.steps.length ?? 0;
  const doneSteps = featured?.steps.filter((s) => s.done).length ?? 0;
  const showProgress =
    !!featured &&
    totalSteps > 0 &&
    featured.status !== "frozen" &&
    featured.status !== "planned";
  const focusPct = totalSteps ? Math.round((doneSteps / totalSteps) * 100) : 0;

  return (
    <main className="lk-page">
      {/* Atmosphere: warm glow + Plovdiv hills silhouette (the brand's symbol) */}
      <div className="lk-atmos" aria-hidden="true">
        <svg
          className="lk-hills"
          viewBox="0 0 1200 220"
          preserveAspectRatio="none"
        >
          <path d="M0 220 L0 150 Q150 70 300 110 Q450 150 600 90 Q750 30 900 80 Q1050 130 1200 70 L1200 220 Z" />
        </svg>
      </div>

      <div className="lk-shell">
        {/* Top row: back-note (when arriving from the site) + language switch */}
        <div
          className="lk-langbar"
          style={{ justifyContent: back ? "space-between" : "flex-end" }}
        >
          {back && (
            <Link className="lk-back" href={back.href}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M19 12H5" />
                <path d="m12 19-7-7 7-7" />
              </svg>
              <span className="lk-back-label">
                {t.backTo} <strong>{back.name[lang === "bg" ? 0 : 1]}</strong>
              </span>
            </Link>
          )}
          <div
            className="lk-langswitch"
            role="group"
            aria-label="Език / Language"
          >
            {(["bg", "en"] as Lang[]).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLanguage(l)}
                className={`lk-langbtn${lang === l ? " active" : ""}`}
                aria-pressed={lang === l}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Hero */}
        <header
          className="lk-card lk-hero lk-reveal"
          style={{ ["--d" as string]: "0ms" }}
        >
          <div className="lk-brand">
            <Image
              src="/logo-nav.png"
              alt="ТЕПЕ bite"
              width={64}
              height={64}
              priority
              className="lk-logo"
            />
            <span className="lk-wordmark">
              <span className="lk-wordmark-bite">bite</span>
              <span className="lk-wordmark-tepe">ТЕПЕ</span>
            </span>
          </div>

          <div className="lk-eyebrow">
            <span className="lk-eyebrow-line" />
            <span>{t.eyebrow}</span>
            <span className="lk-eyebrow-line" />
          </div>

          <h1 className="lk-headline">
            <span>{t.tagline[0]}</span>
            <span className="lk-headline-2">{t.tagline[1]}</span>
          </h1>

          <p className="lk-intro">{t.intro}</p>

          {/* Fixed-pledge lockup — the 0.15 € promise */}
          <Link href="/impact" className="lk-pledge">
            <PledgeHeart size={44} />
            <span className="lk-pledge-copy">
              <span className="lk-pledge-top">{t.pledgeTop}</span>
              <span className="lk-pledge-sub">
                {t.pledgeSub}
                <Arrow />
              </span>
            </span>
          </Link>
        </header>

        {/* Initiative in focus — the featured initiative from the API */}
        {featured && (
          <a
            href={`/initiatives/${featured.slug}`}
            className="lk-card lk-focus lk-reveal"
            style={{ ["--d" as string]: "80ms" }}
          >
            <div className="lk-focus-head">
              <span className="lk-kicker">{t.focusKicker}</span>
              <StatusBadge status={featured.status} lang={lang} />
            </div>
            <div className="lk-focus-title">{focusTitle}</div>
            {focusDesc && <p className="lk-focus-line">{focusDesc}</p>}

            <div className="lk-focus-meta">
              {focusPlace ? (
                <span className="lk-place">
                  <IconPin />
                  {focusPlace}
                </span>
              ) : (
                <span />
              )}
              <span className="lk-focus-cta">
                {t.focusCta}
                <Arrow />
              </span>
            </div>

            {showProgress && (
              <div className="lk-progress">
                <div className="lk-progress-track">
                  <div
                    className="lk-progress-fill"
                    style={{ width: `${focusPct}%` }}
                  />
                </div>
                <div className="lk-progress-row">
                  <span>
                    {doneSteps} / {totalSteps} {t.stepsWord}
                  </span>
                  <span className="lk-progress-pct">{focusPct}%</span>
                </div>
              </div>
            )}
          </a>
        )}

        {/* Primary CTA — order */}
        <Link
          href="/order"
          className="lk-primary lk-reveal"
          style={{ ["--d" as string]: "140ms" }}
        >
          <span className="lk-primary-icon">
            <IconBag />
          </span>
          <span className="lk-primary-copy">
            <span className="lk-primary-label">{t.primaryLabel}</span>
            <span className="lk-primary-hint">{t.primaryHint}</span>
          </span>
          <span className="lk-primary-arrow">
            <IconArrow />
          </span>
        </Link>

        {/* Link list */}
        <section
          className="lk-card lk-links lk-reveal"
          style={{ ["--d" as string]: "200ms" }}
        >
          <div className="lk-section-title">{t.linksTitle}</div>
          <div className="lk-list">
            {t.links.map((link) =>
              link.soon ? (
                <div
                  key={link.label}
                  className="lk-row soon"
                  aria-disabled="true"
                >
                  <span className="lk-row-icon">{link.icon}</span>
                  <span className="lk-row-copy">
                    <span className="lk-row-label">{link.label}</span>
                    <span className="lk-row-hint">{link.hint}</span>
                  </span>
                  <span className="lk-soon-badge">{t.comingSoon}</span>
                </div>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  className="lk-row"
                  {...(link.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  <span className="lk-row-icon">{link.icon}</span>
                  <span className="lk-row-copy">
                    <span className="lk-row-label">{link.label}</span>
                    <span className="lk-row-hint">{link.hint}</span>
                  </span>
                  <Arrow />
                </a>
              ),
            )}
          </div>
        </section>

        {/* Socials + contact */}
        <section
          className="lk-card lk-socials lk-reveal"
          style={{ ["--d" as string]: "260ms" }}
        >
          <div className="lk-section-title center">{t.socialTitle}</div>
          <div className="lk-social-row">
            <a
              className="lk-social"
              href="https://www.instagram.com/tepe.bite/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <IconInsta />
            </a>
            <a
              className="lk-social"
              href="https://www.tiktok.com/@tepe.bite"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
            >
              <IconTiktok />
            </a>
            <span className="lk-social soon" aria-label="Facebook — soon">
              <IconFb />
            </span>
          </div>

          <div className="lk-divider" />

          <div className="lk-section-title center">{t.contactTitle}</div>
          <Link className="lk-contact" href="mailto:tepe@mail.bg">
            <IconMail />
            tepe@mail.bg
          </Link>
        </section>

        <footer className="lk-footer">
          <strong>{t.entity}</strong>
          <span>{t.footer}</span>
        </footer>
      </div>

      <style>{`
        .lk-page {
          --lk-max: 480px;
          position: relative;
          min-height: 100dvh;
          display: flex;
          justify-content: center;
          padding: 18px 16px 40px;
          background:
            radial-gradient(120% 55% at 50% -8%, oklch(93% 0.06 70 / 0.55), transparent 60%),
            var(--bg);
          overflow: hidden;
        }
        .lk-atmos {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
        }
        .lk-hills {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          width: 100%;
          height: 34vh;
          min-height: 220px;
        }
        .lk-hills path { fill: var(--plum); opacity: 0.05; }

        .lk-shell {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: var(--lk-max);
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        /* Language switch */
        .lk-langbar { display: flex; justify-content: flex-end; }
        .lk-langswitch {
          display: inline-flex;
          gap: 3px;
          padding: 4px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 100px;
          box-shadow: var(--shadow);
        }
        .lk-langbtn {
          border: none;
          background: transparent;
          color: var(--text-soft);
          padding: 6px 14px;
          border-radius: 100px;
          font-family: var(--font-body);
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .lk-langbtn.active { background: var(--plum); color: #fff; }

        /* Back-to-site note — mirrors the language pill's weight, sits at the
           card's left edge (start of the shell, not the screen). */
        .lk-back {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 7px 14px 7px 11px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 100px;
          box-shadow: var(--shadow);
          color: var(--text-mid);
          text-decoration: none;
          font-size: 0.76rem;
          line-height: 1;
          white-space: nowrap;
          max-width: 62%;
          overflow: hidden;
          transition: transform 0.2s ease, border-color 0.2s ease, color 0.2s ease;
        }
        .lk-back svg { width: 15px; height: 15px; flex-shrink: 0; transition: transform 0.2s ease; }
        .lk-back strong { color: var(--plum); font-weight: 700; }
        .lk-back-label { overflow: hidden; text-overflow: ellipsis; }
        .lk-back:hover {
          transform: translateY(-1px);
          border-color: var(--caramel);
          color: var(--plum);
        }
        .lk-back:hover svg { transform: translateX(-2px); }

        /* Card shell */
        .lk-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--r-lg);
          box-shadow: var(--shadow);
        }

        /* Hero */
        .lk-hero { padding: 30px 26px 26px; text-align: center; }
        .lk-brand {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }
        .lk-logo { height: 58px; width: auto; display: block; }
        .lk-wordmark { display: flex; flex-direction: column; line-height: 1; text-align: left; }
        .lk-wordmark-bite {
          font-family: var(--font-body);
          font-weight: 600;
          font-size: 0.72rem;
          letter-spacing: 0.16em;
          color: var(--caramel);
          text-transform: uppercase;
        }
        .lk-wordmark-tepe {
          font-family: var(--font-head);
          font-weight: 700;
          font-size: 1.7rem;
          color: var(--plum);
          letter-spacing: -0.02em;
          line-height: 1.05;
        }

        .lk-eyebrow {
          display: flex;
          align-items: center;
          gap: 10px;
          justify-content: center;
          margin-bottom: 16px;
          font-family: var(--font-head);
          font-size: 0.74rem;
          font-weight: 600;
          color: var(--caramel);
          letter-spacing: 0.02em;
        }
        .lk-eyebrow span:nth-child(2) { flex-shrink: 1; }
        .lk-eyebrow-line {
          height: 2px;
          width: 18px;
          background: var(--caramel);
          border-radius: 10px;
          flex-shrink: 0;
        }

        .lk-headline {
          font-family: var(--font-head);
          font-weight: 900;
          color: var(--plum);
          letter-spacing: -0.02em;
          line-height: 1.1;
          font-size: clamp(1.7rem, 8vw, 2.15rem);
          margin-bottom: 14px;
        }
        .lk-headline span { display: block; }
        .lk-headline-2 { color: var(--caramel); }

        .lk-intro {
          font-size: 0.95rem;
          line-height: 1.6;
          color: var(--text-mid);
          max-width: 34ch;
          margin: 0 auto 22px;
        }
        .lk-intro strong { color: var(--plum); font-weight: 700; }

        /* Pledge lockup */
        .lk-pledge {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 10px 18px 10px 12px;
          background: var(--sky-lt);
          border: 1px solid oklch(85% 0.06 230);
          border-radius: 100px;
          text-decoration: none;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .lk-pledge:hover { transform: translateY(-2px); box-shadow: var(--shadow-lg); }
        .lk-pledge-copy { text-align: left; line-height: 1.3; }
        .lk-pledge-top { display: block; font-weight: 800; color: var(--plum); font-size: 0.92rem; }
        .lk-pledge-sub {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.76rem;
          font-weight: 600;
          color: var(--sky-dk);
        }
        .lk-pledge-sub .lk-arrow { width: 13px; height: 13px; }

        /* Initiative in focus */
        .lk-focus {
          padding: 20px 22px 22px;
          text-decoration: none;
          display: block;
          position: relative;
          overflow: hidden;
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
        }
        .lk-focus::before {
          content: "";
          position: absolute;
          inset: 0 auto 0 0;
          width: 4px;
          background: linear-gradient(180deg, var(--caramel), oklch(58% 0.16 44));
        }
        .lk-focus:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
          border-color: oklch(80% 0.08 60);
        }
        .lk-focus-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
        }
        .lk-kicker {
          font-family: var(--font-body);
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--caramel);
        }
        .lk-focus-title {
          font-family: var(--font-head);
          font-weight: 700;
          font-size: 1.2rem;
          color: var(--plum);
          margin-bottom: 6px;
        }
        .lk-focus-line {
          font-size: 0.85rem;
          line-height: 1.55;
          color: var(--text-mid);
          margin-bottom: 14px;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .lk-focus-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 14px;
        }
        .lk-place {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: var(--caramel-lt);
          color: oklch(42% 0.12 52);
          border-radius: 100px;
          padding: 5px 12px;
          font-size: 0.72rem;
          font-weight: 600;
        }
        .lk-place svg { width: 13px; height: 13px; flex-shrink: 0; }
        .lk-focus-cta {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.76rem;
          font-weight: 700;
          color: var(--plum);
          white-space: nowrap;
        }
        .lk-focus-cta .lk-arrow { width: 14px; height: 14px; }

        .lk-progress-track {
          height: 7px;
          background: var(--border);
          border-radius: 10px;
          overflow: hidden;
          margin-bottom: 7px;
        }
        .lk-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--caramel), oklch(58% 0.16 44));
          border-radius: 10px;
        }
        .lk-progress-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.72rem;
          color: var(--text-soft);
        }
        .lk-progress-pct { font-weight: 700; color: var(--plum); }

        /* Primary CTA */
        .lk-primary {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 16px 18px;
          border-radius: var(--r-lg);
          background: linear-gradient(135deg, var(--plum), oklch(38% 0.1 320));
          color: #fff;
          text-decoration: none;
          box-shadow: 0 10px 30px oklch(32% 0.09 315 / 0.28);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .lk-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 16px 40px oklch(32% 0.09 315 / 0.36);
        }
        .lk-primary-icon {
          width: 46px; height: 46px; flex-shrink: 0;
          border-radius: 14px;
          background: oklch(100% 0 0 / 0.14);
          display: flex; align-items: center; justify-content: center;
        }
        .lk-primary-icon svg { width: 22px; height: 22px; }
        .lk-primary-copy { flex: 1; min-width: 0; line-height: 1.3; }
        .lk-primary-label {
          display: block;
          font-family: var(--font-head);
          font-weight: 700;
          font-size: 1.1rem;
        }
        .lk-primary-hint { display: block; font-size: 0.78rem; color: oklch(100% 0 0 / 0.82); }
        .lk-primary-arrow {
          width: 34px; height: 34px; flex-shrink: 0;
          border-radius: 50%;
          background: var(--caramel);
          display: flex; align-items: center; justify-content: center;
          transition: transform 0.2s ease;
        }
        .lk-primary:hover .lk-primary-arrow { transform: translateX(3px); }

        /* Link list */
        .lk-links { padding: 20px 18px; }
        .lk-section-title {
          font-family: var(--font-body);
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: var(--text-soft);
          margin: 2px 4px 12px;
        }
        .lk-section-title.center { text-align: center; margin-bottom: 14px; }
        .lk-list { display: flex; flex-direction: column; gap: 9px; }
        .lk-row {
          display: flex;
          align-items: center;
          gap: 13px;
          padding: 13px 14px;
          border-radius: var(--r-md);
          border: 1px solid var(--border);
          background: var(--bg);
          text-decoration: none;
          transition: transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;
        }
        .lk-row:hover {
          transform: translateY(-1px);
          border-color: oklch(80% 0.1 60);
          box-shadow: var(--shadow);
        }
        .lk-row-icon {
          width: 42px; height: 42px; flex-shrink: 0;
          border-radius: 12px;
          background: var(--plum-lt);
          color: var(--plum);
          display: flex; align-items: center; justify-content: center;
        }
        .lk-row-icon svg { width: 21px; height: 21px; }
        .lk-row-copy { flex: 1; min-width: 0; }
        .lk-row-label {
          display: block;
          font-weight: 700;
          font-size: 0.98rem;
          color: var(--plum);
          font-family: var(--font-head);
          line-height: 1.2;
        }
        .lk-row-hint {
          display: block;
          margin-top: 2px;
          font-size: 0.78rem;
          color: var(--text-soft);
          line-height: 1.35;
        }
        .lk-arrow { width: 19px; height: 19px; color: var(--text-soft); flex-shrink: 0; }

        .lk-row.soon {
          border-style: dashed;
          opacity: 0.72;
          cursor: default;
        }
        .lk-row.soon .lk-row-icon { background: var(--surface2); color: var(--text-soft); }
        .lk-soon-badge {
          flex-shrink: 0;
          padding: 4px 9px;
          border-radius: 100px;
          background: var(--caramel-lt);
          color: oklch(42% 0.12 52);
          font-size: 0.6rem;
          font-weight: 800;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        /* Socials + contact */
        .lk-socials { padding: 22px 18px; text-align: center; }
        .lk-social-row { display: flex; justify-content: center; gap: 12px; }
        .lk-social {
          width: 52px; height: 52px;
          border-radius: 16px;
          border: 1px solid var(--border);
          background: var(--bg);
          color: var(--plum);
          display: inline-flex; align-items: center; justify-content: center;
          text-decoration: none;
          transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease, color 0.2s ease;
        }
        .lk-social:hover {
          transform: translateY(-2px);
          border-color: var(--caramel);
        }
        .lk-social svg { width: 22px; height: 22px; }
        .lk-social.soon {
          border-style: dashed;
          color: var(--text-soft);
          opacity: 0.6;
          cursor: default;
        }
        .lk-divider {
          width: min(160px, 60%);
          height: 1px;
          background: var(--border);
          margin: 20px auto 16px;
        }
        .lk-contact {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 11px 20px;
          border-radius: 14px;
          border: 1px solid var(--border);
          background: var(--bg);
          color: var(--plum);
          font-weight: 700;
          font-size: 0.95rem;
          text-decoration: none;
          transition: transform 0.2s ease, border-color 0.2s ease;
        }
        .lk-contact:hover { transform: translateY(-2px); border-color: var(--caramel); }
        .lk-contact svg { width: 19px; height: 19px; }

        .lk-footer {
          text-align: center;
          padding: 6px 8px 4px;
          color: var(--text-soft);
          font-size: 0.75rem;
          line-height: 1.7;
          display: flex;
          flex-direction: column;
        }
        .lk-footer strong { color: var(--plum); font-weight: 700; }

        /* Reveal on load */
        .lk-reveal {
          opacity: 0;
          transform: translateY(14px);
          animation: lk-in 0.55s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
          animation-delay: var(--d, 0ms);
        }
        @keyframes lk-in {
          to { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .lk-reveal { opacity: 1; transform: none; animation: none; }
          .lk-dot { animation: none; }
        }

        /* Wider screens: keep it a centred phone-width column */
        @media (min-width: 600px) {
          .lk-page { padding-top: 32px; padding-bottom: 56px; }
        }
      `}</style>
    </main>
  );
}
