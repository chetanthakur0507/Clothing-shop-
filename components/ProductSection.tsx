import Image from "next/image";
import ScrollReveal from "@/components/ScrollReveal";
import { StaggerContainer, StaggerItem } from "@/components/StaggerGrid";

const products = [
	{
		name: "Textured Overshirt",
		price: "Rs. 1,899",
		image:
			"https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=800&q=80",
	},
	{
		name: "Classic Denim Jacket",
		price: "Rs. 2,499",
		image:
			"https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80",
	},
	{
		name: "Softline Evening Dress",
		price: "Rs. 2,999",
		image:
			"https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80",
	},
];

export default function ProductSection() {
	return (
		<ScrollReveal className="mx-auto w-full max-w-6xl px-4 py-12 md:px-8">
			<div className="mb-7 flex items-end justify-between gap-3">
				<div>
					<p className="text-xs uppercase tracking-[0.25em] text-[#895f41]">Featured</p>
					<h2 className="display-font mt-2 text-3xl text-[#241710] md:text-4xl">
						Best Selling Pieces
					</h2>
				</div>
				<button
					type="button"
					className="rounded-full border border-[#2f2018] px-5 py-2 text-xs font-semibold uppercase tracking-[0.13em] text-[#2f2018] transition hover:-translate-y-0.5"
				>
					View All
				</button>
			</div>

			<StaggerContainer className="grid grid-cols-1 gap-6 md:grid-cols-3">
				{products.map((product) => (
					<StaggerItem
						key={product.name}
						className="soft-border glass-panel group overflow-hidden rounded-3xl p-3 transition duration-300 hover:-translate-y-1"
					>
						<div className="h-72 overflow-hidden rounded-2xl">
							<Image
								src={product.image}
								alt={product.name}
								width={800}
								height={960}
								className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
								unoptimized
							/>
						</div>
						<div className="px-2 pb-3 pt-4">
							<h3 className="text-lg font-semibold text-[#21130d]">{product.name}</h3>
							<p className="mt-1 text-sm font-semibold text-[#9c4b2c]">{product.price}</p>
							<button
								type="button"
								className="mt-4 rounded-full bg-[#1f1410] px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#f7ede2] transition hover:bg-[#3a241a]"
							>
								Add to Cart
							</button>
						</div>
					</StaggerItem>
				))}
			</StaggerContainer>
		</ScrollReveal>
	);
}
