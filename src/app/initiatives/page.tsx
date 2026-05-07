import type { Metadata } from 'next';
import Providers from '@/components/Providers';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import InitiativesClient from '@/components/InitiativesClient';
import { LANG_COOKIE, normalizeLang } from '@/store/lang';
import { cookies } from 'next/headers';

export const metadata: Metadata = {
  title: 'Нашите инициативи | ТЕПЕ bite',
  description:
    'ТЕПЕ bite е бранд от Пловдив за Пловдив. Вижте как подкрепяме инициативи за опазване, облагородяване и преоткриване на тепетата.',
  keywords: ['ТЕПЕ bite', 'инициативи', 'Пловдив', 'RE-CONNECT БУНАРДЖИКА', 'Бунарджика', 'социален проект'],
  openGraph: {
    title: 'Нашите инициативи | ТЕПЕ bite',
    description: 'ТЕПЕ bite е бранд от Пловдив за Пловдив. Вижте RE-CONNECT БУНАРДЖИКА — пилотен проект за облагородяване на тепетата.',
    type: 'website',
  },
  alternates: {
    languages: {
      bg: '/initiatives',
      en: '/initiatives',
    },
  },
};

export default async function InitiativesPage() {
  const cookieStore = await cookies();
  const initialLang = normalizeLang(cookieStore.get(LANG_COOKIE)?.value);

  return (
    <Providers initialLang={initialLang}>
      <Nav />
      <main>
        <InitiativesClient />
      </main>
      <Footer />
    </Providers>
  );
}
