import Image from "next/image";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import WhatsAppButton from "@/components/WhatsAppButton";

const collectionImages = [
	// 20 curated items with stable Unsplash image IDs
	{ title: "Classic Denim Rack", category: "Casual", src: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=1200&q=80&auto=format&fit=crop", price: "₹1,299 - ₹2,999" },
	{ title: "Modern Streetwear", category: "Casual", src: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&q=80&auto=format&fit=crop", price: "₹999 - ₹2,499" },
	{ title: "Minimal T-Shirt Edit", category: "Casual", src: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1200&q=80&auto=format&fit=crop", price: "₹499 - ₹1,499" },
	{ title: "Luxury Formal Looks", category: "Formal", src: "https://images.unsplash.com/photo-1727835523550-18478cacefa2?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", price: "₹2,999 - ₹8,999" },
	{ title: "Office Shirt Collection", category: "Formal", src: "https://images.unsplash.com/photo-1655288828238-21d86ec971c3?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8a3VydGF8ZW58MHx8MHx8fDA%3D", price: "₹899 - ₹2,299" },
	{ title: "Premium Suit Line", category: "Formal", src: "https://images.unsplash.com/photo-1542327897-d73f4005b533?w=1200&q=80&auto=format&fit=crop", price: "₹4,999 - ₹14,999" },
	{ title: "Women Summer Edit", category: "Women", src: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=1200&q=80&auto=format&fit=crop", price: "₹1,199 - ₹3,799" },
	{ title: "Elegant Dress Studio", category: "Women", src: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&q=80&auto=format&fit=crop", price: "₹1,499 - ₹4,999" },
	{ title: "Chic Everyday Wear", category: "Women", src: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=80&auto=format&fit=crop", price: "₹799 - ₹2,299" },
	{ title: "Ethnic Festive Mood", category: "Traditional", src: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1200&q=80&auto=format&fit=crop", price: "₹1,899 - ₹5,999" },
	{ title: "Wedding Guest Special", category: "Special Occasion", src: "https://images.unsplash.com/photo-1464863979621-258859e62245?w=1200&q=80&auto=format&fit=crop", price: "₹2,499 - ₹7,999" },
	{ title: "Party Night Collection", category: "Special Occasion", src: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=1200&q=80&auto=format&fit=crop", price: "₹1,999 - ₹6,999" },
	{ title: "Kids Fun Fashion", category: "Children", src: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=1200&q=80&auto=format&fit=crop", price: "₹499 - ₹1,699" },
	{ title: "Kids Festive Picks", category: "Children", src: "https://images.unsplash.com/photo-1571210862729-78a52d3779a2?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGtpZHN8ZW58MHx8MHx8fDA%3D", price: "₹699 - ₹1,999" },
	{ title: "Winter Layer Drop", category: "Seasonal", src: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=1200&q=80&auto=format&fit=crop", price: "₹1,299 - ₹3,999" },
	{ title: "Summer Lightwear", category: "Seasonal", src: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&q=80&auto=format&fit=crop", price: "₹699 - ₹2,199" },
	{ title: "Sneaker & Street Shoes", category: "Seasonal", src: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=80&auto=format&fit=crop", price: "₹1,199 - ₹3,499" },
	{ title: "Upper Shirt", category: "Formal", src: "https://images.unsplash.com/photo-1740711152088-88a009e877bb?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8c2hpcnR8ZW58MHx8MHx8fDA%3D", price: "₹1,499 - ₹4,299" },
	{ title: "Smart Layer Jackets", category: "Casual", src: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c2hpcnR8ZW58MHx8MHx8fDA%3D", price: "₹1,999 - ₹5,499" },
	{ title: "Modern Closet Essentials", category: "Women", src: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80&auto=format&fit=crop", price: "₹899 - ₹3,299" },
];

export default function CollectionsPage() {
	return (
		<main>
			<Navbar />
			
			{/* Hero Section */}
			<section className="mx-auto w-full max-w-6xl px-4 pb-12 pt-16 md:px-8 md:pb-16">
				<div className="space-y-4">
					<p className="text-xs uppercase tracking-[0.3em] text-[#8e6344] font-semibold">Our Collections</p>
					<h1 className="display-font text-5xl md:text-6xl text-[#241710] leading-tight">
						Explore Our Latest Looks
					</h1>
					{/* <p className="mt-6 max-w-3xl text-base md:text-lg leading-8 text-[#4a3a30]">
						Shree Ram Readymade Showroom की curated range, har season aur har function ke liye specially designed. Traditional से लेकर Modern, हर style ke liye perfect collection.
					</p> */}
				</div>
			</section>

			{/* Collections Grid */}
			<section className="mx-auto w-full max-w-6xl px-4 pb-16 md:px-8">
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
					{collectionImages.map((item, index) => (
						<article
							key={item.title}
							className={`group relative overflow-hidden rounded-2xl bg-[#f5e8d6] border border-[#e5d6c8] shadow-[0_8px_20px_rgba(34,18,8,0.12)] hover:shadow-[0_16px_40px_rgba(34,18,8,0.2)] transition-all duration-500 ${
								index % 5 === 0 ? "lg:col-span-2 lg:row-span-2" : ""
							}`}
						>
							{/* Image Container */}
							<div className={`relative overflow-hidden ${index % 5 === 0 ? "h-96" : "h-72"}`}>
								<Image
									src={item.src}
									alt={item.title}
									fill
									sizes={index % 5 === 0 ? "(max-width: 768px) 100vw, 66vw" : "33vw"}
									priority={index < 3}
									className="object-cover transition-transform duration-700 group-hover:scale-110"
								/>
								
								{/* Overlay Gradient */}
								<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
								
								{/* Category Badge */}
								<div className="absolute top-4 right-4">
									<span className="inline-block px-4 py-1.5 bg-[#d6b56d]/95 text-[#241710] text-xs font-bold uppercase tracking-wider rounded-full backdrop-blur-sm">
										{item.category}
									</span>
								</div>
							</div>

							{/* Content Area */}
							<div className="p-5 md:p-6">
								<h3 className="display-font text-2xl md:text-2xl text-[#241710] group-hover:text-[#8e6344] transition-colors duration-300">
									{item.title}
								</h3>
								<p className="mt-3 text-base font-semibold text-[#7c5538] tracking-tight">
									{item.price}
								</p>
								<button className="mt-4 px-5 py-2.5 bg-gradient-to-r from-[#3d271a] via-[#7c5538] to-[#24160f] text-[#f8edd5] text-sm font-bold uppercase tracking-[0.08em] rounded-lg hover:shadow-lg transition-all duration-300 group-hover:scale-105">
									Shop Now
								</button>
							</div>
						</article>
					))}
				</div>
			</section>

			{/* CTA Section */}
			<section className="mx-auto w-full max-w-6xl px-4 py-12 md:py-16 md:px-8">
				<div className="rounded-3xl bg-gradient-to-br from-[#3d271a]/90 via-[#7c5538]/85 to-[#24160f]/90 p-8 md:p-12 text-center border border-[#d6b56d]/30">
					<p className="text-xs uppercase tracking-[0.3em] text-[#d6b56d] font-semibold">Limited Time</p>
					<h2 className="display-font mt-3 text-3xl md:text-4xl text-[#f8edd5]">
						Explore Full Range
					</h2>
					<p className="mt-4 text-[#f6ece2] max-w-2xl mx-auto">
						Har product handpicked quality ke saath. WhatsApp karke custom orders place karein.
					</p>
					<a 
						href="https://wa.me/918076210068?text=Namaste! Mujhe Shree Ram Readymade Showroom ke products dekhne hain."
						target="_blank"
						rel="noopener noreferrer"
						className="inline-block mt-6 px-8 py-3 bg-[#d6b56d] text-[#241710] font-bold uppercase tracking-widest rounded-lg hover:bg-[#e5d6c8] transition-all duration-300 hover:shadow-lg"
					>
						Order via WhatsApp
					</a>
				</div>
			</section>

			<Footer />
			<WhatsAppButton />
		</main>
	);
}


