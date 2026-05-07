'use client';
import { useAtomValue } from 'jotai';
import { langAtom } from '@/store/lang';
import { IconMap, IconLeaf, IconStar } from '@/components/icons';

const cards = {
  bg: [
    {
      icon: <IconMap />,
      title: 'Създадено в Пловдив',
      copy: 'Идеята, идентичността и каузата на ТЕПЕ bite започват от Пловдив — едно от най-старите и живи градове в Европа.',
    },
    {
      icon: <IconLeaf />,
      title: 'Ясен и прозрачен състав',
      copy: 'Ядки, семена, фибри, растителен протеин, лукума, еритритол и морска сол — без излишна сложност.',
    },
    {
      icon: <IconStar />,
      title: 'Балансиран избор',
      copy: 'С ниско съдържание на нетни въглехидрати, високо съдържание на фибри и растителен протеин — барче за обмислен избор.',
    },
  ],
  en: [
    {
      icon: <IconMap />,
      title: 'Made in Plovdiv',
      copy: 'The idea, identity and cause of ТЕПЕ bite start from Plovdiv — one of the oldest and most vibrant cities in Europe.',
    },
    {
      icon: <IconLeaf />,
      title: 'Clear and transparent ingredients',
      copy: 'Nuts, seeds, fibre, plant protein, lucuma, erythritol and sea salt — without unnecessary complexity.',
    },
    {
      icon: <IconStar />,
      title: 'Balanced choice',
      copy: 'Low in net carbs, high in fibre and plant protein — a bar for a thoughtful choice.',
    },
  ],
};

export default function TrustSection() {
  const lang = useAtomValue(langAtom);
  const items = cards[lang];

  return (
    <section
      className="section-spacing"
      style={{ background: 'var(--surface)' }}
    >
      <div className="section-inner">
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div className="section-divider" />
          <div className="label-tag" style={{ marginBottom: 14 }}>
            {lang === 'bg' ? 'Качество и доверие' : 'Quality & Trust'}
          </div>
          <h2 className="heading-lg">
            {lang === 'bg' ? 'Качество, в което вярваме' : 'Quality We Believe In'}
          </h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 24,
          }}
        >
          {items.map((c, i) => (
            <div
              key={i}
              className="card card-hover"
              style={{ padding: '32px 28px' }}
            >
              <div
                style={{
                  fontSize: '1.4rem',
                  marginBottom: 16,
                  width: 44,
                  height: 44,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'var(--caramel-lt)',
                  borderRadius: 12,
                  color: 'var(--caramel)',
                }}
              >
                {c.icon}
              </div>
              <h4
                style={{
                  fontFamily: 'var(--font-head)',
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  color: 'var(--plum)',
                  marginBottom: 10,
                }}
              >
                {c.title}
              </h4>
              <p style={{ fontSize: '0.9rem', lineHeight: 1.65 }}>{c.copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
