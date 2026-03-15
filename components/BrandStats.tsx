import ScrollReveal from "@/components/ScrollReveal";
import { StaggerContainer, StaggerItem } from "@/components/StaggerGrid";

const stats = [
	{ label: "Happy Shoppers", value: "12K+" },
	{ label: "Fresh Styles / Month", value: "240+" },
	{ label: "Cities Delivered", value: "85" },
	{ label: "Avg. Rating", value: "4.8/5" },
];

export default function BrandStats() {
	return (
		<ScrollReveal className="mx-auto w-full max-w-6xl px-4 py-10 md:px-8">
			<div className="soft-border glass-panel rounded-3xl px-6 py-8 md:px-10">
				<p className="text-xs uppercase tracking-[0.24em] text-[#8e6344]">At An Glance</p>
				<StaggerContainer className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
					{stats.map((stat) => (
						<StaggerItem
							key={stat.label}
							className="rounded-2xl border border-[#e5d6c8] bg-white/70 p-4"
						>
							<p className="display-font text-3xl text-[#26150f]">{stat.value}</p>
							<p className="mt-1 text-xs uppercase tracking-[0.12em] text-[#6f5241]">
								{stat.label}
							</p>
						</StaggerItem>
					))}
				</StaggerContainer>
			</div>
		</ScrollReveal>
	);
}
