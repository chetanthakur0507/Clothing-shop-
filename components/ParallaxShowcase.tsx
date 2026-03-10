"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function ParallaxShowcase() {
	const sectionRef = useRef<HTMLElement>(null);
	const { scrollYProgress } = useScroll({
		target: sectionRef,
		offset: ["start end", "end start"],
	});

	const overlayOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.35, 0.55, 0.35]);
	const contentScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.94, 1, 0.96]);

	return (
		<motion.section
			ref={sectionRef}
			id="story"
			className="parallax-band relative my-6 flex min-h-[50vh] items-center justify-center overflow-hidden"
			style={{
				backgroundImage:
					"linear-gradient(120deg, rgba(15,12,10,0.62), rgba(15,12,10,0.34)), url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1800&q=80')",
			}}
		>
			<motion.div
				style={{ opacity: overlayOpacity }}
				className="absolute inset-0 bg-black"
			/>
			<motion.div
				style={{ scale: contentScale }}
				className="relative mx-4 w-full max-w-4xl rounded-3xl border border-white/25 bg-black/30 p-8 text-center text-white backdrop-blur-md md:p-12"
			>
				<p className="text-xs uppercase tracking-[0.3em] text-[#f8d38f]">Parallax Story</p>
				<h2 className="display-font mt-3 text-4xl md:text-5xl">Made For Motion</h2>
				<p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#f6ece2] md:text-base">
					Scroll down and feel the layered movement, editorial imagery, and boutique
					vibe that brings this fashion storefront to life.
				</p>
			</motion.div>
		</motion.section>
	);
}
