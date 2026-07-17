"use client";

import { TEAM } from "@/components/about/aboutContent";
import ImpactWord, { renderWithFund } from "@/components/about/ImpactWord";
import StoryTimeline from "@/components/about/StoryTimeline";
import YouthPartnerCarousel from "@/components/about/YouthPartnerCarousel";
import { IconArrow, IconShop } from "@/components/icons";
import { PledgeHeart } from "@/components/ImpactPledge";
import { GENERAL_EMAIL, mailtoHref } from "@/lib/config/site-info";
import type {
  InitiativeDetail,
  PartnerCarouselItem,
} from "@/lib/public/initiatives";
import { langAtom } from "@/store/lang";
import { useAtomValue } from "jotai";
import Image from "next/image";
import Link from "next/link";

export default function AboutPageContent({
  reconnect,
  youthPartners,
}: {
  reconnect: InitiativeDetail | null;
  youthPartners: PartnerCarouselItem[];
}) {
  const lang = useAtomValue(langAtom);

  return (
    <>
      <Hero lang={lang} />
      <StoryTimeline lang={lang} reconnect={reconnect} />
      <TeamSection lang={lang} />
      <GratitudeSection lang={lang} />
      <YouthPowerSection lang={lang} youthPartners={youthPartners} />
      <BusinessCaseSection lang={lang} />
      <BusinessPartnersSection lang={lang} />
      <SupportSection lang={lang} />
    </>
  );
}

/* ── Hero ──────────────────────────────────────────────────────────────────── */
function Hero({ lang }: { lang: "bg" | "en" }) {
  const bg = lang === "bg";
  return (
    <section
      style={{
        position: "relative",
        minHeight: "clamp(520px, 82vh, 760px)",
        display: "flex",
        alignItems: "flex-end",
        overflow: "hidden",
      }}
    >
      <Image
        src="/photos/team.jpg"
        alt={bg ? "Екипът на ТЕПЕ bite" : "The ТЕПЕ bite team"}
        fill
        priority
        sizes="100vw"
        style={{ objectFit: "cover", objectPosition: "center 30%" }}
      />
      {/* plum scrim: darker top + bottom for legibility */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, oklch(20% 0.06 315 / 0.62) 0%, oklch(22% 0.06 315 / 0.2) 42%, oklch(18% 0.06 315 / 0.78) 100%)",
        }}
      />
      <div
        className="section-inner"
        style={{
          position: "relative",
          width: "100%",
          padding: "0 clamp(20px, 5vw, 80px) clamp(48px, 7vw, 96px)",
        }}
      >
        <div
          className="label-tag"
          style={{ color: "oklch(93% 0.06 70)", marginBottom: 16 }}
        >
          {bg ? "За нас" : "About us"}
        </div>
        <h1
          className="heading-xl"
          style={{ color: "white", maxWidth: 820, marginBottom: 18 }}
        >
          {bg ? (
            <>
              <span>Младежите зад </span>
              <span
                style={{
                  // fontFamily: "var(--font-brush)",
                  fontWeight: 1600,
                  color: "var(--caramel)",
                  lineHeight: 0.9,
                  borderBottom: "4px solid var(--caramel)",
                }}
              >
                барчето с кауза
              </span>
            </>
          ) : (
            "The young people behind the bar with a cause"
          )}
        </h1>
        <p
          style={{
            color: "oklch(92% 0.02 300)",
            fontSize: "clamp(1.05rem, 1.8vw, 1.3rem)",
            maxWidth: 620,
            lineHeight: 1.6,
          }}
        >
          {bg
            ? "Историята на един бранд — от Пловдивчани, за Пловдив."
            : "The story of a brand — by people from Plovdiv, for Plovdiv."}
        </p>
      </div>
    </section>
  );
}

/* ── Team ──────────────────────────────────────────────────────────────────── */
function TeamSection({ lang }: { lang: "bg" | "en" }) {
  const bg = lang === "bg";
  return (
    <section
      className="section-spacing"
      style={{
        background: "var(--surface)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        className="section-inner"
        style={{ position: "relative", zIndex: 1 }}
      >
        <header
          style={{
            textAlign: "center",
            marginBottom: "clamp(36px, 5vw, 64px)",
          }}
        >
          <div className="section-divider" />
          <div className="label-tag" style={{ marginBottom: 14 }}>
            {bg ? "Екипът" : "The team"}
          </div>
          <h2
            className="heading-lg"
            style={{ margin: "0 auto", maxWidth: 720 }}
          >
            {bg
              ? "Младежите зад ТЕПЕ bite"
              : "The young people behind ТЕПЕ bite"}
          </h2>
          <p style={{ maxWidth: 600, margin: "16px auto 0" }}>
            {bg
              ? "Ученици, които решиха да построят истинска компания, докато са още в училище. Като подкрепяш ТЕПЕ bite, подкрепяш нас."
              : "High-school students who decided to build a real company while still at school. When you support ТЕПЕ bite, you support us."}
          </p>
        </header>

        <div>
          {TEAM.map((m, i) => {
            const right = i % 2 === 1;
            return (
              <article
                key={m.email}
                className={`team-row ${right ? "team-row--right" : ""}`}
              >
                <span className="team-bg-num" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="team-photo">
                  <Image
                    src={m.photo}
                    alt={m.name}
                    fill
                    sizes="(max-width: 760px) 60vw, 240px"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="team-text">
                  <div
                    style={{
                      fontSize: "0.74rem",
                      fontWeight: 600,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "var(--caramel)",
                      marginBottom: 6,
                    }}
                  >
                    {bg ? m.titleBg : m.titleEn}
                  </div>
                  <h3
                    style={{
                      fontFamily: "var(--font-head)",
                      fontWeight: 700,
                      fontSize: "clamp(1.4rem, 2.4vw, 1.9rem)",
                      color: "var(--plum)",
                      margin: 0,
                      lineHeight: 1.15,
                    }}
                  >
                    {m.name}
                  </h3>
                  <p
                    style={{
                      margin: "12px 0 0",
                      maxWidth: 520,
                      lineHeight: 1.65,
                    }}
                  >
                    {bg ? m.motivationBg : m.motivationEn}
                  </p>
                  <a
                    href={`mailto:${m.email}`}
                    className="team-email"
                    style={{
                      display: "inline-block",
                      marginTop: 14,
                      fontSize: "0.86rem",
                      fontWeight: 600,
                      color: "var(--plum-mid)",
                      textDecoration: "none",
                    }}
                  >
                    {m.email}
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <style>{`
        .team-row {
          position: relative;
          display: flex;
          align-items: center;
          gap: clamp(24px, 4vw, 60px);
          padding: clamp(28px, 3.5vw, 48px) 0;
        }
        .team-row + .team-row { border-top: 1px solid var(--border); }
        .team-row--right { flex-direction: row-reverse; text-align: right; }
        .team-row--right .team-text { align-items: flex-end; display: flex; flex-direction: column; }
        .team-photo {
          position: relative;
          width: clamp(150px, 22vw, 240px);
          aspect-ratio: 1 / 1;
          border-radius: var(--r-lg);
          overflow: hidden;
          flex-shrink: 0;
          background: var(--plum-lt);
          box-shadow: var(--shadow);
          z-index: 1;
        }
        .team-text { flex: 1; min-width: 0; position: relative; z-index: 1; }
        .team-bg-num {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          font-family: var(--font-head);
          font-weight: 900;
          font-size: clamp(120px, 18vw, 230px);
          line-height: 1;
          color: var(--plum);
          opacity: 0.04;
          z-index: 0;
          pointer-events: none;
          user-select: none;
        }
        .team-row--left .team-bg-num, .team-row:not(.team-row--right) .team-bg-num { right: 4%; }
        .team-row--right .team-bg-num { left: 4%; }
        .team-email:hover { color: var(--caramel); }
        @media (max-width: 760px) {
          .team-row, .team-row--right {
            flex-direction: column;
            align-items: flex-start;
            text-align: left;
            gap: 18px;
          }
          .team-row--right .team-text { align-items: flex-start; }
          .team-bg-num { display: none; }
        }
      `}</style>
    </section>
  );
}

/* ── Fantastico gratitude ──────────────────────────────────────────────────── */
function GratitudeSection({ lang }: { lang: "bg" | "en" }) {
  const bg = lang === "bg";

  const support: {
    icon: keyof typeof SUPPORT_ICONS;
    label: string;
    desc: string;
    hero?: boolean;
  }[] = bg
    ? [
        {
          icon: "megaphone",
          label: "Маркетинг",
          desc: "Съвместни кампании и видимост пред клиентите им.",
        },
        {
          icon: "design",
          label: "Дизайн материали",
          desc: "Професионални материали за опаковка и реклама.",
        },
        {
          icon: "shop",
          label: "Продажби в Пловдив",
          desc: "Барчето по рафтовете в обектите им в Пловдив.",
        },
        {
          icon: "gift",
          label: "Дарение 4000 €",
          desc: "За първата ни пълномащабна производствена партида.",
          hero: true,
        },
      ]
    : [
        {
          icon: "megaphone",
          label: "Marketing",
          desc: "Joint campaigns and visibility in front of their customers.",
        },
        {
          icon: "design",
          label: "Design materials",
          desc: "Professional materials for packaging and promotion.",
        },
        {
          icon: "shop",
          label: "Retail in Plovdiv",
          desc: "The bar on the shelves across their Plovdiv stores.",
        },
        {
          icon: "gift",
          label: "€4,000 donation",
          desc: "Toward our first full-scale production batch.",
          hero: true,
        },
      ];

  return (
    <section
      style={{
        background: "var(--plum)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        className="hero-blob"
        style={{
          background: "var(--caramel)",
          width: 420,
          height: 420,
          top: -160,
          right: -120,
          opacity: 0.16,
        }}
      />
      <div
        className="section-spacing section-inner"
        style={{ position: "relative", zIndex: 1 }}
      >
        <header
          style={{ maxWidth: 720, marginBottom: "clamp(32px, 4vw, 52px)" }}
        >
          <div
            className="label-tag"
            style={{ color: "oklch(93% 0.06 70)", marginBottom: 14 }}
          >
            {bg ? "Заедно с Fantastico" : "Together with Fantastico"}
          </div>
          <h2 className="heading-lg" style={{ color: "white", margin: 0 }}>
            {bg
              ? "Гордо казваме: благодарим, Fantastico"
              : "We proudly say: thank you, Fantastico"}
          </h2>
          <p style={{ color: "oklch(88% 0.03 310)", marginTop: 16 }}>
            {bg
              ? "Една от най-големите търговски вериги в България реши да застане зад ученически екип. Ето какво означава тази подкрепа на практика."
              : "One of Bulgaria's largest retail chains chose to stand behind a student team. Here's what that support means in practice."}
          </p>
        </header>

        <div className="grat-grid">
          <div className="grat-photo">
            <Image
              src="/photos/FantastikoWithOurTeam.jpg"
              alt={bg ? "Екипът ни с Fantastico" : "Our team with Fantastico"}
              width={1364}
              height={908}
              sizes="(max-width: 900px) 100vw, 46vw"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "var(--r-lg)",
                display: "block",
              }}
            />
          </div>

          <div className="grat-support">
            {support.map((s) => (
              <div
                key={s.label}
                className="grat-tile"
                style={{
                  background: s.hero
                    ? "var(--caramel)"
                    : "oklch(100% 0 0 / 0.06)",
                  border: s.hero ? "none" : "1px solid oklch(100% 0 0 / 0.12)",
                }}
              >
                <span
                  className="grat-ico"
                  style={{
                    background: s.hero
                      ? "oklch(100% 0 0 / 0.22)"
                      : "oklch(100% 0 0 / 0.1)",
                    color: "white",
                  }}
                >
                  {SUPPORT_ICONS[s.icon]}
                </span>
                <div
                  style={{
                    fontFamily: "var(--font-head)",
                    fontWeight: 700,
                    fontSize: "1.02rem",
                    color: "white",
                    marginTop: 12,
                  }}
                >
                  {s.label}
                </div>
                <p
                  style={{
                    margin: "6px 0 0",
                    fontSize: "0.86rem",
                    lineHeight: 1.5,
                    color: s.hero
                      ? "oklch(100% 0 0 / 0.9)"
                      : "oklch(84% 0.03 310)",
                  }}
                >
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="grat-foot">
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 14,
              background: "white",
              borderRadius: 100,
              padding: "12px 24px",
            }}
          >
            <Image
              src="/partners/FantasticoGroupLongLogo.png"
              alt="Fantastico Group"
              width={261}
              height={121}
              style={{ height: 34, width: "auto", display: "block" }}
            />
          </div>
          <p
            style={{
              margin: 0,
              color: "oklch(88% 0.03 310)",
              maxWidth: 460,
              fontSize: "0.95rem",
            }}
          >
            {bg
              ? "Гордеем се с това партньорство и сме искрено благодарни за доверието."
              : "We're proud of this partnership and sincerely grateful for the trust."}
          </p>
        </div>
      </div>

      <style>{`
        .grat-grid {
          display: grid;
          grid-template-columns: 44% 1fr;
          gap: clamp(24px, 3.5vw, 48px);
          align-items: stretch;
        }
        .grat-photo { aspect-ratio: 3 / 2; }
        .grat-support {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
        }
        .grat-tile {
          border-radius: var(--r-md);
          padding: clamp(18px, 2vw, 24px);
          transition: transform 0.2s ease;
        }
        .grat-tile:hover { transform: translateY(-3px); }
        .grat-ico {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .grat-foot {
          display: flex;
          align-items: center;
          gap: clamp(18px, 3vw, 32px);
          flex-wrap: wrap;
          margin-top: clamp(28px, 3.5vw, 44px);
        }
        @media (max-width: 900px) {
          .grat-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 460px) {
          .grat-support { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  );
}

/* Small line icons for the Fantastico support tiles (match the icon system:
   24px viewBox, no fill, currentColor stroke, round caps). */
const SUPPORT_ICONS = {
  megaphone: (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 10v4h3l6 4V6L7 10H4z" />
      <path d="M17 9a4 4 0 0 1 0 6" />
    </svg>
  ),
  design: (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 20l4.5-1L19 8.5 15.5 5 5 15.5 4 20z" />
      <path d="M13.5 6.5l4 4" />
    </svg>
  ),
  shop: (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 9l1.2-4h13.6L20 9" />
      <path d="M5 9v10h14V9" />
      <path d="M4 9a2.4 2.4 0 0 0 4.7 0 2.4 2.4 0 0 0 4.6 0 2.4 2.4 0 0 0 4.7 0" />
    </svg>
  ),
  gift: (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 11h16v9H4z" />
      <path d="M3 8h18v3H3z" />
      <path d="M12 8v12" />
      <path d="M12 8S9.5 8 8.6 6.6C8 5.6 8.7 4 10 4c1.6 0 2 4 2 4z" />
      <path d="M12 8s2.5 0 3.4-1.4c.6-1-.1-2.6-1.4-2.6-1.6 0-2 4-2 4z" />
    </svg>
  ),
};

/* ── Youth power + impact model + youth partner carousel ───────────────────── */
function YouthPowerSection({
  lang,
  youthPartners,
}: {
  lang: "bg" | "en";
  youthPartners: PartnerCarouselItem[];
}) {
  const bg = lang === "bg";

  const benefits: [string, string][] = bg
    ? [
        [
          "Реални инициативи",
          "Работят по истински инициативи на терен, а не на хартия.",
        ],
        ["Досег до партньори", "Срещат потенциални партньори през нашите."],
        ["Видимост", "Печелят видимост в социалните мрежи чрез дейността си."],
      ]
    : [
        [
          "Real initiatives",
          "They work on real initiatives on the ground, not on paper.",
        ],
        ["Reach to partners", "They meet potential partners through ours."],
        [
          "Visibility",
          "They gain social-media visibility through their activity.",
        ],
      ];

  return (
    <section className="section-spacing" style={{ background: "var(--bg)" }}>
      <div className="section-inner">
        <header
          style={{
            textAlign: "center",
            marginBottom: "clamp(32px, 5vw, 52px)",
          }}
        >
          <div className="section-divider" />
          <div className="label-tag" style={{ marginBottom: 14 }}>
            {bg ? "Силата на младите" : "Youth power"}
          </div>
          <h2
            className="heading-lg"
            style={{ margin: "0 auto", maxWidth: 760 }}
          >
            {bg ? "Младите движат Пловдив" : "The young move Plovdiv"}
          </h2>
          <p style={{ maxWidth: 640, margin: "16px auto 0" }}>
            {bg
              ? "Ние сме тийнейджъри, които градят истински бизнес. Вярваме в силата на младите — затова партнираме с младежки организации. Когато подкрепиш нас, подкрепяш и тях."
              : "We're teenagers building a real business. We believe in the strength of the young — so we partner with youth-led organisations. When you support us, you support them too."}
          </p>
        </header>

        {/* how we multiply the pledge through youth partners */}
        <div
          className="card"
          style={{
            padding: "clamp(24px, 4vw, 44px)",
            marginBottom: "clamp(36px, 5vw, 56px)",
            display: "flex",
            flexDirection: "column",
            gap: "clamp(24px, 3vw, 32px)",
          }}
        >
          <div className="yp-lead">
            <PledgeHeart size={56} />
            <p style={{ margin: 0, fontSize: "1.05rem", lineHeight: 1.6 }}>
              {bg ? (
                <>
                  Всяко барче добавя{" "}
                  <strong style={{ color: "var(--plum)" }}>0.15 €</strong> към
                  фонд <ImpactWord />.{" "}
                  <strong style={{ color: "var(--plum)" }}>Умножаваме</strong>{" "}
                  стойността на тези 0.15 €, като партнираме с младежки
                  организации за всяка инициатива.
                </>
              ) : (
                <>
                  Every bar adds{" "}
                  <strong style={{ color: "var(--plum)" }}>0.15 €</strong> to
                  the <ImpactWord /> fund. We{" "}
                  <strong style={{ color: "var(--plum)" }}>multiply</strong> the
                  value of those 0.15 € by partnering with youth-led
                  organisations on every initiative.
                </>
              )}
            </p>
          </div>

          <div>
            <div className="label-tag" style={{ marginBottom: 16 }}>
              {bg ? "Какво получават те" : "What they gain"}
            </div>
            <div className="yp-benefits">
              {benefits.map(([title, desc], i) => (
                <div
                  key={title}
                  style={{
                    borderLeft: "3px solid var(--caramel)",
                    paddingLeft: 16,
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-head)",
                      fontWeight: 800,
                      fontSize: "0.82rem",
                      color: "var(--caramel)",
                      marginBottom: 6,
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div
                    style={{
                      fontWeight: 700,
                      color: "var(--plum)",
                      fontSize: "1rem",
                      marginBottom: 4,
                    }}
                  >
                    {title}
                  </div>
                  <p
                    style={{ margin: 0, fontSize: "0.88rem", lineHeight: 1.55 }}
                  >
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <p
            style={{
              margin: 0,
              paddingTop: "clamp(20px, 2.5vw, 28px)",
              borderTop: "1px solid var(--border)",
              fontSize: "1.02rem",
              color: "var(--text-mid)",
            }}
          >
            {bg
              ? "Подкрепяме младите — точно както ти подкрепяш нас, младите, купувайки барче."
              : "We support the young — just as you support us, the young, by buying a bar."}
          </p>

          <Link
            href="/impact"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              color: "var(--caramel)",
              fontWeight: 600,
              fontSize: "0.9rem",
              textDecoration: "none",
            }}
          >
            {bg
              ? "Виж целия модел на въздействие"
              : "See the full impact model"}{" "}
            →
          </Link>
        </div>

        {/* youth partner carousel */}
        {youthPartners.length > 0 ? (
          <>
            <h3
              className="heading-md"
              style={{ textAlign: "center", marginBottom: 24 }}
            >
              {bg ? "Нашите младежки партньори" : "Our youth-led partners"}
            </h3>
            <YouthPartnerCarousel items={youthPartners} lang={lang} />
          </>
        ) : (
          <p
            style={{
              textAlign: "center",
              color: "var(--text-soft)",
              fontSize: "0.95rem",
            }}
          >
            {bg
              ? "Скоро тук ще представим младежките организации, с които работим."
              : "We'll introduce the youth-led organisations we work with here soon."}
          </p>
        )}
      </div>

      <style>{`
        .yp-lead {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        .yp-benefits {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: clamp(20px, 3vw, 32px);
        }
        @media (max-width: 680px) {
          .yp-lead { flex-direction: column; text-align: center; gap: 14px; }
          .yp-benefits { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  );
}

/* ── Business case (three selling points) ──────────────────────────────────── */
function BusinessCaseSection({ lang }: { lang: "bg" | "en" }) {
  const bg = lang === "bg";

  const points = bg
    ? [
        {
          tag: "Кауза",
          title: "Инициативно ориентиран бранд",
          body: "От всяко барче 0.15 € отиват във фонд ТЕПЕ bite Impact и се превръщат във видими инициативи заедно с младежки партньори.",
        },
        {
          tag: "Хора",
          title: "Млад екип, истински бизнес",
          body: "Ученици, които изграждат реална компания — с продажби, партньори и отговорности, а не проект на хартия.",
        },
        {
          tag: "Продукт",
          title: "Качествено и здравословно барче",
          body: "Солен карамел, 40 g: ниски нетни въглехидрати, фибри и растителен протеин, без добавена захар — произведено в Пловдивско от BioStyle.",
        },
      ]
    : [
        {
          tag: "Cause",
          title: "An initiative-driven brand",
          body: "From every bar, 0.15 € goes to the ТЕПЕ bite Impact fund and turns into visible initiatives with youth-led partners.",
        },
        {
          tag: "People",
          title: "A young team, a real business",
          body: "Students building an actual company — with sales, partners and responsibilities, not a project on paper.",
        },
        {
          tag: "Product",
          title: "A quality, better-for-you bar",
          body: "Salted caramel, 40 g: low net carbs, fibre and plant protein, no added sugar — made near Plovdiv by BioStyle.",
        },
      ];

  return (
    <section
      className="section-spacing"
      style={{ background: "var(--surface)" }}
    >
      <div className="section-inner">
        <header
          style={{
            textAlign: "center",
            marginBottom: "clamp(32px, 5vw, 52px)",
          }}
        >
          <div className="section-divider" />
          <div className="label-tag" style={{ marginBottom: 14 }}>
            {bg ? "Защо вярваме в това" : "Why we believe in this"}
          </div>
          <h2
            className="heading-lg"
            style={{ margin: "0 auto", maxWidth: 720 }}
          >
            {bg
              ? "Три причини, един силен бизнес"
              : "Three reasons, one strong business"}
          </h2>
          <p style={{ maxWidth: 620, margin: "16px auto 0" }}>
            {bg
              ? "Напълно прозрачни сме защо вярваме в ТЕПЕ bite. Кауза, хора и продукт — трите заедно правят не просто добра идея, а убедителен бизнес."
              : "We're fully transparent about why we believe in ТЕПЕ bite. A cause, a team and a product — together the three make not just a good idea, but a compelling business."}
          </p>
        </header>

        <div className="bc-grid">
          {points.map((p, i) => (
            <article
              key={p.title}
              className="card"
              style={{
                padding: 28,
                display: "flex",
                flexDirection: "column",
                gap: 12,
                boxShadow: "inset 0 4px 0 var(--caramel), var(--shadow)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span
                  style={{
                    fontFamily: "var(--font-head)",
                    fontWeight: 800,
                    fontSize: "1.4rem",
                    color: "var(--caramel)",
                  }}
                >
                  {i + 1}
                </span>
                <span className="label-tag">{p.tag}</span>
              </div>
              <h3 className="heading-md" style={{ margin: 0 }}>
                {p.title}
              </h3>
              <p style={{ margin: 0, fontSize: "0.92rem", lineHeight: 1.65 }}>
                {renderWithFund(p.body)}
              </p>
            </article>
          ))}
        </div>

        <p
          style={{
            textAlign: "center",
            maxWidth: 640,
            margin: "clamp(28px, 4vw, 40px) auto 0",
            fontSize: "1.02rem",
            color: "var(--text-mid)",
          }}
        >
          {bg
            ? "Кауза, която връща клиентите. Продукт, който купуват отново. Екип, който расте. Затова вярваме, че ТЕПЕ bite е не само добра кауза, а убедителен бизнес казус."
            : "A cause that brings customers back. A product they buy again. A team that keeps growing. That's why we believe ТЕПЕ bite is not just a good cause, but a compelling business case."}
        </p>
      </div>

      <style>{`
        .bc-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 24px;
        }
        @media (max-width: 860px) {
          .bc-grid { grid-template-columns: 1fr; max-width: 520px; margin: 0 auto; }
        }
      `}</style>
    </section>
  );
}

/* ── Business partners (Fantastico + Superhosting) ─────────────────────────── */
function BusinessPartnersSection({ lang }: { lang: "bg" | "en" }) {
  const bg = lang === "bg";
  const partners = [
    {
      logo: "/partners/FantasticoGroupLongLogo.png",
      w: 261,
      h: 121,
      name: "Fantastico Group",
      href: "https://www.fantastico.bg/",
      body: bg
        ? "Най-големият ни партньор — от маркетинг и продажби до основополагащото дарение за първата партида."
        : "Our biggest backer — from marketing and retail to the founding donation for our first batch.",
    },
    {
      logo: "/partners/SuperhostingLogoFullLong.png",
      w: 1200,
      h: 630,
      name: "SuperHosting.BG",
      href: "https://www.superhosting.bg/",
      body: bg
        ? "Осигуряват хостинга и домейна, на които живее този сайт."
        : "They provide the hosting and the domain this website runs on.",
    },
  ];

  return (
    <section className="section-spacing" style={{ background: "var(--bg)" }}>
      <div className="section-inner">
        <header
          style={{
            textAlign: "center",
            marginBottom: "clamp(32px, 5vw, 48px)",
          }}
        >
          <div className="section-divider" />
          <div className="label-tag" style={{ marginBottom: 14 }}>
            {bg ? "Партньори на бизнеса" : "Business partners"}
          </div>
          <h2
            className="heading-lg"
            style={{ margin: "0 auto", maxWidth: 720 }}
          >
            {bg
              ? "Компании, които подкрепят бизнеса ни"
              : "Companies that support our business"}
          </h2>
          <p style={{ maxWidth: 600, margin: "16px auto 0" }}>
            {bg
              ? "Освен партньорите по инициативите, зад самия бизнес стоят компании, които ни подкрепят да растем."
              : "Beyond our initiative partners, the business itself is backed by companies that help us grow."}
          </p>
        </header>

        <div className="bp-grid">
          {partners.map((p) => (
            <a
              key={p.name}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              className="card card-hover"
              style={{
                padding: "28px 28px 24px",
                display: "flex",
                flexDirection: "column",
                gap: 16,
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <div
                style={{
                  height: 80,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Image
                  src={p.logo}
                  alt={p.name}
                  width={p.w}
                  height={p.h}
                  style={{
                    height: "auto",
                    maxHeight: 64,
                    width: "auto",
                    maxWidth: "80%",
                    display: "block",
                  }}
                />
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.92rem",
                  lineHeight: 1.65,
                  flex: 1,
                }}
              >
                {p.body}
              </p>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  color: "var(--caramel)",
                  fontWeight: 600,
                  fontSize: "0.86rem",
                }}
              >
                {p.name} ↗
              </span>
            </a>
          ))}
        </div>
      </div>

      <style>{`
        .bp-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 24px;
          max-width: 820px;
          margin: 0 auto;
        }
        @media (max-width: 640px) {
          .bp-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  );
}

/* ── Open to support ───────────────────────────────────────────────────────── */
function SupportSection({ lang }: { lang: "bg" | "en" }) {
  const bg = lang === "bg";
  return (
    <section
      className="section-spacing"
      style={{ background: "var(--surface2)" }}
    >
      <div
        className="section-inner"
        style={{ maxWidth: 760, textAlign: "center" }}
      >
        <div className="section-divider" />
        <div className="label-tag" style={{ marginBottom: 14 }}>
          {bg ? "Отворени сме" : "We're open"}
        </div>
        <h2 className="heading-lg" style={{ margin: "0 auto", maxWidth: 640 }}>
          {bg
            ? "Искаш да си част от историята?"
            : "Want to be part of the story?"}
        </h2>
        <p style={{ maxWidth: 560, margin: "16px auto 28px" }}>
          {bg
            ? "Ако искаш да ни помогнеш, да работим заедно или да инвестираш в нас — пиши ни. Отворени сме за всяка форма на подкрепа."
            : "If you'd like to help us, work together or invest in us — write to us. We're open to any form of support."}
        </p>
        <div
          style={{
            display: "flex",
            gap: 14,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <a
            href={mailtoHref(GENERAL_EMAIL, {
              subject: bg ? "Подкрепа за ТЕПЕ bite" : "Support for ТЕПЕ bite",
            })}
            className="btn btn-primary"
          >
            {GENERAL_EMAIL} <IconArrow />
          </a>
          <Link href="/order" className="btn btn-secondary">
            <IconShop />
            {bg ? "Или просто вземи барче" : "Or just grab a bar"}
          </Link>
        </div>
      </div>
    </section>
  );
}
