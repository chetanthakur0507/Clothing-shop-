import ScrollReveal from "@/components/ScrollReveal";

export default function NewsletterSection() {
	return (
		<ScrollReveal className="mx-auto w-full max-w-6xl scroll-mt-28 px-4 py-12 md:px-8">
			<section id="contact">
			<div className="soft-border glass-panel rounded-3xl bg-gradient-to-r from-[#fff1dc] to-[#f5e5d7] px-6 py-10 md:px-10">
				<p className="text-xs uppercase tracking-[0.24em] text-[#8e6344]">Stay Updated</p>
				<h2 className="display-font mt-2 text-3xl text-[#241710] md:text-4xl">
					Get Weekly Style Drops
				</h2>
				<p className="mt-3 max-w-2xl text-sm leading-7 text-[#4a3a30]">
					Join our newsletter for early access deals, personalized styling picks, and
					exclusive member-only launches.
				</p>
				<form className="mt-6 flex flex-col gap-3 md:flex-row">
					<input
						type="email"
						placeholder="Enter your email"
						className="w-full rounded-full border border-[#d8c3b0] bg-white px-5 py-3 text-sm outline-none"
					/>
					<button
						type="button"
						className="rounded-full bg-[#1f1410] px-6 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#f7ede2]"
					>
						Subscribe
					</button>
				</form>
			</div>
			</section>
		</ScrollReveal>
	);
}
