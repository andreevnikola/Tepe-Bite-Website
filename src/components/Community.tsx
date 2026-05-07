'use client';
import { useAtomValue } from 'jotai';
import { langAtom } from '@/store/lang';
import { IconInsta, IconTiktok, IconFb } from '@/components/icons';

const socials = [
  {
    icon: <IconInsta />,
    label: 'Instagram',
    handle: '@tepebite',
    href: '#',
    hoverBg:
      'linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
  },
  {
    icon: <IconTiktok />,
    label: 'TikTok',
    handle: '@tepebite',
    href: '#',
    hoverBg: '#010101',
  },
  {
    icon: <IconFb />,
    label: 'Facebook',
    handle: 'ТЕПЕ bite',
    href: '#',
    hoverBg: '#1877F2',
  },
];

export default function Community() {
  const lang = useAtomValue(langAtom);

  return (
    <section
      className="section-spacing"
      style={{ background: 'var(--surface2)' }}
    >
      <div className="section-inner">
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div className="section-divider" />
          <div className="label-tag" style={{ marginBottom: 14 }}>
            {lang === 'bg' ? 'Последвай ни' : 'Follow Us'}
          </div>
          <h2 className="heading-lg" style={{ marginBottom: 0 }}>
            {lang === 'bg' ? 'Следи пътя ни' : 'Follow Our Journey'}
          </h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 20,
            maxWidth: 720,
            margin: '0 auto',
          }}
          className="socials-grid"
        >
          {socials.map((s, i) => (
            <SocialCard key={i} {...s} />
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 480px) {
          .socials-grid {
            grid-template-columns: 1fr !important;
            max-width: 320px !important;
          }
        }
        @media (max-width: 640px) and (min-width: 481px) {
          .socials-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
      `}</style>
    </section>
  );
}

function SocialCard({
  icon,
  label,
  handle,
  href,
  hoverBg,
}: {
  icon: React.ReactNode;
  label: string;
  handle: string;
  href: string;
  hoverBg: string;
}) {
  return (
    <a
      href={href}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 16,
        padding: '36px 24px 28px',
        borderRadius: 24,
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow)',
        textDecoration: 'none',
        color: 'var(--text)',
        transition: 'all 0.25s ease',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.transform = 'translateY(-6px)';
        el.style.boxShadow = 'var(--shadow-lg)';
        const wrap = el.querySelector('.social-icon-wrap') as HTMLElement;
        if (wrap) {
          wrap.style.background = hoverBg;
          wrap.style.color = 'white';
        }
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.transform = '';
        el.style.boxShadow = 'var(--shadow)';
        const wrap = el.querySelector('.social-icon-wrap') as HTMLElement;
        if (wrap) {
          wrap.style.background = 'var(--plum-lt)';
          wrap.style.color = 'var(--plum)';
        }
      }}
    >
      <div
        className="social-icon-wrap"
        style={{
          width: 56,
          height: 56,
          borderRadius: 16,
          background: 'var(--plum-lt)',
          color: 'var(--plum)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.25s ease',
        }}
      >
        {icon}
      </div>
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            fontWeight: 700,
            fontSize: '1rem',
            color: 'var(--plum)',
            fontFamily: 'var(--font-head)',
          }}
        >
          {label}
        </div>
        <div
          style={{ fontSize: '0.82rem', color: 'var(--text-soft)', marginTop: 4 }}
        >
          {handle}
        </div>
      </div>
    </a>
  );
}
