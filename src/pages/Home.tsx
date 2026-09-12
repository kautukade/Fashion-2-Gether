import Hero from '../components/Hero';
import { FashionMarquee, StyleUniverse, CampaignSpotlight } from '../components/PremiumHomeExtras';
import {
  NewDropSection,
  ShopByCategorySection,
  TrendingSection,
  InteractiveSection,
  ShopTheReelSection,
  BestSellersSection,
  SaleSection,
  CompleteTheLookSection,
  ReviewsSection,
  StoreSection,
  NewsletterSection,
} from '../components/Sections';

export default function Home() {
  return (
    <main className="page-transition overflow-hidden">
      <Hero />
      <FashionMarquee />
      <div id="new-drop" className="scroll-mt-28">
        <NewDropSection />
      </div>
      <StyleUniverse />
      <ShopByCategorySection />
      <ShopTheReelSection />
      <InteractiveSection />
      <TrendingSection />
      <CampaignSpotlight />
      <BestSellersSection />
      <SaleSection />
      <CompleteTheLookSection />
      <ReviewsSection />
      <StoreSection />
      <FashionMarquee />
      <NewsletterSection />
    </main>
  );
}
