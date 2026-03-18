"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import ScrollReveal from "@/components/ScrollReveal";

const galleryItems = [
	{
		src: "https://images.unsplash.com/photo-1646723774959-7ff2f39b252f?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGNsb3RoaW5nJTIwYmFnZ3klMjBsb2trfGVufDB8fDB8fHww",
		label: "Textured Casual Wear",
	},
	{
		src: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80",
		label: "Classic Denim Jacket",
	},
	{
		src: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80",
		label: "Softline Evening Dress",
	},
	{
		src: "https://images.unsplash.com/photo-1693930446116-3434cbc30e57?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		label: "Urban Layer Set",
	},
	{
		src: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=800&q=80",
		label: "Neutral Knit Wear",
	},
	{
		src: "https://images.unsplash.com/photo-1495385794356-15371f348c31?auto=format&fit=crop&w=800&q=80",
		label: "Premium Street Fit",
	},
	{
		src: "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=800&q=80",
		label: "Weekend Denim Duo",
	},
	{
		src: "https://plus.unsplash.com/premium_photo-1673977134363-c86a9d5dcafa?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZGVuaW0lMjBqZWFuc3xlbnwwfHwwfHx8MA%3D%3D",
		label: "Fluid Evening Cut",
	},
];

export default function ProductGallery() {
	const [selected, setSelected] = useState<number | null>(null);

	const prev = () =>
		setSelected((s) =>
			s === null ? null : (s - 1 + galleryItems.length) % galleryItems.length,
		);

	const next = () =>
		setSelected((s) => (s === null ? null : (s + 1) % galleryItems.length));

	return (
		<>
			<ScrollReveal className="mx-auto w-full max-w-6xl px-4 py-12 md:px-8">
				<div className="mb-7">
					<p className="text-xs uppercase tracking-[0.25em] text-[#895f41]">Gallery</p>
					<h2 className="display-font mt-2 text-3xl text-[#241710] md:text-4xl">
						Our Collection Gallery
					</h2>
					<p className="mt-2 text-sm text-[#5a4535]">
						Click any photo to view full size
					</p>
				</div>

				{/* Masonry-style grid: first item tall (row-span-2), 5th item wide (col-span-2 on mobile) */}
				<div className="grid grid-cols-2 gap-3 md:grid-cols-3">
					{galleryItems.map((item, i) => (
						<motion.div
							key={item.src}
							whileHover={{ scale: 1.02 }}
							transition={{ duration: 0.22 }}
							onClick={() => setSelected(i)}
							className={[
								"group relative cursor-pointer overflow-hidden rounded-2xl soft-border",
								i === 0 ? "row-span-2" : "",
								i === 4 ? "col-span-2 md:col-span-1" : "",
							]
								.join(" ")
								.trim()}
						>
							<Image
								src={item.src}
								alt={item.label}
								width={800}
								height={i === 0 ? 900 : 450}
								className="h-full min-h-[160px] w-full object-cover opacity-95 transition duration-500 group-hover:opacity-80"
								unoptimized
							/>
							{/* Label overlay on hover */}
							<div className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/70 to-transparent px-3 pb-3 pt-10 transition duration-300 group-hover:translate-y-0">
								<p className="text-xs font-semibold text-white">{item.label}</p>
							</div>
						</motion.div>
					))}
				</div>
			</ScrollReveal>

			{/* Lightbox */}
			<AnimatePresence>
				{selected !== null && (
					<motion.div
						key="lightbox-backdrop"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.22 }}
						className="fixed inset-0 z-50 flex items-center justify-center bg-black/88 p-4 backdrop-blur-sm"
						onClick={() => setSelected(null)}
					>
						<motion.div
							initial={{ scale: 0.88, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0.88, opacity: 0 }}
							transition={{ duration: 0.22 }}
							className="relative max-h-[90vh] max-w-[92vw] overflow-hidden rounded-3xl shadow-2xl"
							onClick={(e) => e.stopPropagation()}
						>
							<Image
								src={galleryItems[selected].src}
								alt={galleryItems[selected].label}
								width={900}
								height={1100}
								className="block max-h-[82vh] max-w-[88vw] w-auto object-contain"
								unoptimized
							/>

							{/* Label */}
							<div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-5 py-4">
								<p className="text-sm font-semibold text-white">
									{galleryItems[selected].label}
								</p>
								<p className="text-xs text-white/60">
									{selected + 1} / {galleryItems.length}
								</p>
							</div>

							{/* Close */}
							<button
								onClick={() => setSelected(null)}
								className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/55 text-lg text-white transition hover:bg-black/80"
								aria-label="Close gallery"
							>
								✕
							</button>

							{/* Prev */}
							<button
								onClick={prev}
								className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/55 text-2xl text-white transition hover:bg-black/80"
								aria-label="Previous image"
							>
								‹
							</button>

							{/* Next */}
							<button
								onClick={next}
								className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/55 text-2xl text-white transition hover:bg-black/80"
								aria-label="Next image"
							>
								›
							</button>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
}
