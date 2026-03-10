"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function HeroSection() {
	const sectionRef = useRef<HTMLElement>(null);
	const { scrollYProgress } = useScroll({
		target: sectionRef,
		offset: ["start end", "end start"],
	});

	const bgY = useTransform(scrollYProgress, [0, 1], ["-7%", "7%"]);
	const contentY = useTransform(scrollYProgress, [0, 1], ["12%", "-10%"]);
	const shapeY = useTransform(scrollYProgress, [0, 1], ["-20%", "18%"]);

	return (
		<motion.section
			ref={sectionRef}
			id="home"
			className="parallax-band relative mx-4 mt-4 flex min-h-[82vh] scroll-mt-28 items-center overflow-hidden rounded-[2rem] md:mx-8"
			style={{
				backgroundImage:
					"url('https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1800&q=80')",
				backgroundPositionY: bgY,
			}}
		>
			<div className="hero-grain absolute inset-0" />
			<motion.div
				style={{ y: shapeY }}
				className="floating-shape absolute -left-8 top-20 hidden h-44 w-44 rounded-full bg-[#f2cd85]/30 blur-xl lg:block"
			/>
			<motion.div
				style={{ y: shapeY }}
				className="floating-shape absolute -right-10 bottom-16 hidden h-52 w-52 rounded-full bg-[#d2684f]/30 blur-xl lg:block"
			/>

			<motion.div
				style={{ y: contentY }}
				className="relative z-10 mx-auto w-full max-w-6xl px-6 py-10 text-white md:px-12"
			>
				<div className="max-w-2xl rounded-3xl border border-white/30 bg-black/25 p-8 backdrop-blur-md md:p-10">
					<p className="reveal-up text-xs uppercase tracking-[0.3em] text-[#f9d9b2]">
						Autumn Winter Edit 2026
					</p>
					<h2 className="display-font reveal-up-delay mt-3 text-4xl leading-tight md:text-6xl">
						Dress Bold, Move Light, Own Every Street
					</h2>
					<p className="reveal-up-delay mt-5 max-w-xl text-sm leading-7 text-[#f9ebdc] md:text-base">
						Premium fits, textured fabrics, and handcrafted silhouettes for men and
						women. A modern showroom experience inspired by editorial fashion sets.
					</p>
					<div className="reveal-up-delay mt-7 flex flex-wrap gap-3">
						<button
							type="button"
							className="rounded-full bg-[#d7a13f] px-6 py-3 text-sm font-semibold uppercase tracking-[0.1em] text-[#24160d] transition duration-300 hover:-translate-y-0.5 hover:bg-[#e1b158]"
						>
							Shop New Drop
						</button>
						<button
							type="button"
							className="rounded-full border border-white/70 bg-white/10 px-6 py-3 text-sm font-semibold uppercase tracking-[0.1em] text-white transition duration-300 hover:-translate-y-0.5"
						>
							View Lookbook
						</button>
					</div>
				</div>
			</motion.div>
		</motion.section>
	);
}
