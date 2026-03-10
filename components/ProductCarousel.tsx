"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useMemo, useRef } from "react";
import ScrollReveal from "@/components/ScrollReveal";

const carouselItems = [
	{
		title: "Urban Layer Set",
		price: "Rs. 2,190",
		image:
			"https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=900&q=80",
	},
	{
		title: "Neutral Knit Wear",
		price: "Rs. 1,760",
		image:
			"https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=900&q=80",
	},
	{
		title: "Premium Street Fit",
		price: "Rs. 2,420",
		image:
			"https://images.unsplash.com/photo-1495385794356-15371f348c31?auto=format&fit=crop&w=900&q=80",
	},
	{
		title: "Weekend Denim Duo",
		price: "Rs. 2,080",
		image:
			"https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=900&q=80",
	},
	{
		title: "Fluid Evening Cut",
		price: "Rs. 3,150",
		image:
			"https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80",
	},
];

export default function ProductCarousel() {
	const trackRef = useRef<HTMLDivElement>(null);
	const autoplayRef = useRef<NodeJS.Timeout | null>(null);
	const items = useMemo(() => [...carouselItems, ...carouselItems], []);

	useEffect(() => {
		const node = trackRef.current;
		if (!node) return;

		const runAutoplay = () => {
			autoplayRef.current = setInterval(() => {
				if (!trackRef.current) return;
				const target = trackRef.current;
				const loopEdge = target.scrollWidth / 2;

				if (target.scrollLeft >= loopEdge - 10) {
					target.scrollLeft = 0;
				}

				target.scrollBy({ left: target.clientWidth * 0.38, behavior: "smooth" });
			}, 2600);
		};

		const stopAutoplay = () => {
			if (autoplayRef.current) clearInterval(autoplayRef.current);
		};

		runAutoplay();
		node.addEventListener("mouseenter", stopAutoplay);
		node.addEventListener("mouseleave", runAutoplay);

		return () => {
			stopAutoplay();
			node.removeEventListener("mouseenter", stopAutoplay);
			node.removeEventListener("mouseleave", runAutoplay);
		};
	}, []);

	const scrollByCard = (direction: "left" | "right") => {
		if (!trackRef.current) return;
		const loopEdge = trackRef.current.scrollWidth / 2;
		if (trackRef.current.scrollLeft >= loopEdge - 10) {
			trackRef.current.scrollLeft = 0;
		}
		const amount = trackRef.current.clientWidth * 0.72;
		trackRef.current.scrollBy({
			left: direction === "right" ? amount : -amount,
			behavior: "smooth",
		});
	};

	return (
		<ScrollReveal className="mx-auto w-full max-w-6xl px-4 py-12 md:px-8">
			<section id="carousel" className="scroll-mt-28">
			<div className="mb-6 flex items-center justify-between gap-3">
				<div>
					<p className="text-xs uppercase tracking-[0.24em] text-[#8e6344]">Carousel</p>
					<h2 className="display-font mt-2 text-3xl text-[#241710] md:text-4xl">
						Trending Rotation
					</h2>
				</div>
				<div className="flex gap-2">
					<button
						type="button"
						onClick={() => scrollByCard("left")}
						className="rounded-full border border-[#2f2018] px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#2f2018]"
					>
						Prev
					</button>
					<button
						type="button"
						onClick={() => scrollByCard("right")}
						className="rounded-full bg-[#1f1410] px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#f7ede2]"
					>
						Next
					</button>
				</div>
			</div>

			<div
				ref={trackRef}
				className="hide-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2"
			>
				{items.map((item, index) => (
					<motion.article
						key={`${item.title}-${index}`}
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.45, delay: index * 0.06 }}
						className="soft-border glass-panel min-w-[78%] snap-start rounded-3xl p-3 md:min-w-[34%]"
					>
						<div className="relative h-80 overflow-hidden rounded-2xl">
							<Image
								src={item.image}
								alt={item.title}
								width={900}
								height={1200}
								unoptimized
								className="h-full w-full object-cover"
							/>
						</div>
						<div className="px-2 pb-2 pt-4">
							<h3 className="text-lg font-semibold text-[#1e130d]">{item.title}</h3>
							<p className="mt-1 text-sm font-semibold text-[#9d4b2d]">{item.price}</p>
						</div>
					</motion.article>
				))}
			</div>
			</section>
		</ScrollReveal>
	);
}
