"use client";

import { TEAM } from "@/components/about/aboutContent";
import ImpactWord, { renderWithFund } from "@/components/about/ImpactWord";
import StoryTimeline from "@/components/about/StoryTimeline";
import YouthPartnerCarousel from "@/components/about/YouthPartnerCarousel";
import { IconArrow, IconShop } from "@/components/icons";
import { PledgeHeart } from "@/components/ImpactPledge";
import { GENERAL_EMAIL, mailtoHref } from "@/lib/config/site-info";
import type { InitiativeDetail, PartnerCarouselItem } from "@/lib/public/initiatives";
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
          {bg
            ? "Младежите зад барчето с кауза"
            : "The young people behind the bar with a cause"}
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
    <section className="section-spacing" style={{ background: "var(--surface)" }}>
      <div className="section-inner">
        <header style={{ textAlign: "center", marginBottom: "clamp(32px, 5vw, 56px)" }}>
          <div className="section-divider" />
          <div className="label-tag" style={{ marginBottom: 14 }}>
            {bg ? "Екипът" : "The team"}
          </div>
          <h2 className="heading-lg" style={{ margin: "0 auto", maxWidth: 720 }}>
            {bg ? "Хората зад ТЕПЕ bite" : "The people behind ТЕПЕ bite"}
          </h2>
          <p style={{ maxWidth: 600, margin: "16px auto 0" }}>
            {bg
              ? "Ученици, които решиха да построят истинска компания, докато са още в училище. Като подкрепяш ТЕПЕ bite, подкрепяш нас."
              : "High-school students who decided to build a real company while still at school. When you support ТЕПЕ bite, you support us."}
          </p>
        </header>

        <div className="team-grid">
          {TEAM.map((m) => (
            <article
              key={m.email}
              className="card"
              style={{ padding: 24, display: "flex", flexDirection: "column", gap: 14 }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <span
                  style={{
                    position: "relative",
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    overflow: "hidden",
                    flexShrink: 0,
                    background: "var(--plum-lt)",
                  }}
                >
                  <Image src={m.photo} alt={m.name} fill sizes="60px" style={{ objectFit: "cover" }} />
                </span>
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontFamily: "var(--font-head)",
                      fontWeight: 700,
                      fontSize: "1.1rem",
                      color: "var(--plum)",
                    }}
                  >
                    {m.name}
                  </div>
                  <div
                    style={{
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                      color: "var(--caramel)",
                    }}
                  >
                    {bg ? m.titleBg : m.titleEn}
                  </div>
                </div>
              </div>

              <p style={{ margin: 0, fontSize: "0.9rem", lineHeight: 1.65, flex: 1 }}>
                {bg ? m.motivationBg : m.motivationEn}
              </p>

              <a
                href={`mailto:${m.email}`}
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: "var(--plum-mid)",
                  textDecoration: "none",
                  wordBreak: "break-all",
                }}
              >
                {m.email}
              </a>
            </article>
          ))}
        </div>
      </div>

      <style>{`
        .team-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 24px;
        }
      `}</style>
    </section>
  );
}

/* ── Fantastico gratitude ──────────────────────────────────────────────────── */
function GratitudeSection({ lang }: { lang: "bg" | "en" }) {
  const bg = lang === "bg";
  return (
    <section style={{ background: "var(--plum)", position: "relative", overflow: "hidden" }}>
      <div
        className="section-spacing section-inner grat-grid"
        style={{ position: "relative", zIndex: 1 }}
      >
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

        <div>
          <div className="label-tag" style={{ color: "oklch(93% 0.06 70)", marginBottom: 14 }}>
            {bg ? "Заедно с Fantastico" : "Together with Fantastico"}
          </div>
          <h2 className="heading-lg" style={{ color: "white", margin: 0 }}>
            {bg ? "Благодарим на Fantastico" : "Thank you, Fantastico"}
          </h2>
          <p style={{ color: "oklch(88% 0.03 310)", marginTop: 16, maxWidth: 540 }}>
            {bg
              ? "Една от най-големите търговски вериги в България реши да застане зад ученически екип. Fantastico ни подкрепят с маркетинг, дизайн материали и съдействие за продажби в обектите си в Пловдив, а с дарение помогнаха да произведем първата си пълномащабна партида."
              : "One of Bulgaria's largest retail chains chose to stand behind a student team. Fantastico support us with marketing, design materials and help selling across their Plovdiv locations, and their donation helped us produce our first full-scale batch."}
          </p>
          <p style={{ color: "oklch(88% 0.03 310)", marginTop: 14, maxWidth: 540 }}>
            {bg
              ? "Гордеем се с това партньорство и сме искрено благодарни за доверието."
              : "We're proud of this partnership and sincerely grateful for the trust."}
          </p>

          <div
            style={{
              marginTop: 26,
              display: "inline-flex",
              alignItems: "center",
              gap: 14,
              background: "white",
              borderRadius: 100,
              padding: "12px 22px",
            }}
          >
            <Image
              src="/partners/FantasticoGroupLongLogo.png"
              alt="Fantastico Group"
              width={261}
              height={121}
              style={{ height: 30, width: "auto", display: "block" }}
            />
          </div>
        </div>
      </div>

      <style>{`
        .grat-grid {
          display: grid;
          grid-template-columns: 46% 1fr;
          gap: clamp(28px, 4vw, 56px);
          align-items: center;
        }
        .grat-photo { aspect-ratio: 3 / 2; }
        @media (max-width: 900px) {
          .grat-grid { grid-template-columns: 1fr; }
          .grat-photo { aspect-ratio: 3 / 2; }
        }
      `}</style>
    </section>
  );
}

/* ── Youth power + impact model + youth partner carousel ───────────────────── */
function YouthPowerSection({
  lang,
  youthPartners,
}: {
  lang: "bg" | "en";
  youthPartners: PartnerCarouselItem[];
}) {
  const bg = lang === "bg";

  const model: [string, string][] = bg
    ? [
        ["Събираме", "Фиксираните 0.15 € от всяко барче влизат във фонда."],
        ["Обединяваме", "Каним младежки организации да съорганизират инициативата."],
        ["Реализираме", "Заедно превръщаме средствата във видима промяна за Пловдив."],
        ["„Бях част от това“", "Инициатива, която хората разпознават като своя."],
      ]
    : [
        ["We collect", "The fixed 0.15 € from every bar goes into the fund."],
        ["We unite", "We invite youth-led organisations to co-run the initiative."],
        ["We deliver", "Together we turn the money into visible change for Plovdiv."],
        ['"I was part of it"', "An initiative people recognise as their own."],
      ];

  return (
    <section className="section-spacing" style={{ background: "var(--bg)" }}>
      <div className="section-inner">
        <header style={{ textAlign: "center", marginBottom: "clamp(32px, 5vw, 52px)" }}>
          <div className="section-divider" />
          <div className="label-tag" style={{ marginBottom: 14 }}>
            {bg ? "Силата на младите" : "Youth power"}
          </div>
          <h2 className="heading-lg" style={{ margin: "0 auto", maxWidth: 760 }}>
            {bg ? "Младите движат Пловдив" : "The young move Plovdiv"}
          </h2>
          <p style={{ maxWidth: 640, margin: "16px auto 0" }}>
            {bg
              ? "Ние сме тийнейджъри, на които се падна шансът да строят бизнес на тази възраст. Вярваме в силата на младите — затова обичаме да работим с младежки организации. Като подкрепяш нас, подкрепяш и тях, и младежкото действие в Пловдив."
              : "We're teenagers who got the chance to build a business at this age. We believe in the strength of the young — that's why we love working with youth-led organisations. When you support us, you support them too, and youth action in Plovdiv."}
          </p>
        </header>

        {/* impact model row */}
        <div
          className="card"
          style={{
            padding: "clamp(24px, 4vw, 40px)",
            marginBottom: "clamp(36px, 5vw, 56px)",
            display: "flex",
            flexDirection: "column",
            gap: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              justifyContent: "center",
              flexWrap: "wrap",
              textAlign: "center",
            }}
          >
            <PledgeHeart size={52} />
            <p style={{ margin: 0, maxWidth: 560, fontSize: "1rem" }}>
              {bg ? (
                <>
                  Като инициативно ориентиран бранд, всяко барче добавя{" "}
                  <strong style={{ color: "var(--plum)" }}>0.15 €</strong> към фонд{" "}
                  <ImpactWord /> — инструментът, с който правим видими инициативи за града.
                </>
              ) : (
                <>
                  As an initiative-driven brand, every bar adds{" "}
                  <strong style={{ color: "var(--plum)" }}>0.15 €</strong> to the{" "}
                  <ImpactWord /> fund — the tool we use to make visible initiatives for the city.
                </>
              )}
            </p>
          </div>

          <div className="model-grid">
            {model.map(([step, desc], i) => (
              <div key={step} style={{ position: "relative" }}>
                <div
                  style={{
                    fontFamily: "var(--font-head)",
                    fontWeight: 800,
                    fontSize: "0.9rem",
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
                    fontSize: "0.98rem",
                    marginBottom: 4,
                  }}
                >
                  {step}
                </div>
                <p style={{ margin: 0, fontSize: "0.86rem", lineHeight: 1.55 }}>{desc}</p>
              </div>
            ))}
          </div>

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
              alignSelf: "center",
            }}
          >
            {bg ? "Виж целия модел на въздействие" : "See the full impact model"} →
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
        .model-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 24px;
          border-top: 1px solid var(--border);
          padding-top: 24px;
        }
        @media (max-width: 760px) {
          .model-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 440px) {
          .model-grid { grid-template-columns: 1fr; }
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
    <section className="section-spacing" style={{ background: "var(--surface)" }}>
      <div className="section-inner">
        <header style={{ textAlign: "center", marginBottom: "clamp(32px, 5vw, 52px)" }}>
          <div className="section-divider" />
          <div className="label-tag" style={{ marginBottom: 14 }}>
            {bg ? "Защо вярваме в това" : "Why we believe in this"}
          </div>
          <h2 className="heading-lg" style={{ margin: "0 auto", maxWidth: 720 }}>
            {bg ? "Три причини, една посока" : "Three reasons, one direction"}
          </h2>
          <p style={{ maxWidth: 620, margin: "16px auto 0" }}>
            {bg
              ? "Напълно прозрачно: ето защо вярваме в ТЕПЕ bite. Трите ни силни страни се събират в едно — кауза, хора и продукт, които се крепят взаимно."
              : "In full transparency: here's why we believe in ТЕПЕ bite. Our three strengths meet in one place — a cause, people and a product that hold each other up."}
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
            ? "Заедно това е повече от добра кауза — това е и стабилен бизнес казус: продукт, който хората купуват отново, кауза, която ги връща, и екип, който расте."
            : "Together this is more than a good cause — it's a sound business case too: a product people buy again, a cause that brings them back, and a team that keeps growing."}
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
        ? "Маркетинг, дизайн материали, съдействие за продажби в Пловдив и дарение за първата ни партида."
        : "Marketing, design materials, retail support in Plovdiv and a donation toward our first batch.",
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
        <header style={{ textAlign: "center", marginBottom: "clamp(32px, 5vw, 48px)" }}>
          <div className="section-divider" />
          <div className="label-tag" style={{ marginBottom: 14 }}>
            {bg ? "Партньори на бизнеса" : "Business partners"}
          </div>
          <h2 className="heading-lg" style={{ margin: "0 auto", maxWidth: 720 }}>
            {bg ? "Компаниите зад бизнеса" : "The companies behind the business"}
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
                  height: 56,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Image
                  src={p.logo}
                  alt={p.name}
                  width={p.w}
                  height={p.h}
                  style={{ height: "auto", maxHeight: 46, width: "auto", maxWidth: "70%", display: "block" }}
                />
              </div>
              <p style={{ margin: 0, fontSize: "0.92rem", lineHeight: 1.65, flex: 1 }}>{p.body}</p>
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
    <section className="section-spacing" style={{ background: "var(--surface2)" }}>
      <div
        className="section-inner"
        style={{ maxWidth: 760, textAlign: "center" }}
      >
        <div className="section-divider" />
        <div className="label-tag" style={{ marginBottom: 14 }}>
          {bg ? "Отворени сме" : "We're open"}
        </div>
        <h2 className="heading-lg" style={{ margin: "0 auto", maxWidth: 640 }}>
          {bg ? "Искаш да си част от историята?" : "Want to be part of the story?"}
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
