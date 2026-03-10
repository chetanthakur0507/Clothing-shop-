"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type ScrollRevealProps = {
	children: ReactNode;
	className?: string;
	delay?: number;
};

export default function ScrollReveal({
	children,
	className,
	delay = 0,
}: ScrollRevealProps) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 28 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, amount: 0.2 }}
			transition={{ duration: 0.7, ease: "easeOut", delay }}
			className={className}
		>
			{children}
		</motion.div>
	);
}
