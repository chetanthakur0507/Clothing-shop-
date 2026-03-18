import AutoplayReviewSlider from "@/components/AutoplayReviewSlider";
import FaqSection from "@/components/FaqSection";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import TestimonialsSection from "@/components/TestimonialsSection";
import WhatsAppButton from "@/components/WhatsAppButton";

const reviewHighlights = [
	{ label: "Happy Shoppers", value: "12K+" },
	{ label: "Avg. Rating", value: "4.8/5" },
	{ label: "Repeat Customers", value: "78%" },
];

export default function ReviewsPage() {
	return (
		<main>
			<Navbar />
			<section className="mx-auto w-full max-w-6xl px-4 pb-8 pt-10 md:px-8">
				<div className="rounded-3xl border border-[#e5d6c8] bg-gradient-to-br from-[#fff7eb] via-[#f9ead6] to-[#f2dcc2] p-6 shadow-[0_20px_40px_rgba(36,23,16,0.12)] md:p-10">
					<p className="text-xs uppercase tracking-[0.3em] text-[#8e6344]">Reviews</p>
					<h2 className="display-font mt-2 text-4xl text-[#241710] md:text-5xl">
						Customer Love & Trust
					</h2>
					<p className="mt-3 max-w-2xl text-sm leading-7 text-[#4a3a30] md:text-base">
						Hamare regular shoppers ka real feedback aur common questions ek hi jagah.
					</p>

					<div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
						{reviewHighlights.map((item) => (
							<div
								key={item.label}
								className="rounded-2xl border border-[#ddc7a9] bg-[#fff5e7]/90 p-4 text-center"
							>
								<p className="display-font text-3xl text-[#3d271a]">{item.value}</p>
								<p className="mt-1 text-xs uppercase tracking-[0.2em] text-[#7c5538]">{item.label}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			<AutoplayReviewSlider />
			<TestimonialsSection />
			<FaqSection />
			<Footer />
			<WhatsAppButton />
		</main>
	);
}
