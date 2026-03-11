import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import NewsletterSection from "@/components/NewsletterSection";
import VisitStoreSection from "@/components/VisitStoreSection";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function ContactPage() {
	return (
		<main>
			<Navbar />
			<section className="mx-auto w-full max-w-6xl px-4 pb-4 pt-10 md:px-8">
				<p className="text-xs uppercase tracking-[0.3em] text-[#8e6344]">Contact</p>
				<h2 className="display-font mt-2 text-4xl text-[#241710] md:text-5xl">
					Visit Store Ya WhatsApp Karein
				</h2>
				<p className="mt-3 max-w-2xl text-sm leading-7 text-[#4a3a30] md:text-base">
					Store timings, map location aur booking options yahan se directly access karein.
				</p>
			</section>
			<VisitStoreSection />
			<NewsletterSection />
			<Footer />
			<WhatsAppButton />
		</main>
	);
}
