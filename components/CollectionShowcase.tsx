import ScrollReveal from "@/components/ScrollReveal";

export default function CollectionShowcase() {
	return (
		<ScrollReveal className="mx-auto w-full max-w-6xl px-4 py-12 md:px-8">
			<section className="grid grid-cols-1 gap-5 md:grid-cols-2">
				<article className="overflow-hidden rounded-3xl border border-white/60 bg-[#fff9f2] p-6">
					<p className="text-xs uppercase tracking-[0.24em] text-[#8e6344]">Collection A</p>
					<h3 className="display-font mt-2 text-3xl text-[#241710]">Street Craft</h3>
					<p className="mt-3 text-sm leading-7 text-[#4a3a30]">
						Relaxed silhouettes, dense cotton, and confident urban textures for everyday
						movement.
					</p>
				</article>
				<article className="overflow-hidden rounded-3xl border border-white/60 bg-[#f5eee4] p-6">
					<p className="text-xs uppercase tracking-[0.24em] text-[#8e6344]">Collection B</p>
					<h3 className="display-font mt-2 text-3xl text-[#241710]">Soft Formal</h3>
					<p className="mt-3 text-sm leading-7 text-[#4a3a30]">
						Tailored fits, neutral palettes, and event-ready drapes crafted for modern
						celebration nights.
					</p>
				</article>
			</section>
		</ScrollReveal>
	);
}
