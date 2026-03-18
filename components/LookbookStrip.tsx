import Image from "next/image";
import ScrollReveal from "@/components/ScrollReveal";

const lookbook = [
	"https://images.unsplash.com/photo-1564859228273-274232fdb516?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzh8fGNsb3RoaW5nfGVufDB8fDB8fHww",
	"https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=900&q=80",
	"https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8ODB8fGNsb3RoaW5nfGVufDB8fDB8fHww",
	"https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D%27",
	"https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80",
];

export default function LookbookStrip() {
	return (
		<ScrollReveal className="mx-auto w-full max-w-6xl px-4 py-10 md:px-8">
			<p className="text-xs uppercase tracking-[0.24em] text-[#8e6344]">Daily Lookbook</p>
			<h2 className="display-font mt-2 text-3xl text-[#241710] md:text-4xl">Style Reel</h2>
			<div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-5">
				{lookbook.map((image, index) => (
					<div
						key={image}
						className={`overflow-hidden rounded-2xl ${index === 0 || index === 4 ? "md:translate-y-5" : ""}`}
					>
						<Image
							src={image}
							alt="Lookbook"
							width={900}
							height={1100}
							unoptimized
							className="h-48 w-full object-cover md:h-64"
						/>
					</div>
				))}
			</div>
		</ScrollReveal>
	);
}
