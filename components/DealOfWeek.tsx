"use client";

import { motion } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";

export default function DealOfWeek() {
	return (
		<ScrollReveal className="mx-auto w-full max-w-6xl px-4 py-12 md:px-8">
			<motion.section
				initial={{ opacity: 0, scale: 0.97 }}
				whileInView={{ opacity: 1, scale: 1 }}
				viewport={{ once: true }}
				transition={{ duration: 0.6 }}
				className="rounded-3xl bg-gradient-to-r from-[#2b1a13] via-[#5f2f22] to-[#b66a34] p-8 text-[#fdeedc] md:p-10"
			>
				<p className="text-xs uppercase tracking-[0.3em] text-[#ffd39e]">Deal Of The Week</p>
				<h2 className="display-font mt-3 text-4xl md:text-5xl">Buy 2 Get 1 Free</h2>
				<p className="mt-3 max-w-2xl text-sm leading-7 text-[#ffead1] md:text-base">
					Select categories only. Offer valid till Sunday midnight. Use code STYLE3 at checkout.
				</p>
			</motion.section>
		</ScrollReveal>
	);
}
