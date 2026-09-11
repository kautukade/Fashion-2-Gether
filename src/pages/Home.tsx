import Hero from '../components/Hero';
import BrandStatement from '../components/BrandStatement';
import {
  NewDropSection,
  ShopByCategorySection,
  TrendingSection,
  InteractiveSection,
  ShopTheReelSection,
  BestSellersSection,
  EditorialSection,
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
      <BrandStatement />
      <div id="new-drop" className="scroll-mt-28">
        <NewDropSection />
      </div>
      <ShopByCategorySection />
      <TrendingSection />
      <InteractiveSection />
      <ShopTheReelSection />
      <BestSellersSection />
      <EditorialSection />
      <SaleSection />
      <CompleteTheLookSection />
      <ReviewsSection />
      <StoreSection />
      <NewsletterSection />
    </main>
  );
}
