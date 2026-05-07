'use client';

import { useAtomValue } from 'jotai';
import { langAtom, type Lang } from '@/store/lang';
import { IconArrow, IconCheck, IconShop, IconHeart } from '@/components/icons';

/* ─── Extra icons ────────────────────────────────────────────────────────── */

const IconClock = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);

const IconExternal = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
    <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

const IconMountain = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
  </svg>
);

const IconBrush = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.06 11.9l8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08" />
    <path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1 1 2.26 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z" />
  </svg>
);

const IconUsers = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const IconTarget = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
  </svg>
);

const IconShield = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const IconHandshake = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z" />
  </svg>
);

const IconStar = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
  </svg>
);

/* ─── Hill SVG motif ─────────────────────────────────────────────────────── */

function HillSVG({
  opacity = 0.06,
  fill = 'var(--plum)',
  variant = 1,
}: {
  opacity?: number;
  fill?: string;
  variant?: 1 | 2;
}) {
  const path =
    variant === 1
      ? 'M0 200 L0 140 Q200 60 400 100 Q600 140 800 80 Q1000 20 1200 70 L1200 200 Z'
      : 'M0 200 L0 160 Q200 80 400 120 Q600 160 800 90 Q1000 30 1200 80 L1200 200 Z';
  return (
    <svg
      style={{ position: 'absolute', bottom: 0, left: 0, right: 0, width: '100%', opacity, pointerEvents: 'none' }}
      viewBox="0 0 1200 200"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path d={path} fill={fill} />
    </svg>
  );
}

/* ─── Image placeholder ──────────────────────────────────────────────────── */

function ImgPlaceholder({
  label,
  todoAsset,
  ratio = '4/3',
}: {
  label: string;
  todoAsset: string;
  ratio?: string;
}) {
  return (
    /* TODO: Replace this placeholder with the actual asset: {todoAsset} */
    <div
      data-todo={`Asset needed: ${todoAsset}`}
      style={{
        aspectRatio: ratio,
        background: 'linear-gradient(145deg, var(--plum-lt) 0%, oklch(94% 0.04 52) 100%)',
        borderRadius: 'var(--r-md)',
        border: '2px dashed oklch(80% 0.07 315)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        position: 'relative',
        overflow: 'hidden',
      }}
      role="img"
      aria-label={label}
    >
      {/* Decorative hill silhouette inside placeholder */}
      <svg
        viewBox="0 0 600 180"
        style={{ position: 'absolute', bottom: 0, width: '100%', opacity: 0.18 }}
        aria-hidden="true"
      >
        <path
          d="M0 180 L0 110 Q120 40 240 75 Q360 110 480 55 Q545 25 600 50 L600 180 Z"
          fill="var(--plum)"
        />
      </svg>
      {/* Camera icon */}
      <svg
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--plum-mid)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        style={{ position: 'relative', zIndex: 1 }}
      >
        <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
        <circle cx="12" cy="13" r="4" />
      </svg>
      <p
        style={{
          color: 'var(--plum-mid)',
          fontSize: '0.8rem',
          fontWeight: 500,
          textAlign: 'center',
          padding: '0 28px',
          maxWidth: 300,
          zIndex: 1,
          lineHeight: 1.55,
          position: 'relative',
        }}
      >
        {label}
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 1 · HERO
   ═══════════════════════════════════════════════════════════════════════════ */

function HeroSection({ lang }: { lang: Lang }) {
  return (
    <section
      id="initiatives-hero"
      style={{
        minHeight: '82vh',
        background: `radial-gradient(ellipse 75% 55% at 38% 32%, oklch(88% 0.05 315 / 0.26), transparent), var(--bg)`,
        display: 'flex',
        alignItems: 'center',
        paddingTop: 120,
        paddingBottom: 80,
        paddingLeft: 'clamp(20px, 5vw, 80px)',
        paddingRight: 'clamp(20px, 5vw, 80px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background blobs */}
      <div
        className="hero-blob"
        style={{ width: 420, height: 420, background: 'oklch(86% 0.07 315)', top: -80, right: -50 }}
      />
      <div
        className="hero-blob"
        style={{ width: 300, height: 300, background: 'oklch(89% 0.09 52)', bottom: -50, left: '8%' }}
      />
      <HillSVG />

      <div className="section-inner" style={{ width: '100%', position: 'relative', zIndex: 1 }}>
        {/* Eyebrow badges */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 28 }}>
          <span
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 100,
              padding: '6px 16px',
              fontSize: '0.78rem',
              fontWeight: 600,
              color: 'var(--plum)',
              boxShadow: 'var(--shadow)',
            }}
          >
            {lang === 'bg' ? 'Бранд от Пловдив за Пловдив' : 'A brand from Plovdiv for Plovdiv'}
          </span>
          <span
            style={{
              background: 'var(--caramel-lt)',
              border: '1px solid oklch(84% 0.09 52)',
              borderRadius: 100,
              padding: '6px 16px',
              fontSize: '0.78rem',
              fontWeight: 600,
              color: 'oklch(42% 0.12 52)',
            }}
          >
            {lang === 'bg' ? 'Младежка инициатива' : 'Youth-led initiative'}
          </span>
        </div>

        <h1 className="heading-xl" style={{ maxWidth: 700, marginBottom: 24 }}>
          {lang === 'bg' ? 'От Пловдив — за Пловдив.' : 'From Plovdiv — for Plovdiv.'}
        </h1>

        <p style={{ fontSize: 'clamp(1rem, 1.5vw, 1.12rem)', maxWidth: 560, marginBottom: 40 }}>
          {lang === 'bg'
            ? 'ТЕПЕ bite е бранд, роден в Пловдив с една ясна идея: част от стойността, която създаваме, да се връща обратно към града. Започваме от най-разпознаваемия му символ — тепетата.'
            : 'ТЕПЕ bite is a Plovdiv-born brand with a simple idea: part of the value we create should return to the city. We begin with its most recognizable symbol — the hills.'}
        </p>

        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          <a href="#first-initiative" className="btn btn-primary">
            {lang === 'bg' ? 'Виж първата инициатива' : 'See the first initiative'} <IconArrow />
          </a>
          <a href="#model" className="btn btn-secondary">
            {lang === 'bg' ? 'Как работи моделът?' : 'How the model works'}
          </a>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 2 · MISSION "Защо съществуваме"
   ═══════════════════════════════════════════════════════════════════════════ */

function MissionSection({ lang }: { lang: Lang }) {
  const cards = [
    {
      icon: <IconMountain />,
      iconBg: 'var(--plum-lt)',
      iconColor: 'var(--plum)',
      title: lang === 'bg' ? 'Опазване' : 'Preserve',
      text:
        lang === 'bg'
          ? 'Да пазим тепетата като част от културната идентичност на Пловдив.'
          : "Protecting the hills as part of Plovdiv's cultural identity.",
    },
    {
      icon: <IconBrush />,
      iconBg: 'var(--caramel-lt)',
      iconColor: 'var(--caramel)',
      title: lang === 'bg' ? 'Облагородяване' : 'Improve',
      text:
        lang === 'bg'
          ? 'Да превръщаме занемарени точки в по-красиви, активни и човешки места.'
          : 'Turning neglected spots into more beautiful, active, human spaces.',
    },
    {
      icon: <IconUsers />,
      iconBg: 'oklch(90% 0.04 295)',
      iconColor: 'var(--plum-mid)',
      title: lang === 'bg' ? 'Младежка активност' : 'Youth action',
      text:
        lang === 'bg'
          ? 'Да покажем, че младите хора могат не само да говорят за промяна, а да я реализират.'
          : 'Showing that young people can do more than talk about change — they can create it.',
    },
  ];

  return (
    <section className="section-spacing" style={{ background: 'var(--surface)' }}>
      <div className="section-inner">
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <div className="section-divider" />
          <div className="label-tag" style={{ marginBottom: 14 }}>
            {lang === 'bg' ? 'Нашата кауза' : 'Our cause'}
          </div>
          <h2 className="heading-lg">
            {lang === 'bg' ? 'Защо съществуваме' : 'Why we exist'}
          </h2>
          <p style={{ maxWidth: 620, margin: '16px auto 0', fontSize: '1.05rem' }}>
            {lang === 'bg'
              ? 'Пловдив не е просто град. Той е памет, общност, движение и тепета. С ТЕПЕ bite искаме да създадем модел, в който един малък ежедневен избор — покупката на барче — може да подкрепя реална грижа за градската среда.'
              : 'Plovdiv is more than a city. It is memory, community, movement, and hills. With ТЕПЕ bite, we want to create a model where a small everyday choice — buying a snack bar — can support real care for the urban environment.'}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }} className="mission-cards">
          {cards.map(({ icon, iconBg, iconColor, title, text }, i) => (
            <div key={i} className="card card-hover" style={{ padding: '36px 28px' }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 'var(--r-md)',
                  background: iconBg,
                  color: iconColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 20,
                }}
              >
                {icon}
              </div>
              <h3 className="heading-md" style={{ fontSize: '1.12rem', marginBottom: 12 }}>
                {title}
              </h3>
              <p style={{ fontSize: '0.95rem', margin: 0 }}>{text}</p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) { .mission-cards { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 560px) { .mission-cards { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 3 · MODEL "Как работи моделът"
   ═══════════════════════════════════════════════════════════════════════════ */

function ModelSection({ lang }: { lang: Lang }) {
  const steps = [
    {
      num: '01',
      icon: <IconShop />,
      iconBg: 'var(--plum)',
      title: lang === 'bg' ? 'Избираш ТЕПЕ bite' : 'Choose ТЕПЕ bite',
      text:
        lang === 'bg'
          ? 'Купуваш барче, създадено в Пловдив с мисия зад него.'
          : 'You buy a snack bar created in Plovdiv with a mission behind it.',
    },
    {
      num: '02',
      icon: <IconHeart />,
      iconBg: 'var(--caramel)',
      title: lang === 'bg' ? 'Подкрепяш кауза' : 'Support a cause',
      text:
        lang === 'bg'
          ? 'Част от стойността се насочва към реални проекти за тепетата и градската среда.'
          : 'Part of the value supports real projects for the hills and the urban environment.',
    },
    {
      num: '03',
      icon: <IconCheck />,
      iconBg: 'var(--plum)',
      title: lang === 'bg' ? 'Виждаш резултата' : 'See the result',
      text:
        lang === 'bg'
          ? 'Показваме напредъка, партньорствата, следващите стъпки и реализираните действия.'
          : 'We show progress, partnerships, next steps, and completed actions.',
    },
  ];

  return (
    <section id="model" className="section-spacing" style={{ background: 'var(--bg)' }}>
      <div className="section-inner">
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div className="section-divider" />
          <div className="label-tag" style={{ marginBottom: 14 }}>
            {lang === 'bg' ? 'Нашият модел' : 'Our model'}
          </div>
          <h2 className="heading-lg">
            {lang === 'bg' ? 'Как работи моделът ТЕПЕ bite' : 'How the ТЕПЕ bite model works'}
          </h2>
          <p style={{ maxWidth: 540, margin: '16px auto 0', fontSize: '1rem' }}>
            {lang === 'bg'
              ? 'Нашият модел е прост: създаваме продукт, който хората харесват, а част от стойността му се връща обратно към социални инициативи за Пловдив.'
              : 'Our model is simple: we create a product people enjoy, and part of its value goes back into social initiatives for Plovdiv.'}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'stretch', gap: 0 }} className="model-steps">
          {steps.map(({ num, icon, iconBg, title, text }, i) => (
            <div key={i} style={{ display: 'flex', flex: 1 }}>
              <div
                className="card"
                style={{ padding: '36px 28px', flex: 1, position: 'relative', overflow: 'hidden' }}
              >
                {/* Big ghost number */}
                <div
                  style={{
                    fontFamily: 'var(--font-head)',
                    fontSize: '4rem',
                    fontWeight: 900,
                    color: 'var(--border)',
                    lineHeight: 1,
                    position: 'absolute',
                    top: 12,
                    right: 20,
                    userSelect: 'none',
                    pointerEvents: 'none',
                  }}
                  aria-hidden="true"
                >
                  {num}
                </div>
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: '50%',
                    background: iconBg,
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 20,
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  {icon}
                </div>
                <h3 className="heading-md" style={{ fontSize: '1.08rem', marginBottom: 12 }}>
                  {title}
                </h3>
                <p style={{ fontSize: '0.92rem', margin: 0 }}>{text}</p>
              </div>
              {i < 2 && (
                <div
                  style={{
                    width: 28,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                  aria-hidden="true"
                >
                  <svg width="28" height="18" viewBox="0 0 28 18">
                    <path
                      d="M0 9 L20 9 M14 3 L20 9 L14 15"
                      stroke="var(--border)"
                      strokeWidth="2"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Note */}
        <div
          style={{
            marginTop: 40,
            padding: '18px 24px',
            background: 'var(--plum-lt)',
            borderRadius: 'var(--r-sm)',
            borderLeft: '3px solid var(--caramel)',
            display: 'flex',
            gap: 14,
            alignItems: 'flex-start',
            maxWidth: 680,
            margin: '40px auto 0',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--caramel)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }} aria-hidden="true">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--plum)', fontStyle: 'italic' }}>
            {lang === 'bg'
              ? 'Първата инициатива ще бъде завършена преди началото на масовите продажби на продукта.'
              : 'Our first initiative is planned to be completed before the start of mass product sales.'}
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .model-steps { flex-direction: column !important; }
          .model-steps > div > div[aria-hidden="true"] { display: none !important; }
        }
      `}</style>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 4 · FIRST INITIATIVE
   ═══════════════════════════════════════════════════════════════════════════ */

function FirstInitiativeSection({ lang }: { lang: Lang }) {
  const facts =
    lang === 'bg'
      ? [
          ['Локация', 'Парк Бунарджика, зоната около чешмичката на „Кръгчето"'],
          ['Формат', 'Съвременно графично изкуство / арт намеса'],
          ['Цел', 'Облагородяване и активиране на социална зона'],
          ['Финансиране', 'Моделът ТЕПЕ bite'],
          ['Статус', 'Подготовка и координация'],
        ]
      : [
          ['Location', 'Bunardzhika Park, the area around the fountain at "Krugcheto"'],
          ['Format', 'Contemporary graphic art / art intervention'],
          ['Goal', 'Improving and activating a social space'],
          ['Funding', 'The ТЕПЕ bite model'],
          ['Status', 'Preparation and coordination'],
        ];

  return (
    <section
      id="first-initiative"
      className="section-spacing"
      style={{ background: 'var(--surface)' }}
    >
      <div className="section-inner">
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <div className="section-divider" />
          <div className="label-tag" style={{ marginBottom: 14 }}>
            {lang === 'bg' ? 'В процес на реализация' : 'In progress'}
          </div>
          <h2 className="heading-lg">
            {lang === 'bg'
              ? 'Първа инициатива: RE-CONNECT БУНАРДЖИКА'
              : 'First initiative: RE-CONNECT BUNARDZHIKA'}
          </h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(280px, 1.1fr) minmax(280px, 0.9fr)',
            gap: 'clamp(32px, 5vw, 60px)',
            alignItems: 'start',
          }}
          className="initiative-detail-grid"
        >
          {/* Left: concept image */}
          <div>
            {/*
              TODO: Replace placeholder with:
              /assets/images/initiatives/reconnect-bunardzhika/design-concept-aerial.jpg
              Image should be added to the public/ directory.
            */}
            <ImgPlaceholder
              label={
                lang === 'bg'
                  ? 'Концептуална визуализация — RE-CONNECT БУНАРДЖИКА'
                  : 'Concept visualization — RE-CONNECT BUNARDZHIKA'
              }
              todoAsset="/assets/images/initiatives/reconnect-bunardzhika/design-concept-aerial.jpg"
              ratio="4/3"
            />
            <p
              style={{
                marginTop: 12,
                fontSize: '0.82rem',
                color: 'var(--text-soft)',
                fontStyle: 'italic',
                textAlign: 'center',
              }}
            >
              {lang === 'bg'
                ? 'Концептуална визуализация на графичната намеса около чешмичката на „Кръгчето".'
                : "Concept visualization of the graphic intervention around the fountain at 'Krugcheto'."}
            </p>
          </div>

          {/* Right: info panel */}
          <div>
            {/* Status labels */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
              {[
                {
                  text: lang === 'bg' ? 'Пилотен проект' : 'Pilot project',
                  color: 'var(--plum)',
                  bg: 'var(--plum-lt)',
                },
                {
                  text: lang === 'bg' ? 'Бунарджика, Пловдив' : 'Bunardzhika, Plovdiv',
                  color: 'oklch(42% 0.12 52)',
                  bg: 'var(--caramel-lt)',
                },
                {
                  text: lang === 'bg' ? 'В процес' : 'In progress',
                  color: 'oklch(34% 0.1 150)',
                  bg: 'oklch(92% 0.05 150)',
                },
              ].map(({ text, color, bg }) => (
                <span
                  key={text}
                  style={{
                    background: bg,
                    color,
                    borderRadius: 100,
                    padding: '5px 14px',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                  }}
                >
                  {text}
                </span>
              ))}
            </div>

            <p style={{ marginBottom: 28, fontSize: '1rem', lineHeight: 1.72 }}>
              {lang === 'bg'
                ? 'RE-CONNECT БУНАРДЖИКА е пилотният ни социален проект. Целта е естетическа регенерация на пространството около знаковата чешмичка на „Кръгчето" в парк Бунарджика чрез съвременно графично изкуство.'
                : "RE-CONNECT BUNARDZHIKA is our pilot social project. Its goal is the aesthetic regeneration of the space around the symbolic fountain at 'Krugcheto' in Bunardzhika Park through contemporary graphic art."}
            </p>

            {/* Quick facts */}
            <div
              style={{
                fontWeight: 700,
                fontSize: '0.75rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--text-soft)',
                marginBottom: 12,
              }}
            >
              {lang === 'bg' ? 'Ключови факти' : 'Key facts'}
            </div>
            {facts.map(([key, val], i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  padding: '11px 0',
                  borderBottom: '1px solid var(--border)',
                  gap: 16,
                }}
              >
                <span style={{ color: 'var(--text-soft)', fontSize: '0.88rem', flexShrink: 0 }}>
                  {key}
                </span>
                <span
                  style={{ fontWeight: 600, color: 'var(--plum)', fontSize: '0.88rem', textAlign: 'right' }}
                >
                  {val}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .initiative-detail-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 5 · CONCEPT & VISION
   ═══════════════════════════════════════════════════════════════════════════ */

function ConceptSection({ lang }: { lang: Lang }) {
  const cards = [
    {
      symbol: '〰',
      iconBg: 'var(--caramel-lt)',
      title: lang === 'bg' ? 'Флуидни линии' : 'Fluid lines',
      text:
        lang === 'bg'
          ? 'Графични елементи, които водят погледа и движението към парка.'
          : 'Graphic elements that guide the eye and movement toward the park.',
    },
    {
      symbol: '◎',
      iconBg: 'var(--plum-lt)',
      title: lang === 'bg' ? 'Социална функция' : 'Social function',
      text:
        lang === 'bg'
          ? 'Пространството не е само за преминаване — то може да стане място за спиране, общуване и присъствие.'
          : 'The space is not only for passing through — it can become a place to stop, connect, and be present.',
    },
  ];

  return (
    <section className="section-spacing" style={{ background: 'var(--bg)' }}>
      <div className="section-inner">
        <div style={{ marginBottom: 48 }}>
          <div className="label-tag" style={{ marginBottom: 14 }}>
            {lang === 'bg' ? 'Арт намеса' : 'Art intervention'}
          </div>
          <h2 className="heading-lg" style={{ maxWidth: 560, marginBottom: 20 }}>
            {lang === 'bg' ? 'Концепция и визия' : 'Concept and vision'}
          </h2>
          <p style={{ maxWidth: 640, fontSize: '1.02rem' }}>
            {lang === 'bg'
              ? 'Идеята е да трансформираме занемарена транзитна точка в място, което хората забелязват, използват и преживяват. Чрез смели флуидни линии и графични елементи пространството около чешмичката може да се превърне в естествена покана към Бунарджика — към разходка, среща, разговор и грижа.'
              : 'The idea is to transform a neglected transition point into a place people notice, use, and experience. Through bold fluid lines and graphic elements, the space around the fountain can become a natural invitation to Bunardzhika — to walk, meet, talk, and care.'}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }} className="concept-cards">
          {cards.map(({ symbol, iconBg, title, text }, i) => (
            <div key={i} className="card card-hover" style={{ padding: '36px 28px' }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 'var(--r-md)',
                  background: iconBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.9rem',
                  color: i === 0 ? 'var(--caramel)' : 'var(--plum)',
                  marginBottom: 20,
                  fontWeight: 300,
                }}
              >
                {symbol}
              </div>
              <h3 className="heading-md" style={{ fontSize: '1.1rem', marginBottom: 12 }}>
                {title}
              </h3>
              <p style={{ fontSize: '0.95rem', margin: 0 }}>{text}</p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 580px) { .concept-cards { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 6 · PROGRESS TIMELINE
   ═══════════════════════════════════════════════════════════════════════════ */

function ProgressSection({ lang }: { lang: Lang }) {
  type Milestone = {
    done: boolean;
    title: string;
    text: string;
    link: { href: string; label: string } | null;
  };

  const milestones: Milestone[] = [
    {
      done: true,
      title: lang === 'bg' ? 'Идентифицирахме каузата' : 'We identified the cause',
      text:
        lang === 'bg'
          ? 'Фокусът е ясен: грижа за тепетата и облагородяване на конкретна зона на Бунарджика.'
          : 'The focus is clear: caring for the hills and improving a specific area of Bunardzhika.',
      link: null,
    },
    {
      done: true,
      title: lang === 'bg' ? 'Проверихме осъществимостта' : 'We assessed feasibility',
      text:
        lang === 'bg'
          ? 'Проектът е структуриран като реалистична първа стъпка, а не като абстрактна идея.'
          : 'The project is structured as a realistic first step, not an abstract idea.',
      link: null,
    },
    {
      done: true,
      title:
        lang === 'bg'
          ? 'Осигурихме техническо партньорство с Оргахим'
          : 'We secured technical partnership with Orgachim',
      text:
        lang === 'bg'
          ? 'Оргахим ще подкрепи проекта с нужните инструменти и материали за реализацията.'
          : 'Orgachim will support the project with the tools and materials needed for implementation.',
      link: {
        href: 'https://www.orgachim.bg/bg/',
        label: lang === 'bg' ? 'Към Оргахим' : 'Visit Orgachim',
      },
    },
    {
      done: true,
      title: lang === 'bg' ? 'Открихме артистичен екип' : 'We found the artist team',
      text:
        lang === 'bg'
          ? 'Работим с група артисти, които ще развият и изпълнят финалната визуална намеса.'
          : 'We are working with a group of artists who will develop and execute the final visual intervention.',
      link: null,
    },
    {
      done: true,
      title: lang === 'bg' ? 'Имаме първи дизайн идеи' : 'We have first design ideas',
      text:
        lang === 'bg'
          ? 'Създадени са концептуални визуализации за графичната посока и усещането на пространството.'
          : 'Concept visuals have been created for the graphic direction and the feeling of the space.',
      link: null,
    },
    {
      done: false,
      title:
        lang === 'bg'
          ? 'Предстои разговор с Район „Централен"'
          : 'Coordination with Central District is next',
      text:
        lang === 'bg'
          ? 'Следващата важна стъпка е координация с кмета на район „Централен" и администрацията.'
          : 'The next important step is coordination with the mayor of Central District and the administration.',
      link: {
        href: 'https://plovdivcentral.org/rajonna-administratsiya/kmet/',
        label: lang === 'bg' ? 'Район „Централен"' : 'Central District',
      },
    },
    {
      done: false,
      title: lang === 'bg' ? 'Предстои реализация на арт намесата' : 'Art execution remains',
      text:
        lang === 'bg'
          ? 'След финално съгласуване преминаваме към подготовка на терена и изпълнение на графичното изкуство.'
          : 'After final coordination, we move toward preparing the site and executing the graphic artwork.',
      link: null,
    },
  ];

  const doneCount = milestones.filter((m) => m.done).length;
  const pct = Math.round((doneCount / milestones.length) * 100);

  return (
    <section id="progress" className="section-spacing" style={{ background: 'var(--surface)' }}>
      <div className="section-inner">
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <div className="section-divider" />
          <div className="label-tag" style={{ marginBottom: 14 }}>
            {lang === 'bg' ? 'Прозрачност' : 'Transparency'}
          </div>
          <h2 className="heading-lg">
            {lang === 'bg' ? 'Напредък досега' : 'Progress so far'}
          </h2>
          <p style={{ maxWidth: 480, margin: '16px auto 0' }}>
            {lang === 'bg'
              ? 'Следим и публикуваме всяка стъпка — от идеята до реализацията.'
              : 'We track and publish every step — from idea to implementation.'}
          </p>
        </div>

        {/* Progress bar summary */}
        <div style={{ maxWidth: 520, margin: '0 auto 48px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              marginBottom: 10,
            }}
          >
            <span style={{ fontWeight: 600, fontSize: '0.92rem', color: 'var(--text)' }}>
              {lang === 'bg' ? 'Стъпки завършени' : 'Steps completed'}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-head)',
                fontWeight: 700,
                fontSize: '1.5rem',
                color: 'var(--plum)',
              }}
            >
              {doneCount}/{milestones.length}
            </span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${pct}%` }} />
          </div>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: 24, justifyContent: 'center', marginBottom: 40 }}>
          {[
            {
              color: 'var(--caramel)',
              label: lang === 'bg' ? 'Завършено' : 'Completed',
              icon: <IconCheck />,
            },
            {
              color: 'var(--plum-mid)',
              label: lang === 'bg' ? 'Предстои' : 'Upcoming',
              icon: <IconClock />,
            },
          ].map(({ color, label, icon }) => (
            <div
              key={label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                color,
                fontSize: '0.85rem',
                fontWeight: 600,
              }}
            >
              {icon} {label}
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          {milestones.map(({ done, title, text, link }, i) => (
            <div
              key={i}
              style={{ display: 'flex', gap: 20, position: 'relative' }}
            >
              {/* Indicator column */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  flexShrink: 0,
                  width: 40,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    flexShrink: 0,
                    background: done ? 'var(--caramel)' : 'var(--surface2)',
                    border: done ? 'none' : '2px solid var(--plum-mid)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: done ? 'white' : 'var(--plum-mid)',
                    zIndex: 1,
                    position: 'relative',
                  }}
                >
                  {done ? <IconCheck /> : <IconClock />}
                </div>
                {i < milestones.length - 1 && (
                  <div
                    style={{
                      width: 2,
                      flex: 1,
                      minHeight: 28,
                      background: done ? 'oklch(75% 0.10 52)' : 'var(--border)',
                      margin: '4px 0',
                    }}
                  />
                )}
              </div>

              {/* Content column */}
              <div style={{ paddingBottom: i < milestones.length - 1 ? 32 : 0, flex: 1 }}>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: '0.96rem',
                    color: done ? 'var(--text)' : 'var(--plum-mid)',
                    marginBottom: 6,
                    paddingTop: 9,
                  }}
                >
                  {title}
                </div>
                <p
                  style={{
                    fontSize: '0.9rem',
                    color: done ? 'var(--text-mid)' : 'var(--text-soft)',
                    margin: 0,
                  }}
                >
                  {text}
                </p>
                {link && (
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      marginTop: 10,
                      color: 'var(--caramel)',
                      fontWeight: 600,
                      fontSize: '0.84rem',
                      textDecoration: 'none',
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLAnchorElement).style.color = 'oklch(55% 0.16 52)')
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLAnchorElement).style.color = 'var(--caramel)')
                    }
                  >
                    {link.label} <IconExternal />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 7 · PARTNERS
   ═══════════════════════════════════════════════════════════════════════════ */

function PartnersSection({ lang }: { lang: Lang }) {
  return (
    <section className="section-spacing" style={{ background: 'var(--bg)' }}>
      <div className="section-inner">
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <div className="section-divider" />
          <div className="label-tag" style={{ marginBottom: 14 }}>
            {lang === 'bg' ? 'Партньорства' : 'Partnerships'}
          </div>
          <h2 className="heading-lg">
            {lang === 'bg' ? 'Партньори и участници' : 'Partners and contributors'}
          </h2>
        </div>

        <div
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}
          className="partners-grid"
        >
          {/* Partner 1: Orgachim */}
          <div className="card card-hover" style={{ padding: '36px 28px' }}>
            {/*
              TODO: Replace icon below with Orgachim logo image:
              /assets/images/partners/orgachim-logo.svg
              (place in public/ and use <Image> or <img> tag)
            */}
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: 'var(--r-md)',
                background: 'var(--surface2)',
                border: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 20,
                color: 'var(--plum-mid)',
              }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <path d="M8 21h8M12 17v4" />
              </svg>
            </div>
            <div className="label-tag" style={{ marginBottom: 10 }}>
              {lang === 'bg' ? 'Технически партньор' : 'Technical partner'}
            </div>
            <h3 className="heading-md" style={{ fontSize: '1.2rem', marginBottom: 14 }}>
              Оргахим
            </h3>
            <p style={{ fontSize: '0.9rem', marginBottom: 20 }}>
              {lang === 'bg'
                ? 'Оргахим е технически партньор на проекта и ще осигури нужните инструменти и материали за реализацията. Компанията е един от утвърдените български производители на бои и покрития, с продукти за дома, строителството, индустрията и авторепаратурата.'
                : 'Orgachim is a technical partner of the project and will provide the tools and materials needed for implementation. An established Bulgarian manufacturer of paints and coatings for home, construction, industry, and automotive repair.'}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <a
                href="https://www.orgachim.bg/bg/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: 'var(--caramel)',
                  fontWeight: 600,
                  fontSize: '0.84rem',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.textDecoration = 'underline')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.textDecoration = 'none')}
              >
                {lang === 'bg' ? 'Сайт на Оргахим' : 'Orgachim website'} <IconExternal />
              </a>
              <a
                href="https://corporate.orgachim.bg/bg/blog/proekt-gradoobitateli/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: 'var(--text-soft)',
                  fontSize: '0.82rem',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.color = 'var(--plum)')
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-soft)')
                }
              >
                {lang === 'bg'
                  ? 'Виж пример за градски арт проект с Оргахим'
                  : 'See an urban art project example with Orgachim'}{' '}
                <IconExternal />
              </a>
            </div>
          </div>

          {/* Partner 2: Artist team */}
          {/* TODO: Replace with final artist/team names, photos, and links when approved. */}
          <div
            className="card"
            style={{ padding: '36px 28px', borderStyle: 'dashed', opacity: 0.88 }}
          >
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: 'var(--r-md)',
                background: 'var(--plum-lt)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 20,
                color: 'var(--plum-mid)',
              }}
            >
              <IconUsers />
            </div>
            <div className="label-tag" style={{ marginBottom: 10 }}>
              {lang === 'bg' ? 'Артистичен екип' : 'Artist team'}
            </div>
            <h3 className="heading-md" style={{ fontSize: '1.2rem', marginBottom: 14 }}>
              {lang === 'bg' ? 'Артистичен екип' : 'Artist team'}
            </h3>
            <p style={{ fontSize: '0.9rem', fontStyle: 'italic', margin: 0 }}>
              {lang === 'bg'
                ? 'Финалната графична намеса ще бъде разработена и изпълнена от артистичен екип. Имената и детайлите ще бъдат добавени след финално потвърждение.'
                : 'The final graphic intervention will be developed and executed by an artist team. Names and details will be added after final confirmation.'}
            </p>
          </div>

          {/* Partner 3: Central District */}
          <div
            className="card"
            style={{ padding: '36px 28px', borderStyle: 'dashed', opacity: 0.88 }}
          >
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: 'var(--r-md)',
                background: 'oklch(92% 0.04 220)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 20,
                color: 'oklch(42% 0.1 220)',
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <div className="label-tag" style={{ marginBottom: 10, color: 'oklch(42% 0.1 220)' }}>
              {lang === 'bg' ? 'Предстояща координация' : 'Pending coordination'}
            </div>
            <h3 className="heading-md" style={{ fontSize: '1.2rem', marginBottom: 14 }}>
              {lang === 'bg' ? 'Район „Централен"' : 'Central District'}
            </h3>
            <p style={{ fontSize: '0.9rem', fontStyle: 'italic', marginBottom: 20 }}>
              {lang === 'bg'
                ? 'Координацията с район „Централен" предстои. До получаване на официално съгласуване проектът е в подготвителна фаза.'
                : 'Coordination with Central District is pending. The project is in a preparatory phase until official approval is received.'}
            </p>
            <a
              href="https://plovdivcentral.org/kontakti/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: 'var(--text-soft)',
                fontSize: '0.82rem',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.color = 'var(--plum)')
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-soft)')
              }
            >
              {lang === 'bg' ? 'Контакти на Район „Централен"' : 'Central District contacts'}{' '}
              <IconExternal />
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) { .partners-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 580px) { .partners-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 8 · DESIGN GALLERY
   ═══════════════════════════════════════════════════════════════════════════ */

function GallerySection({ lang }: { lang: Lang }) {
  const notes =
    lang === 'bg'
      ? [
          'Линии, които насочват движението',
          'Цветове, свързани с идентичността на ТЕПЕ bite',
          'Форма, която превръща пространството в преживяване',
          'Място, което кани хората да спрат',
        ]
      : [
          'Lines that guide movement',
          'Colors connected to the ТЕПЕ bite identity',
          'A form that turns the space into an experience',
          'A place that invites people to stop',
        ];

  return (
    <section className="section-spacing" style={{ background: 'var(--surface)' }}>
      <div className="section-inner">
        <div style={{ marginBottom: 40 }}>
          <div className="label-tag" style={{ marginBottom: 14 }}>
            {lang === 'bg' ? 'Визуална концепция' : 'Visual concept'}
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, flexWrap: 'wrap' }}>
            <h2 className="heading-lg" style={{ maxWidth: 500, marginBottom: 0 }}>
              {lang === 'bg' ? 'Първи дизайн идеи' : 'First design ideas'}
            </h2>
            <span
              style={{
                background: 'var(--caramel-lt)',
                color: 'oklch(44% 0.12 52)',
                borderRadius: 100,
                padding: '4px 14px',
                fontSize: '0.72rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                flexShrink: 0,
              }}
            >
              {lang === 'bg' ? 'Концептуална визуализация' : 'Concept visualization'}
            </span>
          </div>
        </div>

        {/* Main image */}
        <div style={{ marginBottom: 16 }}>
          {/*
            TODO: Replace placeholder with actual design concept image.
            File needed: /assets/images/initiatives/reconnect-bunardzhika/design-concept-aerial.jpg
            Copy image into: public/assets/images/initiatives/reconnect-bunardzhika/design-concept-aerial.jpg
            Then replace ImgPlaceholder with:
            <Image src="/assets/images/initiatives/reconnect-bunardzhika/design-concept-aerial.jpg"
              alt="Дизайн концепция — RE-CONNECT БУНАРДЖИКА" width={900} height={506} loading="lazy"
              style={{ width: '100%', height: 'auto', borderRadius: 'var(--r-md)' }} />
          */}
          <ImgPlaceholder
            label={
              lang === 'bg'
                ? 'Дизайн концепция — RE-CONNECT БУНАРДЖИКА'
                : 'Design concept — RE-CONNECT BUNARDZHIKA'
            }
            todoAsset="/assets/images/initiatives/reconnect-bunardzhika/design-concept-aerial.jpg"
            ratio="16/9"
          />
          <p
            style={{
              marginTop: 12,
              fontSize: '0.82rem',
              color: 'var(--text-soft)',
              fontStyle: 'italic',
              textAlign: 'center',
            }}
          >
            {lang === 'bg'
              ? 'Визуална посока: флуидни линии, цветни акценти и движение около чешмичката.'
              : 'Visual direction: fluid lines, color accents, and movement around the fountain.'}
          </p>
        </div>

        {/* Design note cards */}
        <div
          style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginTop: 36 }}
          className="gallery-notes"
        >
          {notes.map((note, i) => (
            <div
              key={i}
              style={{
                background: i % 2 === 0 ? 'var(--plum-lt)' : 'var(--caramel-lt)',
                borderRadius: 'var(--r-sm)',
                padding: '20px 18px',
                borderLeft: `3px solid ${i % 2 === 0 ? 'var(--plum)' : 'var(--caramel)'}`,
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: '0.88rem',
                  fontWeight: 500,
                  color: i % 2 === 0 ? 'var(--plum)' : 'oklch(44% 0.12 52)',
                  lineHeight: 1.55,
                }}
              >
                {note}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) { .gallery-notes { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 440px) { .gallery-notes { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 9 · LONG-TERM VISION
   ═══════════════════════════════════════════════════════════════════════════ */

function LongTermSection({ lang }: { lang: Lang }) {
  return (
    <section
      className="section-spacing"
      style={{ background: 'var(--plum)', color: 'white', position: 'relative', overflow: 'hidden' }}
    >
      {/* Decorative glow */}
      <div
        style={{
          position: 'absolute',
          top: -80,
          right: -80,
          width: 360,
          height: 360,
          borderRadius: '50%',
          background: 'oklch(88% 0.06 315 / 0.1)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />
      <HillSVG opacity={0.07} fill="white" variant={2} />

      <div className="section-inner" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ marginBottom: 48 }}>
          <div className="label-tag" style={{ color: 'oklch(85% 0.08 315)', marginBottom: 14 }}>
            {lang === 'bg' ? 'Дългосрочна визия' : 'Long-term vision'}
          </div>
          <h2 className="heading-lg" style={{ color: 'white', maxWidth: 520, marginBottom: 20 }}>
            {lang === 'bg' ? 'След Бунарджика' : 'After Bunardzhika'}
          </h2>
          <p style={{ color: 'oklch(84% 0.04 310)', maxWidth: 620, fontSize: '1.02rem' }}>
            {lang === 'bg'
              ? 'RE-CONNECT БУНАРДЖИКА е пилотната стъпка. Дългосрочната ни визия е да изградим устойчив модел, в който бизнесът обслужва природата и обществото — с нови инициативи за други ключови зони в Пловдив.'
              : 'RE-CONNECT BUNARDZHIKA is the pilot step. Our long-term vision is to build a sustainable model where business serves nature and society — with future initiatives for other key areas in Plovdiv.'}
          </p>
        </div>

        {/* Future idea card */}
        <div
          style={{
            background: 'oklch(40% 0.07 315)',
            borderRadius: 'var(--r-lg)',
            padding: '36px 32px',
            maxWidth: 560,
            border: '1px solid oklch(46% 0.07 315)',
          }}
        >
          <span
            style={{
              background: 'oklch(48% 0.09 315)',
              borderRadius: 100,
              padding: '5px 14px',
              fontSize: '0.7rem',
              fontWeight: 700,
              color: 'oklch(84% 0.06 315)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              display: 'inline-block',
              marginBottom: 18,
            }}
          >
            {lang === 'bg' ? 'Бъдеща идея' : 'Future idea'}
          </span>
          <h3
            style={{
              fontFamily: 'var(--font-head)',
              fontSize: '1.3rem',
              fontWeight: 600,
              color: 'var(--caramel)',
              marginBottom: 14,
            }}
          >
            TEPE Connect
          </h3>
          <p style={{ color: 'oklch(78% 0.04 310)', margin: 0, fontSize: '0.95rem' }}>
            {lang === 'bg'
              ? 'Информационна инфраструктура с табели за превенция на пожари и замърсяване, както и важни контакти при спешни ситуации.'
              : 'Informational infrastructure with signs for fire and pollution prevention, as well as important emergency contacts.'}
          </p>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 10 · WHY SUPPORT
   ═══════════════════════════════════════════════════════════════════════════ */

function WhySupportSection({ lang }: { lang: Lang }) {
  const cards = [
    {
      icon: <IconTarget />,
      iconBg: 'var(--plum-lt)',
      iconColor: 'var(--plum)',
      title: lang === 'bg' ? 'Реална промяна' : 'Real change',
      text:
        lang === 'bg'
          ? 'Подкрепяш конкретно подобрение на градската среда, а не абстрактна идея.'
          : 'You support a concrete improvement of the urban environment, not an abstract idea.',
    },
    {
      icon: <IconStar />,
      iconBg: 'var(--caramel-lt)',
      iconColor: 'var(--caramel)',
      title: lang === 'bg' ? 'Младежко действие' : 'Youth action',
      text:
        lang === 'bg'
          ? 'Проектът показва, че младите хора могат да създават решения за града си.'
          : 'The project shows that young people can create solutions for their city.',
    },
    {
      icon: <IconMountain />,
      iconBg: 'oklch(90% 0.04 295)',
      iconColor: 'var(--plum-mid)',
      title: lang === 'bg' ? 'Грижа за тепетата' : 'Care for the hills',
      text:
        lang === 'bg'
          ? 'Тепетата са част от идентичността на Пловдив — и заслужават постоянна, видима грижа.'
          : "The hills are part of Plovdiv's identity — and they deserve constant, visible care.",
    },
    {
      icon: <IconShield />,
      iconBg: 'var(--surface2)',
      iconColor: 'var(--plum-mid)',
      title: lang === 'bg' ? 'Без разход на публичен ресурс' : 'No public-resource burden',
      text:
        lang === 'bg'
          ? 'Моделът търси начин бизнесът и общността да подкрепят подобренията заедно.'
          : 'The model seeks a way for business and community to support improvements together.',
    },
  ];

  return (
    <section className="section-spacing" style={{ background: 'var(--bg)' }}>
      <div className="section-inner">
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <div className="section-divider" />
          <h2 className="heading-lg">
            {lang === 'bg'
              ? 'Защо да подкрепиш инициативата?'
              : 'Why support the initiative?'}
          </h2>
        </div>

        <div
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}
          className="why-cards"
        >
          {cards.map(({ icon, iconBg, iconColor, title, text }, i) => (
            <div
              key={i}
              className="card card-hover"
              style={{ padding: '32px 28px', display: 'flex', gap: 20, alignItems: 'flex-start' }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 'var(--r-md)',
                  background: iconBg,
                  color: iconColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {icon}
              </div>
              <div>
                <h3 className="heading-md" style={{ fontSize: '1.06rem', marginBottom: 10 }}>
                  {title}
                </h3>
                <p style={{ fontSize: '0.93rem', margin: 0 }}>{text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 620px) { .why-cards { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 11 · CTA
   ═══════════════════════════════════════════════════════════════════════════ */

function CTASection({ lang }: { lang: Lang }) {
  return (
    <section
      className="section-spacing"
      style={{ background: 'var(--caramel)', position: 'relative', overflow: 'hidden' }}
    >
      <svg
        style={{ position: 'absolute', bottom: 0, left: 0, right: 0, width: '100%', opacity: 0.1, pointerEvents: 'none' }}
        viewBox="0 0 1200 200"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M0 200 L0 160 Q200 80 400 120 Q600 160 800 90 Q1000 30 1200 80 L1200 200 Z" fill="white" />
      </svg>
      <div
        style={{ position: 'absolute', top: -60, left: '50%', transform: 'translateX(-50%)', width: 500, height: 500, borderRadius: '50%', background: 'oklch(72% 0.12 52 / 0.25)', filter: 'blur(80px)', pointerEvents: 'none' }}
      />

      <div className="section-inner" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <h2 className="heading-lg" style={{ color: 'white', marginBottom: 18 }}>
          {lang === 'bg' ? 'Стани част от първата стъпка.' : 'Be part of the first step.'}
        </h2>
        <p
          style={{
            color: 'oklch(97% 0.015 52)',
            maxWidth: 560,
            margin: '0 auto 40px',
            fontSize: '1.05rem',
          }}
        >
          {lang === 'bg'
            ? 'Подкрепи ТЕПЕ bite, проследи RE-CONNECT БУНАРДЖИКА и помогни една малка идея от Пловдив да се превърне в реална промяна.'
            : 'Support ТЕПЕ bite, follow RE-CONNECT BUNARDZHIKA, and help a small idea from Plovdiv become real change.'}
        </p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a
            href="/#order"
            className="btn"
            style={{ background: 'var(--plum)', color: 'white' }}
          >
            <IconShop />
            {lang === 'bg' ? 'Поръчай ТЕПЕ bite' : 'Order ТЕПЕ bite'}
          </a>
          <a
            href="/"
            className="btn"
            style={{ background: 'white', color: 'oklch(44% 0.14 52)', fontWeight: 700 }}
          >
            {lang === 'bg' ? 'Виж продукта' : 'See the product'}
          </a>
          <a
            href="mailto:tepe@mail.bg"
            className="btn"
            style={{
              background: 'transparent',
              color: 'white',
              border: '2px solid rgba(255,255,255,0.55)',
            }}
          >
            {lang === 'bg' ? 'Свържи се с нас' : 'Contact us'}
          </a>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 12 · FAQ
   ═══════════════════════════════════════════════════════════════════════════ */

function FAQSection({ lang }: { lang: Lang }) {
  const items =
    lang === 'bg'
      ? [
          {
            q: 'Каква е каузата на ТЕПЕ bite?',
            a: 'Каузата ни е да подкрепяме инициативи за опазване, облагородяване и преоткриване на тепетата и ключови градски пространства в Пловдив.',
          },
          {
            q: 'Какво е RE-CONNECT БУНАРДЖИКА?',
            a: 'Това е първата ни инициатива — проект за естетическа регенерация на пространството около чешмичката на „Кръгчето" в парк Бунарджика чрез съвременно графично изкуство.',
          },
          {
            q: 'Проектът вече одобрен ли е?',
            a: 'Проектът е в процес на подготовка. Следваща ключова стъпка е координация с район „Централен" и съответните институции.',
          },
          {
            q: 'Как участва Оргахим?',
            a: 'Оргахим е технически партньор и ще подкрепи проекта с нужните инструменти и материали за реализацията.',
          },
          {
            q: 'Как покупката на ТЕПЕ bite помага?',
            a: 'Част от стойността, създавана чрез продукта, се насочва към социални инициативи, започвайки с RE-CONNECT БУНАРДЖИКА.',
          },
          {
            q: 'Кой ще изпълни рисунката?',
            a: 'Работим с артистичен екип. Финалните имена и детайли ще бъдат публикувани след потвърждение.',
          },
        ]
      : [
          {
            q: 'What is the cause of ТЕПЕ bite?',
            a: "Our cause is to support initiatives for preserving, improving, and reconnecting people with Plovdiv's hills and key urban spaces.",
          },
          {
            q: 'What is RE-CONNECT BUNARDZHIKA?',
            a: "It is our first initiative — a project for the aesthetic regeneration of the area around the fountain at 'Krugcheto' in Bunardzhika Park through contemporary graphic art.",
          },
          {
            q: 'Has the project been approved already?',
            a: 'The project is currently in preparation. The next key step is coordination with Central District and the relevant institutions.',
          },
          {
            q: 'How is Orgachim involved?',
            a: 'Orgachim is a technical partner and will support the project with the tools and materials needed for implementation.',
          },
          {
            q: 'How does buying ТЕПЕ bite help?',
            a: 'Part of the value created through the product goes toward social initiatives, starting with RE-CONNECT BUNARDZHIKA.',
          },
          {
            q: 'Who will create the artwork?',
            a: 'We are working with an artist team. Final names and details will be published after confirmation.',
          },
        ];

  return (
    <section className="section-spacing" style={{ background: 'var(--surface)' }}>
      <div className="section-inner">
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <div className="section-divider" />
          <h2 className="heading-lg">
            {lang === 'bg' ? 'Чести въпроси' : 'Frequently asked questions'}
          </h2>
        </div>

        <div
          style={{
            maxWidth: 720,
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
          }}
        >
          {items.map(({ q, a }, i) => (
            <details key={i} className="faq-item">
              <summary className="faq-summary">
                <span>{q}</span>
                <span className="faq-plus" aria-hidden="true">+</span>
              </summary>
              <div className="faq-body">
                <p style={{ margin: 0, fontSize: '0.95rem' }}>{a}</p>
              </div>
            </details>
          ))}
        </div>
      </div>

      <style>{`
        .faq-item { border-radius: var(--r-sm); }
        .faq-summary {
          padding: 18px 22px;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.97rem;
          color: var(--plum);
          background: var(--surface);
          border-radius: var(--r-sm);
          border: 1px solid var(--border);
          list-style: none;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12;
          user-select: none;
          transition: background 0.18s;
        }
        .faq-summary::-webkit-details-marker { display: none; }
        .faq-summary:hover { background: var(--plum-lt); }
        .faq-plus {
          font-size: 1.3rem;
          color: var(--caramel);
          flex-shrink: 0;
          font-weight: 300;
          transition: transform 0.2s;
        }
        details[open] .faq-plus { transform: rotate(45deg); }
        details[open] .faq-summary {
          border-radius: var(--r-sm) var(--r-sm) 0 0;
          background: var(--plum-lt);
        }
        .faq-body {
          padding: 18px 22px 22px;
          background: var(--bg);
          border: 1px solid var(--border);
          border-top: none;
          border-radius: 0 0 var(--r-sm) var(--r-sm);
        }
      `}</style>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN EXPORT
   ═══════════════════════════════════════════════════════════════════════════ */

export default function InitiativesClient() {
  const lang = useAtomValue(langAtom);

  return (
    <>
      <HeroSection lang={lang} />
      <MissionSection lang={lang} />
      <ModelSection lang={lang} />
      <FirstInitiativeSection lang={lang} />
      <ConceptSection lang={lang} />
      <ProgressSection lang={lang} />
      <PartnersSection lang={lang} />
      <GallerySection lang={lang} />
      <LongTermSection lang={lang} />
      <WhySupportSection lang={lang} />
      <CTASection lang={lang} />
      <FAQSection lang={lang} />
    </>
  );
}
