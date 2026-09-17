import { Hero } from "@/components/landing/Hero";
import { TrustSignals } from "@/components/landing/TrustSignals";
import { Catalogue } from "@/components/landing/Catalogue";
import { Pricing } from "@/components/landing/Pricing";
import { FaqPreview } from "@/components/landing/FaqPreview";

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <TrustSignals />
      <Catalogue />
      <Pricing />
      <FaqPreview />
    </main>
  );
}
