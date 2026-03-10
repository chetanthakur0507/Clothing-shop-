"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type StaggerGridProps = {
	children: ReactNode;
	className?: string;
};

export function StaggerContainer({ children, className }: StaggerGridProps) {
	return (
		<motion.div
			initial="hidden"
			whileInView="show"
			viewport={{ once: true, amount: 0.15 }}
			variants={{
				hidden: {},
				show: {
					transition: { staggerChildren: 0.12 },
				},
			}}
			className={className}
		>
			{children}
		</motion.div>
	);
}

export function StaggerItem({ children, className }: StaggerGridProps) {
	return (
		<motion.div
			variants={{
				hidden: { opacity: 0, y: 24 },
				show: { opacity: 1, y: 0 },
			}}
			transition={{ duration: 0.6, ease: "easeOut" }}
			className={className}
		>
			{children}
		</motion.div>
	);
}
