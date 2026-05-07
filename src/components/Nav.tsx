'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAtom } from 'jotai';
import { langAtom, type Lang } from '@/store/lang';
import { IconArrow, IconMenu, IconClose, IconShop } from '@/components/icons';

const navLinks = {
  bg: [
    ['#produkt', 'Продуктът'],
    ['#initsiatiви', 'Нашите инициативи'],
    ['#za-nas', 'За нас'],
  ] as [string, string][],
  en: [
    ['#produkt', 'The Product'],
    ['#initsiatiви', 'Our Initiatives'],
    ['#za-nas', 'About'],
  ] as [string, string][],
};

export default function Nav() {
  const [lang, setLang] = useAtom(langAtom);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = navLinks[lang];

  return (
    <header
      id="nav-root"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: scrolled ? 'oklch(99% 0.008 75 / 0.96)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
        boxShadow: scrolled ? '0 1px 0 oklch(90% 0.02 80)' : 'none',
        transition: 'all 0.3s ease',
      }}
    >
      <nav
        style={{ padding: '0 clamp(20px, 4vw, 60px)' }}
        aria-label="Главна навигация"
      >
        <div
          style={{
            maxWidth: 1180,
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            height: 72,
            gap: 32,
          }}
        >
          {/* Logo */}
          <a
            href="#"
            style={{
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <Image
              src="/logo-nav.png"
              alt="ТЕПЕ bite лого"
              width={38}
              height={38}
              style={{ height: 38, width: 'auto', display: 'block' }}
            />
            <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  fontWeight: 600,
                  fontSize: '0.62rem',
                  letterSpacing: '0.14em',
                  color: 'var(--caramel)',
                  textTransform: 'uppercase',
                }}
              >
                bite
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-head)',
                  fontWeight: 700,
                  fontSize: '1.25rem',
                  color: 'var(--plum)',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.05,
                }}
              >
                ТЕПЕ
              </span>
            </span>
          </a>

          {/* Desktop links */}
          <div
            className="desktop-nav"
            style={{
              display: 'flex',
              gap: 32,
              marginLeft: 'auto',
              alignItems: 'center',
            }}
          >
            {links.map(([href, label]) => (
              <a
                key={href}
                href={href}
                style={{
                  textDecoration: 'none',
                  color: 'var(--text-mid)',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) =>
                  ((e.target as HTMLElement).style.color = 'var(--plum)')
                }
                onMouseLeave={(e) =>
                  ((e.target as HTMLElement).style.color = 'var(--text-mid)')
                }
              >
                {label}
              </a>
            ))}
          </div>

          {/* Lang switcher */}
          <div
            style={{
              display: 'flex',
              gap: 4,
              padding: '4px 8px',
              background: 'var(--surface2)',
              borderRadius: 100,
              fontSize: '0.8rem',
              fontWeight: 600,
              marginLeft: 'auto',
            }}
            className="desktop-nav"
          >
            {(['bg', 'en'] as Lang[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                style={{
                  padding: '4px 10px',
                  borderRadius: 100,
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.78rem',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  background: lang === l ? 'var(--plum)' : 'transparent',
                  color: lang === l ? 'white' : 'var(--text-soft)',
                  transition: 'all 0.2s',
                }}
              >
                {l}
              </button>
            ))}
          </div>

          {/* CTA - desktop */}
          <a
            href="#order"
            className="btn btn-primary desktop-nav"
            style={{ fontSize: '0.88rem', padding: '11px 22px' }}
          >
            {lang === 'bg' ? 'Поръчай' : 'Order'} <IconArrow />
          </a>

          {/* Mobile right group */}
          <div
            style={{
              display: 'none',
              marginLeft: 'auto',
              alignItems: 'center',
              gap: 12,
            }}
            className="hamburger"
          >
            {/* Lang switcher mobile */}
            <div
              style={{
                display: 'flex',
                gap: 4,
                padding: '4px 8px',
                background: 'var(--surface2)',
                borderRadius: 100,
              }}
            >
              {(['bg', 'en'] as Lang[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  style={{
                    padding: '3px 8px',
                    borderRadius: 100,
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '0.72rem',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    background: lang === l ? 'var(--plum)' : 'transparent',
                    color: lang === l ? 'white' : 'var(--text-soft)',
                    transition: 'all 0.2s',
                  }}
                >
                  {l}
                </button>
              ))}
            </div>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Затвори меню' : 'Отвори меню'}
              aria-expanded={mobileOpen}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--plum)',
                padding: 4,
                display: 'flex',
              }}
            >
              {mobileOpen ? <IconClose /> : <IconMenu />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div
            style={{
              background: 'var(--surface)',
              padding: '20px clamp(20px, 4vw, 60px) 28px',
              borderTop: '1px solid var(--border)',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}
          >
            {links.map(([href, label]) => (
              <a
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                style={{
                  textDecoration: 'none',
                  color: 'var(--plum)',
                  fontSize: '1.1rem',
                  fontWeight: 500,
                  padding: '8px 0',
                  borderBottom: '1px solid var(--border)',
                }}
              >
                {label}
              </a>
            ))}
            <a
              href="#order"
              onClick={() => setMobileOpen(false)}
              className="btn btn-primary"
              style={{ marginTop: 8, justifyContent: 'center' }}
            >
              <IconShop />
              {lang === 'bg' ? 'Поръчай' : 'Order'}
            </a>
          </div>
        )}
      </nav>
    </header>
  );
}
