'use client';
import Image from 'next/image';
import { useAtomValue } from 'jotai';
import { langAtom } from '@/store/lang';
import { IconShop, IconArrow } from '@/components/icons';

const HERO_HEADLINE = 'Вкусно за теб. Смислено за общността.';

const badges = {
  bg: [
    { val: '5.7 g', label: 'нетни въглехидрати' },
    { val: '8 g', label: 'фибри' },
    { val: '7 g', label: 'протеин' },
    { val: '1.4 g', label: 'захари' },
    { val: 'Пловдив', label: '🏔' },
  ],
  en: [
    { val: '5.7 g', label: 'net carbs' },
    { val: '8 g', label: 'fibre' },
    { val: '7 g', label: 'protein' },
    { val: '1.4 g', label: 'sugars' },
    { val: 'Plovdiv', label: '🏔' },
  ],
};

export default function Hero() {
  const lang = useAtomValue(langAtom);
  const badgeList = badges[lang];

  return (
    <section
      id="hero"
      style={{
        minHeight: '100vh',
        background: `radial-gradient(ellipse 80% 60% at 60% 30%, oklch(88% 0.05 315 / 0.22), transparent), var(--bg)`,
        display: 'flex',
        alignItems: 'center',
        paddingTop: 100,
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
        style={{
          width: 480,
          height: 480,
          background: 'oklch(88% 0.06 315)',
          top: -100,
          right: -60,
        }}
      />
      <div
        className="hero-blob"
        style={{
          width: 320,
          height: 320,
          background: 'oklch(88% 0.08 55)',
          bottom: -80,
          left: '10%',
        }}
      />

      {/* Hill silhouette */}
      <svg
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          width: '100%',
          opacity: 0.06,
          pointerEvents: 'none',
        }}
        viewBox="0 0 1200 200"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0 200 L0 140 Q150 60 300 100 Q450 140 600 80 Q750 20 900 70 Q1050 120 1200 60 L1200 200 Z"
          fill="var(--plum)"
        />
      </svg>

      <div className="section-inner" style={{ width: '100%' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            gap: 'clamp(40px, 6vw, 100px)',
            alignItems: 'center',
          }}
          className="hero-grid"
        >
          {/* Left: copy */}
          <div style={{ maxWidth: 580 }}>
            {/* Eyebrow */}
            <div
              style={{
                marginBottom: 20,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontFamily: 'var(--font-head)',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: 'var(--caramel)',
                letterSpacing: '0.04em',
              }}
            >
              <span
                style={{
                  width: 24,
                  height: 2,
                  background: 'var(--caramel)',
                  display: 'inline-block',
                  borderRadius: 10,
                  flexShrink: 0,
                }}
              />
              <span>
                {lang === 'bg'
                  ? 'Барче с характер, вдъхновено от Пловдив'
                  : 'A Bar with Character, Inspired by Plovdiv'}
              </span>
              <span
                style={{
                  flex: 1,
                  height: 2,
                  background: 'var(--caramel)',
                  display: 'inline-block',
                  borderRadius: 10,
                }}
              />
            </div>

            <h1 className="heading-xl" style={{ marginBottom: 24 }}>
              {HERO_HEADLINE}
            </h1>

            <p
              style={{
                fontSize: 'clamp(1rem, 1.5vw, 1.15rem)',
                maxWidth: 500,
                marginBottom: 40,
              }}
            >
              {lang === 'bg' ? (
                <>
                  ТЕПЕ bite е барче със солен карамел, създадено в{' '}
                  <strong>Пловдив</strong> — с ниско съдържание на нетни
                  въглехидрати, високо съдържание на фибри и{' '}
                  <strong>
                    <u>мисия зад всяка покупка</u>
                  </strong>
                  .
                </>
              ) : (
                <>
                  ТЕПЕ bite is a salted caramel bar made in{' '}
                  <strong>Plovdiv</strong> — low in net carbs, high in fibre,
                  with a{' '}
                  <strong>
                    <u>social mission behind every purchase</u>
                  </strong>
                  .
                </>
              )}
            </p>

            {/* CTA buttons */}
            <div
              style={{
                display: 'flex',
                gap: 14,
                flexWrap: 'wrap',
                marginBottom: 48,
              }}
            >
              <a href="#order" className="btn btn-primary">
                <IconShop />
                {lang === 'bg' ? 'Поръчай' : 'Order Now'}
              </a>
              <a href="#initsiatiви" className="btn btn-secondary">
                {lang === 'bg' ? 'Виж инициативите' : 'See Initiatives'}
                <IconArrow />
              </a>
            </div>

            {/* Badges */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {badgeList.map(({ val, label }, i) => (
                <div
                  key={i}
                  style={{
                    background: i === 4 ? 'var(--plum)' : 'var(--surface)',
                    color: i === 4 ? 'white' : 'var(--text)',
                    borderRadius: i === 4 ? 100 : 14,
                    padding: '10px 16px',
                    boxShadow: 'var(--shadow)',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2,
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-head)',
                      fontWeight: 700,
                      fontSize: '1.1rem',
                      color: i === 4 ? 'white' : 'var(--plum)',
                    }}
                  >
                    {val}
                  </span>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 500,
                      color: i === 4 ? 'rgba(255,255,255,0.8)' : 'var(--text-soft)',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: product visual */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
            }}
          >
            {/* Radial glow */}
            <div
              style={{
                background:
                  'radial-gradient(circle, oklch(90% 0.06 315 / 0.35), transparent 70%)',
                width: 'clamp(280px, 34vw, 480px)',
                height: 'clamp(280px, 34vw, 480px)',
                borderRadius: '50%',
                position: 'absolute',
                pointerEvents: 'none',
              }}
            />
            {/* Faded logo behind bar */}
            <Image
              src="/logo-nav.png"
              alt=""
              aria-hidden="true"
              width={380}
              height={380}
              style={{
                position: 'absolute',
                width: 'clamp(200px, 28vw, 380px)',
                height: 'auto',
                opacity: 0.13,
                filter: 'saturate(0) brightness(0.3)',
                pointerEvents: 'none',
                zIndex: 0,
                transform: 'translateY(10%)',
              }}
            />
            {/* Product bar photo */}
            <Image
              src="/bar-product.png"
              alt="ТЕПЕ bite — Солен карамел"
              width={500}
              height={500}
              priority
              className="animate-float"
              style={{
                width: 'clamp(240px, 32vw, 460px)',
                height: 'auto',
                position: 'relative',
                zIndex: 1,
                filter: 'drop-shadow(0 24px 56px oklch(32% 0.09 315 / 0.28))',
              }}
            />
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            display: flex !important;
            flex-direction: column !important;
          }
          .hero-grid > div:last-child {
            order: -1;
            width: 52% !important;
            margin: 0 auto 24px !important;
          }
          .hero-grid > div:last-child img.animate-float {
            width: 100% !important;
          }
        }
      `}</style>
    </section>
  );
}
