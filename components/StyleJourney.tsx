import ScrollReveal from "@/components/ScrollReveal";
import { StaggerContainer, StaggerItem } from "@/components/StaggerGrid";

const steps = [
	{ title: "Discover", text: "Browse fresh edits and trend-backed outfit stories." },
	{ title: "Try", text: "Check fits, materials, and styling combos for your mood." },
	{ title: "Own", text: "Get doorstep delivery or in-store pickup with support." },
];

export default function StyleJourney() {
	return (
		<ScrollReveal className="mx-auto w-full max-w-6xl px-4 py-12 md:px-8">
			<p className="text-xs uppercase tracking-[0.24em] text-[#8e6344]">Journey</p>
			<h2 className="display-font mt-2 text-3xl text-[#241710] md:text-4xl">How It Works</h2>
			<StaggerContainer className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
				{steps.map((step, idx) => (
					<StaggerItem key={step.title} className="soft-border glass-panel rounded-3xl p-6">
						<p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8e6344]">
							0{idx + 1}
						</p>
						<h3 className="mt-2 text-xl font-semibold text-[#241710]">{step.title}</h3>
						<p className="mt-2 text-sm leading-7 text-[#4a3a30]">{step.text}</p>
					</StaggerItem>
				))}
			</StaggerContainer>
		</ScrollReveal>
	);
}
