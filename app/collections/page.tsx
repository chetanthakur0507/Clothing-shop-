import Image from "next/image";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import WhatsAppButton from "@/components/WhatsAppButton";

const collectionImages = [
	{
		title: "Festive Kurta Line",
		src: "https://images.unsplash.com/photo-1592878849122-5c207b8f0c3f?auto=format&fit=crop&w=1200&q=80",
	},
	{
		title: "Premium Menswear",
		src: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1200&q=80",
	},
	{
		title: "Modern Saree Edit",
		src: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80",
	},
	{
		title: "Casual Daily Wear",
		src: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1200&q=80",
	},
	{
		title: "Kids Color Pop",
		src: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=1200&q=80",
	},
	{
		title: "Wedding Specials",
		src: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=80",
	},
];

export default function CollectionsPage() {
	return (
		<main>
			<Navbar />
			<section className="mx-auto w-full max-w-6xl px-4 pb-8 pt-10 md:px-8">
				<p className="text-xs uppercase tracking-[0.3em] text-[#8e6344]">Collections</p>
				<h2 className="display-font mt-2 text-4xl text-[#241710] md:text-5xl">
					Explore Our Latest Looks
				</h2>
				<p className="mt-3 max-w-2xl text-sm leading-7 text-[#4a3a30] md:text-base">
					Shree Ram Readymade Showroom ki curated range, har season aur har function ke
					liye designed.
				</p>
			</section>

			<section className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-4 px-4 pb-12 md:grid-cols-3 md:px-8">
				{collectionImages.map((item, index) => (
					<article
						key={item.title}
						className="group relative overflow-hidden rounded-3xl border border-white/70 bg-[#f5e8d6] shadow-[0_16px_30px_rgba(34,18,8,0.16)]"
					>
						<div className={`relative ${index % 3 === 0 ? "h-80" : "h-64"}`}>
							<Image
								src={item.src}
								alt={item.title}
								fill
								unoptimized
								className="object-cover transition duration-500 group-hover:scale-105"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
							<div className="absolute bottom-4 left-4 right-4">
								<p className="display-font text-2xl text-white">{item.title}</p>
							</div>
						</div>
					</article>
				))}
			</section>
			<Footer />
			<WhatsAppButton />
		</main>
	);
}
