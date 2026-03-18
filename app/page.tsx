import AnnouncementBar from "@/components/AnnouncementBar";
import BrandStats from "@/components/BrandStats";
import CategoryCards from "@/components/CategoryCards";
import CollectionShowcase from "@/components/CollectionShowcase";
import DealOfWeek from "@/components/DealOfWeek";
import FaqSection from "@/components/FaqSection";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import LookbookStrip from "@/components/LookbookStrip";
import Navbar from "@/components/Navbar";
import NewsletterSection from "@/components/NewsletterSection";
import ParallaxShowcase from "@/components/ParallaxShowcase";
import ProductGallery from "@/components/ProductGallery";
import ProductSection from "@/components/ProductSection";
import ServiceHighlights from "@/components/ServiceHighlights";
import SeasonBanner from "@/components/SeasonBanner";
import StyleJourney from "@/components/StyleJourney";
import TestimonialsSection from "@/components/TestimonialsSection";
import VisitStoreSection from "@/components/VisitStoreSection";
import WhatsAppButton from "@/components/WhatsAppButton";
import ProductCarousel from "@/components/ProductCarousel";

export default function Home() {
	return (
		<main>
			<Navbar />
			<AnnouncementBar />
			<HeroSection />
			<BrandStats />
			<ServiceHighlights />
			<CategoryCards />
			<CollectionShowcase />
			<LookbookStrip />
			<StyleJourney />
			<ParallaxShowcase />
			<DealOfWeek />
			<ProductSection />
			<ProductGallery />
			<SeasonBanner />
			<TestimonialsSection />
			<ProductCarousel />
			<NewsletterSection />
			<FaqSection />
			<VisitStoreSection />
			<Footer />
			<WhatsAppButton />
		</main>
	);
}
