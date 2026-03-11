"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function NewsletterSection() {
	const sectionRef = useRef<HTMLElement>(null);
	const { scrollYProgress } = useScroll({
		target: sectionRef,
		offset: ["start end", "end start"],
	});

	const bgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
	const contentY = useTransform(scrollYProgress, [0, 1], ["8%", "-6%"]);

	return (
		<motion.section
			ref={sectionRef}
			id="contact"
			className="parallax-band relative mx-auto my-8 flex min-h-[55vh] w-full max-w-6xl scroll-mt-28 items-center overflow-hidden rounded-[2rem]"
			style={{
				backgroundImage:
					"linear-gradient(120deg, rgba(22,14,10,0.72), rgba(22,14,10,0.35)), url('https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1800&q=80')",
				backgroundPositionY: bgY,
			}}
		>
			<div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(215,161,63,0.25),transparent_35%)]" />

			<motion.div
				style={{ y: contentY }}
				className="relative z-10 mx-4 w-full rounded-3xl border border-white/30 bg-black/35 p-6 text-white backdrop-blur-md md:mx-10 md:p-10"
			>
				<p className="text-xs uppercase tracking-[0.24em] text-[#f4c98c]">Stay Updated</p>
				<h2 className="display-font mt-2 text-3xl md:text-4xl">Get Weekly Style Drops</h2>
				<p className="mt-3 max-w-2xl text-sm leading-7 text-[#f5e7d6]">
					Join our newsletter for early access deals, personalized styling picks, and
					exclusive member-only launches.
				</p>
				<form className="mt-6 flex flex-col gap-3 md:flex-row">
					<input
						type="email"
						placeholder="Enter your email"
						className="w-full rounded-full border border-white/40 bg-white/90 px-5 py-3 text-sm text-[#21130d] outline-none"
					/>
					<button
						type="button"
						className="rounded-full bg-[#d7a13f] px-6 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#2a1a0f] transition hover:-translate-y-0.5 hover:bg-[#e2b35f]"
					>
						Subscribe
					</button>
				</form>
			</motion.div>
		</motion.section>
	);
}
