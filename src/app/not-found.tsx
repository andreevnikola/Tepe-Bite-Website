import type { Metadata } from 'next';
import Link from 'next/link';
import { cookies } from 'next/headers';
import Footer from '@/components/Footer';
import Nav from '@/components/Nav';
import Providers from '@/components/Providers';
import { LANG_COOKIE, normalizeLang } from '@/store/lang';

export const metadata: Metadata = {
  title: '404 | ТЕПЕ bite',
  description: 'Страницата не е намерена.',
};

export default async function NotFound() {
  const cookieStore = await cookies();
  const lang = normalizeLang(cookieStore.get(LANG_COOKIE)?.value);

  const text =
    lang === 'bg'
      ? {
          tag: '404 — Страницата липсва',
          title: 'Тук май няма нищо вкусно... засега.',
          body: 'Линкът е невалиден или страницата е преместена. Върни се към началото и продължи към продукта или инициативите.',
          home: 'Към началото',
          product: 'Виж продукта',
        }
      : {
          tag: '404 — Page not found',
          title: "Looks like there's nothing tasty here... yet.",
          body: 'The link is invalid or the page has moved. Head back to the homepage and continue to the product or initiatives.',
          home: 'Back to home',
          product: 'View product',
        };

  return (
    <Providers initialLang={lang}>
      <Nav />
      <main
        className="section-spacing"
        style={{
          minHeight: 'min(100dvh, 920px)',
          display: 'grid',
          alignItems: 'center',
          paddingTop: 'clamp(112px, 14vw, 160px)',
        }}
      >
        <div className="section-inner">
          <section
            className="card"
            style={{
              textAlign: 'center',
              padding: 'clamp(32px, 6vw, 72px)',
              maxWidth: 760,
              margin: '0 auto',
            }}
          >
            <p className="label-tag" style={{ marginBottom: 14 }}>
              {text.tag}
            </p>
            <h1 className="heading-lg" style={{ marginBottom: 16 }}>
              {text.title}
            </h1>
            <div className="section-divider" />
            <p
              style={{
                maxWidth: 560,
                margin: '0 auto 28px',
                fontSize: '1rem',
              }}
            >
              {text.body}
            </p>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: 12,
                flexWrap: 'wrap',
              }}
            >
              <Link href="/" className="btn btn-primary">
                {text.home}
              </Link>
              <Link href="/product" className="btn btn-secondary">
                {text.product}
              </Link>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </Providers>
  );
}
