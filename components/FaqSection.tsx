import ScrollReveal from "@/components/ScrollReveal";

const faqs = [
	{
		q: "Do you offer returns?",
		a: "Yes, easy return within 7 days for unworn items with tags.",
	},
	{
		q: "Can I get size guidance?",
		a: "Yes, use our fit support on call or visit store for trial.",
	},
	{
		q: "Do you ship PAN India?",
		a: "Yes, standard and express options are available.",
	},
];

export default function FaqSection() {
	return (
		<ScrollReveal className="mx-auto w-full max-w-6xl px-4 py-12 md:px-8">
			<section className="rounded-3xl border border-[#e5d6c8] bg-[#fffaf3] p-6 md:p-8">
				<p className="text-xs uppercase tracking-[0.24em] text-[#8e6344]">FAQ</p>
				<h2 className="display-font mt-2 text-3xl text-[#241710] md:text-4xl">Common Questions</h2>
				<div className="mt-6 grid gap-4">
					{faqs.map((item) => (
						<div key={item.q} className="rounded-2xl border border-[#eadccf] bg-white p-4">
							<h3 className="text-sm font-semibold text-[#241710]">{item.q}</h3>
							<p className="mt-2 text-sm leading-7 text-[#4a3a30]">{item.a}</p>
						</div>
					))}
				</div>
			</section>
		</ScrollReveal>
	);
}
