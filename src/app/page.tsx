import Providers from '@/components/Providers';
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import WhySection from '@/components/WhySection';
import ProductSection from '@/components/ProductSection';
import InitiativesPromo from '@/components/InitiativesPromo';
import FirstInitiative from '@/components/FirstInitiative';
import HowItHelps from '@/components/HowItHelps';
import TrustSection from '@/components/TrustSection';
import OrderCTA from '@/components/OrderCTA';
import Community from '@/components/Community';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <Providers>
      <Nav />
      <main>
        <Hero />
        <WhySection />
        <ProductSection />
        <InitiativesPromo />
        <FirstInitiative />
        <HowItHelps />
        <TrustSection />
        <OrderCTA />
        <Community />
      </main>
      <Footer />
    </Providers>
  );
}
