"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type SliderReview = {
	name: string;
	city: string;
	image: string;
	review: string;
};

const sliderReviews: SliderReview[] = [
	{
		name: "Aarav Sharma",
		city: "Bhopal",
		image: "/shirt.jpg",
		review: "Fabric quality expected se better nikla. Fitting bhi perfect thi.",
	},
	{
		name: "Riya Verma",
		city: "Indore",
		image: "/dress.jpg",
		review: "Wedding function ke liye jo dress li, sabne compliment diya.",
	},
	{
		name: "Mohit Jain",
		city: "Sehore",
		image: "/jacket.jpg",
		review: "Jacket ka finish aur stitching dono premium lage. Value for money.",
	},
	{
		name: "Neha Soni",
		city: "Vidisha",
		image: "/dress.jpg",
		review: "Delivery fast thi aur fitting bilkul as shown nikli. Highly recommended.",
	},
];

export default function AutoplayReviewSlider() {
	const [activeIndex, setActiveIndex] = useState(0);
	const [isPaused, setIsPaused] = useState(false);

	useEffect(() => {
		if (isPaused) {
			return;
		}

		const timer = setInterval(() => {
			setActiveIndex((prev) => (prev + 1) % sliderReviews.length);
		}, 3000);

		return () => clearInterval(timer);
	}, [isPaused]);

	return (
		<section className="mx-auto w-full max-w-6xl px-4 pb-10 md:px-8">
			<div
				className="overflow-hidden rounded-3xl border border-[#e2d0b8] bg-[#fff9f1] shadow-[0_16px_38px_rgba(36,23,16,0.12)]"
				onMouseEnter={() => setIsPaused(true)}
				onMouseLeave={() => setIsPaused(false)}
			>
				<div
					className="flex transition-transform duration-700 ease-out"
					style={{ transform: `translateX(-${activeIndex * 100}%)` }}
				>
					{sliderReviews.map((item) => (
						<article
							key={`${item.name}-${item.city}`}
							className="grid min-w-full grid-cols-1 md:grid-cols-[40%_60%]"
						>
							<div className="relative h-64 md:h-[420px]">
								<Image
									src={item.image}
									alt={item.name}
									fill
									sizes="(max-width: 768px) 100vw, 40vw"
									className="object-cover"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
							</div>

							<div className="flex flex-col justify-center p-6 md:p-10">
								<p className="text-sm uppercase tracking-[0.25em] text-[#8e6344]">Verified Review</p>
								<p className="mt-3 text-2xl leading-relaxed text-[#2f2016] md:text-3xl">"{item.review}"</p>
								<p className="mt-6 text-[#d6b56d]">★★★★★</p>
								<div className="mt-3 border-t border-[#ead9c4] pt-3">
									<p className="text-lg font-semibold text-[#241710]">{item.name}</p>
									<p className="text-xs uppercase tracking-[0.2em] text-[#8e6344]">{item.city}</p>
								</div>
							</div>
						</article>
					))}
				</div>

				<div className="flex items-center justify-center gap-2 border-t border-[#ecdcc8] bg-[#fff4e6] py-4">
					{sliderReviews.map((item, index) => (
						<button
							key={`${item.name}-${index}`}
							type="button"
							onClick={() => setActiveIndex(index)}
							className={`h-2.5 rounded-full transition-all duration-300 ${
								activeIndex === index ? "w-8 bg-[#7c5538]" : "w-2.5 bg-[#d8b88f]"
							}`}
							aria-label={`Go to review ${index + 1}`}
						/>
					))}
				</div>
			</div>
		</section>
	);
}