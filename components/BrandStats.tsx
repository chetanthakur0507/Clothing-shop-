"use client";

import ScrollReveal from "@/components/ScrollReveal";
import { StaggerContainer, StaggerItem } from "@/components/StaggerGrid";
import { useEffect, useState, useRef } from "react";

const stats = [
	{ label: "Happy Shoppers", value: 12, suffix: "K+" },
	{ label: "Fresh Styles / Month", value: 240, suffix: "+" },
	{ label: "Cities Delivered", value: 85, suffix: "" },
	{ label: "Avg. Rating", value: 4.8, suffix: "/5" },
];

function AnimatedStat({ value, suffix, isVisible }: { value: number; suffix: string; isVisible: boolean }) {
	const [count, setCount] = useState(0);
	const isDecimal = !Number.isInteger(value);

	useEffect(() => {
		if (!isVisible) return;

		const duration = 2000; // 2 seconds
		const steps = 60;
		const stepDuration = duration / steps;
		let currentStep = 0;

		const interval = setInterval(() => {
			currentStep++;
			const progress = currentStep / steps;
			const currentValue = value * progress;
			setCount(isDecimal ? parseFloat(currentValue.toFixed(1)) : Math.floor(currentValue));

			if (currentStep >= steps) {
				clearInterval(interval);
				setCount(value);
			}
		}, stepDuration);

		return () => clearInterval(interval);
	}, [value, isDecimal, isVisible]);

	return (
		<span>
			{count}
			{suffix}
		</span>
	);
}

export default function BrandStats() {
	const [isVisible, setIsVisible] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setIsVisible(true);
					observer.unobserve(entry.target);
				}
			},
			{ threshold: 0.3 }
		);

		if (containerRef.current) {
			observer.observe(containerRef.current);
		}

		return () => observer.disconnect();
	}, []);

	return (
		<ScrollReveal className="mx-auto w-full max-w-6xl px-4 py-10 md:px-8">
			<div ref={containerRef} className="soft-border glass-panel rounded-3xl px-6 py-8 md:px-10">
				<p className="text-xs uppercase tracking-[0.24em] text-[#8e6344]">At An Glance</p>
				<StaggerContainer className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
					{stats.map((stat) => (
						<StaggerItem
							key={stat.label}
							className="rounded-2xl border border-[#e5d6c8] bg-white/70 p-4"
						>
							<p className="display-font text-3xl text-[#26150f]">
								<AnimatedStat
									value={stat.value}
									suffix={stat.suffix}
									isVisible={isVisible}
								/>
							</p>
							<p className="mt-1 text-xs uppercase tracking-[0.12em] text-[#6f5241]">
								{stat.label}
							</p>
						</StaggerItem>
					))}
				</StaggerContainer>
			</div>
		</ScrollReveal>
	);
}
