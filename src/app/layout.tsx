import type { Metadata } from 'next';
import { Playfair_Display, DM_Sans } from 'next/font/google';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '600', '700', '900'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-dm-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ТЕПЕ bite — Барче с характер от Пловдив',
  description:
    'ТЕПЕ bite е барче със солен карамел, създадено в Пловдив — с ниско съдържание на нетни въглехидрати, високо съдържание на фибри и мисия зад всяка покупка.',
  keywords: ['ТЕПЕ bite', 'протеинова закуска', 'солен карамел', 'Пловдив', 'low carb'],
  openGraph: {
    title: 'ТЕПЕ bite — Барче с характер от Пловдив',
    description: 'Вкусно за теб. Смислено за общността.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="bg"
      className={`${playfair.variable} ${dmSans.variable}`}
      style={
        {
          '--font-head': 'var(--font-playfair), Georgia, serif',
          '--font-body': 'var(--font-dm-sans), system-ui, sans-serif',
        } as React.CSSProperties
      }
    >
      <body>{children}</body>
    </html>
  );
}
