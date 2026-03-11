import Image from "next/image";
import ScrollReveal from "@/components/ScrollReveal";
import { StaggerContainer, StaggerItem } from "@/components/StaggerGrid";

const WA_NUMBER = "919876543210";

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
						<div className="mt-4 flex flex-wrap gap-2">
							<button
								type="button"
								className="rounded-full bg-[#1f1410] px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#f7ede2] transition hover:bg-[#3a241a]"
							>
								Add to Cart
							</button>
							<a
								href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`Namaste! Mujhe yeh product order karna hai: ${product.name} (${product.price}). Please confirm availability. 🙏`)}`}
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center gap-1 rounded-full bg-[#25D366] px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-[#1ebe5d]"
							>
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
								Order
							</a>
						</div>
						</div>
					</StaggerItem>
				))}
			</StaggerContainer>
		</ScrollReveal>
	);
}
