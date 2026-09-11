import Hero from '../components/Hero';
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
    <main className="page-transition">
      <Hero />
      <NewDropSection />
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
