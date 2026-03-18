import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import WhatsAppButton from "@/components/WhatsAppButton";

const lookbookEntries = [
	{
		title: "Urban Layer Set",
		tagline: "Street-ready texture mix",
		src: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1400&q=80&auto=format&fit=crop",
	},
	{
		title: "Gold Hour Tailoring",
		tagline: "Sharp lines, soft drape",
		src: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1400&q=80&auto=format&fit=crop",
	},
	{
		title: "Monochrome Motion",
		tagline: "Minimal tones, maximum impact",
		src: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1400&q=80&auto=format&fit=crop",
	},
	{
		title: "Weekend Soft Edit",
		tagline: "Relaxed silhouettes",
		src: "https://images.unsplash.com/photo-1464863979621-258859e62245?w=1400&q=80&auto=format&fit=crop",
	},
	{
		title: "Runway Casual",
		tagline: "Signature layering play",
		src: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=1400&q=80&auto=format&fit=crop",
	},
	{
		title: "Minimal Linen Mood",
		tagline: "Breathable and premium",
		src: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1400&q=80&auto=format&fit=crop",
	},
];

export default function LookbookPage() {
	return (
		<main>
			<Navbar />

			<section className="mx-auto w-full max-w-6xl px-4 pb-8 pt-10 md:px-8">
				<p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#8e6344]">Lookbook</p>
				<h1 className="display-font mt-2 text-4xl leading-tight text-[#241710] md:text-6xl">
					Curated Looks For Every Moment
				</h1>
				<p className="mt-4 max-w-3xl text-sm leading-7 text-[#4a3a30] md:text-base">
					Editorial styling ideas from our latest showroom drop. Pick a mood, explore the
					fit, and jump to collections when you are ready to shop.
				</p>
				<div className="mt-6 flex flex-wrap gap-3">
					<Link
						href="/collections"
						className="rounded-full bg-[#3d271a] px-6 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#f8edd5] transition duration-300 hover:-translate-y-0.5 hover:bg-[#6f4a31]"
					>
						Shop Collections
					</Link>
					<a
						href="https://wa.me/918076210068?text=Namaste! Mujhe lookbook style ke outfits chahiye."
						target="_blank"
						rel="noopener noreferrer"
						className="rounded-full border border-[#7c5538]/40 bg-[#fff4e5] px-6 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#3d271a] transition duration-300 hover:-translate-y-0.5"
					>
						Get Styling Help
					</a>
				</div>
			</section>

			<section className="mx-auto w-full max-w-6xl px-4 pb-16 md:px-8">
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
					{lookbookEntries.map((entry, index) => (
						<article
							key={entry.title}
							className={`group relative overflow-hidden rounded-3xl border border-[#e5d6c8] bg-[#f8ecd8] shadow-[0_14px_32px_rgba(36,23,16,0.14)] ${
								index % 3 === 0 ? "md:col-span-2" : ""
							}`}
						>
							<div className={`relative ${index % 3 === 0 ? "h-[22rem]" : "h-80"}`}>
								<Image
									src={entry.src}
									alt={entry.title}
									fill
									sizes={index % 3 === 0 ? "(max-width: 768px) 100vw, 80vw" : "(max-width: 768px) 100vw, 40vw"}
									className="object-cover transition duration-700 group-hover:scale-105"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
								<div className="absolute bottom-0 left-0 w-full p-6 text-white">
									<p className="text-[10px] uppercase tracking-[0.24em] text-[#f6dcb1]">Look {String(index + 1).padStart(2, "0")}</p>
									<h2 className="display-font mt-2 text-3xl leading-tight md:text-4xl">{entry.title}</h2>
									<p className="mt-2 text-sm text-[#f9ebdc]">{entry.tagline}</p>
								</div>
							</div>
						</article>
					))}
				</div>
			</section>

			<Footer />
			<WhatsAppButton />
		</main>
	);
}
