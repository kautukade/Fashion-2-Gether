import Hero from '../components/Hero';
import {
  FeaturedCollection,
  CategoryShowcase,
  NewArrivals,
  BrandExperience,
  BestSellers,
  EditorialCampaign,
  CustomerTestimonials,
  StoreVisit,
  Newsletter,
} from '../components/Sections';

export default function Home() {
  return (
    <main className="page-transition bg-cream">
      <Hero />
      <FeaturedCollection />
      <CategoryShowcase />
      <NewArrivals />
      <BrandExperience />
      <BestSellers />
      <EditorialCampaign />
      <CustomerTestimonials />
      <StoreVisit />
      <Newsletter />
    </main>
  );
}