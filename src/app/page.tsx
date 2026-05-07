import Community from "@/components/Community";
import FirstInitiative from "@/components/FirstInitiative";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import HowItHelps from "@/components/HowItHelps";
import InitiativesPromo from "@/components/InitiativesPromo";
import Nav from "@/components/Nav";
import OrderCTA from "@/components/OrderCTA";
import ProductSection from "@/components/ProductSection";
import Providers from "@/components/Providers";
import TrustSection from "@/components/TrustSection";
import WhySection from "@/components/WhySection";
import { LANG_COOKIE, normalizeLang } from "@/store/lang";
import { cookies } from "next/headers";

export default async function Home() {
  const cookieStore = await cookies();
  const initialLang = normalizeLang(cookieStore.get(LANG_COOKIE)?.value);

  return (
    <Providers initialLang={initialLang}>
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
