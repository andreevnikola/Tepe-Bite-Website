'use client';
import Image from 'next/image';
import { useAtomValue } from 'jotai';
import { langAtom } from '@/store/lang';
import { IconCheck, IconShop } from '@/components/icons';

const nutr = [
  { bg: 'Енергийна стойност', en: 'Energy', val: '197 kcal' },
  { bg: 'Нетни въглехидрати', en: 'Net carbs', val: '5.7 g' },
  { bg: 'Протеин', en: 'Protein', val: '7 g' },
  { bg: 'Фибри', en: 'Fibre', val: '8 g' },
  { bg: 'Захари', en: 'Sugars', val: '1.4 g' },
  { bg: 'Сол', en: 'Salt', val: '0.24 g' },
];

const highlights = {
  bg: [
    '5.7 g нетни въглехидрати',
    '8 g фибри',
    '7 g растителен протеин',
    '1.4 g захари',
    'Подсладено с еритритол',
    'Съставки от естествен произход',
    'Създадено в Пловдив',
    'BioStyle Ltd.',
  ],
  en: [
    '5.7 g net carbs',
    '8 g fibre',
    '7 g plant protein',
    '1.4 g sugars',
    'Sweetened with erythritol',
    'Natural origin ingredients',
    'Made in Plovdiv',
    'BioStyle Ltd.',
  ],
};

export default function ProductSection() {
  const lang = useAtomValue(langAtom);
  const items = highlights[lang];

  return (
    <section
      id="produkt"
      className="section-spacing"
      style={{
        background: `linear-gradient(160deg, var(--bg) 0%, oklch(95% 0.02 315 / 0.3) 100%)`,
      }}
    >
      <div className="section-inner">
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <div className="section-divider" />
          <div className="label-tag" style={{ marginBottom: 14 }}>
            {lang === 'bg' ? 'Нашият продукт' : 'Our Product'}
          </div>
          <h2 className="heading-lg">
            {lang === 'bg' ? 'Един продукт. Ясна идея.' : 'One product. Clear idea.'}
          </h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(260px, 1fr) minmax(320px, 1.5fr)',
            gap: 'clamp(40px, 6vw, 80px)',
            alignItems: 'start',
          }}
          className="product-grid"
        >
          {/* Left: product visual + nutrition */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 24,
            }}
          >
            <div
              style={{
                background: `radial-gradient(circle at 50% 45%, oklch(88% 0.07 315 / 0.35), oklch(93% 0.05 55 / 0.2) 60%, transparent)`,
                borderRadius: 'var(--r-xl)',
                padding: 40,
                border: '1px solid var(--border)',
                display: 'flex',
                justifyContent: 'center',
                width: '100%',
              }}
            >
              <Image
                src="/bar-product.png"
                alt="ТЕПЕ bite — Солен карамел"
                width={280}
                height={280}
                style={{
                  width: '100%',
                  maxWidth: 280,
                  height: 'auto',
                  display: 'block',
                  filter: 'drop-shadow(0 12px 28px oklch(32% 0.09 315 / 0.22))',
                  transform: 'rotate(-3deg)',
                }}
              />
            </div>

            {/* Nutrition table */}
            <div className="card" style={{ width: '100%', padding: 28 }}>
              <div style={{ marginBottom: 16 }}>
                <span
                  style={{
                    fontFamily: 'var(--font-head)',
                    fontWeight: 600,
                    fontSize: '1rem',
                    color: 'var(--plum)',
                  }}
                >
                  {lang === 'bg' ? 'Хранителна стойност' : 'Nutrition Facts'}
                </span>
                <span
                  style={{
                    float: 'right',
                    fontSize: '0.78rem',
                    color: 'var(--text-soft)',
                  }}
                >
                  {lang === 'bg' ? 'в 1 бар / 40 g' : 'per bar / 40 g'}
                </span>
              </div>
              <table className="nutr-table">
                <tbody>
                  {nutr.map((n, i) => (
                    <tr key={i}>
                      <td style={{ color: 'var(--text-mid)' }}>
                        {lang === 'bg' ? n.bg : n.en}
                      </td>
                      <td>{n.val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right: product info */}
          <div>
            <h3 className="heading-lg" style={{ marginBottom: 12 }}>
              ТЕПЕ bite
              <br />
              <span style={{ color: 'var(--caramel)', fontStyle: 'italic' }}>
                {lang === 'bg' ? 'Солен карамел' : 'Salted Caramel'}
              </span>
            </h3>
            <p style={{ fontSize: '1.05rem', marginBottom: 32, maxWidth: 460 }}>
              {lang === 'bg'
                ? 'Мек, балансиран и характерен вкус на солен карамел, съчетан с ядки, семена, фибри и растителен протеин. Създаден за моментите, в които искаш нещо сладко, но по-обмислено.'
                : 'A soft, balanced and distinctive salted caramel taste, combined with nuts, seeds, fibre and plant protein. Made for the moments when you want something sweet, but more thoughtful.'}
            </p>

            {/* Highlights grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 12,
                marginBottom: 36,
              }}
            >
              {items.map((h, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '12px 16px',
                    borderRadius: 12,
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                  }}
                >
                  <span style={{ color: 'var(--caramel)', flexShrink: 0 }}>
                    <IconCheck />
                  </span>
                  <span
                    style={{
                      fontSize: '0.88rem',
                      color: 'var(--text)',
                      fontWeight: 500,
                    }}
                  >
                    {h}
                  </span>
                </div>
              ))}
            </div>

            {/* Ingredients */}
            <div
              style={{
                background: 'var(--caramel-lt)',
                borderRadius: 16,
                padding: '20px 24px',
                marginBottom: 32,
                borderLeft: '3px solid var(--caramel)',
              }}
            >
              <div className="label-tag" style={{ marginBottom: 8 }}>
                {lang === 'bg' ? 'Съставки' : 'Ingredients'}
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-mid)', lineHeight: 1.6 }}>
                {lang === 'bg'
                  ? 'Бадеми, фибри от корен на цикория, слънчогледови семки, хрупкави протеинови хапки от слънчоглед, тиквени семки, еритритол, лукума, натурален карамелен аромат, морска сол.'
                  : 'Almonds, chicory root fibre, sunflower seeds, crunchy sunflower protein bites, pumpkin seeds, erythritol, lucuma, natural caramel flavour, sea salt.'}
              </p>
            </div>

            <a
              href="/order.html"
              className="btn btn-caramel"
              style={{ fontSize: '1rem', padding: '15px 32px' }}
            >
              <IconShop />
              {lang === 'bg' ? 'Поръчай продукта' : 'Order the Product'}
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .product-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
