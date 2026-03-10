import ScrollReveal from "@/components/ScrollReveal";
import { StaggerContainer, StaggerItem } from "@/components/StaggerGrid";

const testimonials = [
	{
		name: "Rhea Malhotra",
		quote: "Fabric quality is excellent and the fitting feels tailor-made every time.",
	},
	{
		name: "Arjun Singh",
		quote: "Their curated drops save me time. I just walk in and pick complete looks.",
	},
	{
		name: "Naina Kapoor",
		quote: "Loved the color combinations and styling advice, super premium experience.",
	},
];

export default function TestimonialsSection() {
	return (
		<ScrollReveal className="mx-auto w-full max-w-6xl scroll-mt-28 px-4 py-12 md:px-8">
			<section id="reviews">
			<p className="text-xs uppercase tracking-[0.24em] text-[#8e6344]">Voices</p>
			<h2 className="display-font mt-2 text-3xl text-[#241710] md:text-4xl">
				What Shoppers Say
			</h2>
			<StaggerContainer className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
				{testimonials.map((item) => (
					<StaggerItem
						key={item.name}
						className="soft-border glass-panel rounded-3xl p-6"
					>
						<p className="text-sm leading-7 text-[#3f3027]">
							<span aria-hidden="true">&ldquo;</span>
							{item.quote}
							<span aria-hidden="true">&rdquo;</span>
						</p>
						<p className="mt-4 text-sm font-semibold text-[#241710]">{item.name}</p>
					</StaggerItem>
				))}
			</StaggerContainer>
			</section>
		</ScrollReveal>
	);
}
