import ScrollReveal from "@/components/ScrollReveal";

export default function AnnouncementBar() {
	return (
		<ScrollReveal className="mx-auto w-full max-w-6xl px-4 pt-6 md:px-8">
			<div className="soft-border rounded-2xl bg-[#1f1410] px-5 py-3 text-center text-xs font-semibold uppercase tracking-[0.16em] text-[#f4e6d8]">
				Free shipping over Rs. 1,499 | Express Delivery in 24 Cities | New Drop Every Friday
			</div>
		</ScrollReveal>
	);
}
