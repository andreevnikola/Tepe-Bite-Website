import Community from "@/components/Community";
import FirstInitiative from "@/components/FirstInitiative";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import HowItHelps from "@/components/HowItHelps";
import InitiativesPromo from "@/components/InitiativesPromo";
import OrderCTA from "@/components/OrderCTA";
import ProductSection from "@/components/ProductSection";
import TrustSection from "@/components/TrustSection";
import WhySection from "@/components/WhySection";

export default function Home() {
  return (
    <>
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
    </>
  );
}
