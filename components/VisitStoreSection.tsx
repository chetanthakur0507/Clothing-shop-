import ScrollReveal from "@/components/ScrollReveal";

export default function VisitStoreSection() {
	return (
		<ScrollReveal className="mx-auto w-full max-w-6xl px-4 py-12 md:px-8">
			<section className="soft-border glass-panel rounded-3xl p-6 md:p-8">
				<p className="text-xs uppercase tracking-[0.24em] text-[#8e6344]">Visit Us</p>
				<h2 className="display-font mt-2 text-3xl text-[#241710] md:text-4xl">Store Experience</h2>
				<p className="mt-3 max-w-2xl text-sm leading-7 text-[#4a3a30]">
					Main Market Road, Near Central Chowk. Open all 7 days with in-store stylist
					support and curated outfit racks.
				</p>
				<div className="mt-5 flex flex-wrap gap-3">
					<button
						type="button"
						className="rounded-full bg-[#1f1410] px-5 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#f7ede2]"
					>
						Get Directions
					</button>
					<button
						type="button"
						className="rounded-full border border-[#2f2018] px-5 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#2f2018]"
					>
						Book Styling Slot
					</button>
				</div>
			</section>
		</ScrollReveal>
	);
}
