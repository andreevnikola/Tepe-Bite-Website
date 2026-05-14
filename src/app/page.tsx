import Community from "@/components/Community";
import FirstInitiative from "@/components/FirstInitiative";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import HowItHelps from "@/components/HowItHelps";
import InitiativesPromo from "@/components/InitiativesPromo";
import NewsStrip from "@/components/NewsStrip";
import OrderCTA from "@/components/OrderCTA";
import ProductSection from "@/components/ProductSection";
import StoresSection from "@/components/StoresSection";
import TrustSection from "@/components/TrustSection";
import WhySection from "@/components/WhySection";
import { getAllNewsPosts } from "@/sanity/queries";

export default async function Home() {
  const allPosts = await getAllNewsPosts();
  const latestPosts = allPosts.slice(0, 4);

  return (
    <>
      <main>
        <Hero />
        <WhySection />
        {latestPosts.length > 0 && <NewsStrip posts={latestPosts} />}
        <ProductSection />
        <InitiativesPromo />
        <FirstInitiative />
        <HowItHelps />
        <TrustSection />
        <OrderCTA />
        <StoresSection />
        <Community />
      </main>
      <Footer />
    </>
  );
}
