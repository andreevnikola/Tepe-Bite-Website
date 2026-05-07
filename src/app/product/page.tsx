import type { Metadata } from 'next';
import Providers from '@/components/Providers';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import ProductPageContent from '@/components/ProductPageContent';

export const metadata: Metadata = {
  title: 'ТЕПЕ bite — Солен карамел | Здравословно барче с кауза',
  description:
    'ТЕПЕ bite е нисковъглехидратно барче със солен карамел, създадено в Пловдив — с фибри, растителен протеин и мисия зад всяка покупка.',
  keywords: [
    'ТЕПЕ bite',
    'солен карамел',
    'кето барче',
    'нисковъглехидратно',
    'Пловдив',
    'BioStyle',
    'протеинова закуска',
  ],
  openGraph: {
    title: 'ТЕПЕ bite — Солен карамел | Здравословно барче с кауза',
    description:
      'ТЕПЕ bite е нисковъглехидратно барче със солен карамел, създадено в Пловдив — с фибри, растителен протеин и мисия зад всяка покупка.',
    type: 'website',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'ТЕПЕ bite — Солен карамел',
  brand: {
    '@type': 'Brand',
    name: 'ТЕПЕ bite',
  },
  manufacturer: {
    '@type': 'Organization',
    name: 'BioStyle Ltd.',
  },
  description:
    'Нисковъглехидратно барче със солен карамел, създадено в Пловдив — с фибри, растителен протеин, ядки и семена.',
  weight: {
    '@type': 'QuantitativeValue',
    value: 40,
    unitCode: 'GRM',
  },
};

export default function ProductPage() {
  return (
    <Providers>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Nav />
      <main>
        <ProductPageContent />
      </main>
      <Footer />
    </Providers>
  );
}
