"use client";

import { motion } from "framer-motion";
import type { ComponentProps, ReactNode } from "react";

type StaggerGridProps = {
	children: ReactNode;
	className?: string;
} & Omit<ComponentProps<typeof motion.div>, "children">;

export function StaggerContainer({ children, className, ...props }: StaggerGridProps) {
	return (
		<motion.div
			{...props}
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

export function StaggerItem({ children, className, ...props }: StaggerGridProps) {
	return (
		<motion.div
			{...props}
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
