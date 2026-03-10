import ScrollReveal from "@/components/ScrollReveal";

export default function SeasonBanner() {
	return (
		<ScrollReveal>
			<section
				className="parallax-band relative my-6 flex min-h-[44vh] items-center justify-center overflow-hidden"
				style={{
					backgroundImage:
						"linear-gradient(110deg, rgba(24,17,13,0.65), rgba(24,17,13,0.3)), url('https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1800&q=80')",
				}}
			>
				<div className="mx-4 w-full max-w-4xl rounded-3xl border border-white/25 bg-black/30 p-8 text-center text-white backdrop-blur-md md:p-12">
					<p className="text-xs uppercase tracking-[0.3em] text-[#f8d38f]">Season Special</p>
					<h2 className="display-font mt-3 text-4xl md:text-5xl">Winter Luxe Layers</h2>
					<p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#f6ece2] md:text-base">
						Soft wool, clean cuts, and statement outerwear curated for your premium
						winter wardrobe.
					</p>
				</div>
			</section>
		</ScrollReveal>
	);
}
