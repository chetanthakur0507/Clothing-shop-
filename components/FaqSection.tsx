"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import ScrollReveal from "@/components/ScrollReveal";

const faqs = [
	{
		q: "Do you offer returns?",
		a: "Yes, easy return within 7 days for unworn items with tags.",
	},
	{
		q: "Can I get size guidance?",
		a: "Yes, use our fit support on call or visit store for trial.",
	},
	{
		q: "Do you ship PAN India?",
		a: "Yes, standard and express options are available.",
	},
];

export default function FaqSection() {
	const [openIndex, setOpenIndex] = useState(0);

	return (
		<ScrollReveal className="mx-auto w-full max-w-6xl px-4 py-12 md:px-8">
			<section className="relative overflow-hidden rounded-3xl border border-[#e9d9cb] bg-gradient-to-br from-[#fff9f1] via-[#fff4e7] to-[#f4e2cc] p-6 shadow-[0_18px_40px_rgba(60,34,15,0.14)] md:p-8">
				<div className="pointer-events-none absolute -right-12 -top-14 h-40 w-40 rounded-full bg-[#e2b072]/30 blur-3xl" />
				<div className="pointer-events-none absolute -bottom-12 -left-8 h-44 w-44 rounded-full bg-[#c95e42]/20 blur-3xl" />

				<div className="relative">
					<p className="text-xs uppercase tracking-[0.24em] text-[#8e6344]">FAQ</p>
					<h2 className="display-font mt-2 text-3xl text-[#241710] md:text-4xl">
						Common Questions
					</h2>
					<p className="mt-2 max-w-2xl text-sm text-[#5b473a]">
						Quick answers to things shoppers ask most often.
					</p>

					<div className="mt-6 grid gap-3">
						{faqs.map((item, index) => {
							const isOpen = openIndex === index;

							return (
								<motion.div
									key={item.q}
									layout
									initial={{ opacity: 0, y: 14 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ duration: 0.35, delay: index * 0.06 }}
									className="overflow-hidden rounded-2xl border border-[#eadccf] bg-white/85 backdrop-blur-sm"
								>
									<button
										type="button"
										onClick={() => setOpenIndex(isOpen ? -1 : index)}
										className="flex w-full items-center justify-between px-4 py-4 text-left"
									>
										<h3 className="pr-4 text-sm font-semibold text-[#241710] md:text-base">
											{item.q}
										</h3>
										<motion.span
											animate={{ rotate: isOpen ? 45 : 0 }}
											transition={{ duration: 0.2 }}
											className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#f6e8d7] text-lg font-semibold text-[#6e422a]"
										>
											+
										</motion.span>
									</button>

									<AnimatePresence initial={false}>
										{isOpen && (
											<motion.div
												initial={{ height: 0, opacity: 0 }}
												animate={{ height: "auto", opacity: 1 }}
												exit={{ height: 0, opacity: 0 }}
												transition={{ duration: 0.28 }}
												className="overflow-hidden"
											>
												<p className="px-4 pb-4 text-sm leading-7 text-[#4a3a30]">
													{item.a}
												</p>
											</motion.div>
										)}
									</AnimatePresence>
								</motion.div>
							);
						})}
					</div>
				</div>
			</section>
		</ScrollReveal>
	);
}
