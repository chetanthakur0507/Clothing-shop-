import ScrollReveal from "@/components/ScrollReveal";

const points = ["Alteration Support", "Style Consultation", "Gift Packaging", "Priority Delivery"];

export default function ServiceHighlights() {
	return (
		<ScrollReveal className="mx-auto w-full max-w-6xl px-4 py-10 md:px-8">
			<div className="rounded-3xl border border-[#e5d6c8] bg-white/70 px-6 py-6">
				<div className="flex flex-wrap gap-3">
					{points.map((point) => (
						<span
							key={point}
							className="rounded-full border border-[#d8c3b0] bg-[#fff7ee] px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#5c4234]"
						>
							{point}
						</span>
					))}
				</div>
			</div>
		</ScrollReveal>
	);
}
