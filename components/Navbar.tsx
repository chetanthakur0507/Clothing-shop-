"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

const navLinks = [
	{ href: "#home", label: "Home" },
	{ href: "#collections", label: "Collections" },
	{ href: "#carousel", label: "Carousel" },
	{ href: "#reviews", label: "Reviews" },
	{ href: "#contact", label: "Contact" },
];

export default function Navbar() {
	const [isOpen, setIsOpen] = useState(false);

	const closeMenu = () => setIsOpen(false);

	return (
		<nav className="sticky top-0 z-40 border-b border-white/60 bg-[#f8f3ea]/85 px-5 py-4 backdrop-blur-lg md:px-10">
			<div className="mx-auto flex w-full max-w-6xl items-center justify-between">
				<div>
					<p className="text-xs uppercase tracking-[0.32em] text-[#8a5a33]">Curated Style</p>
					<h1 className="display-font text-2xl leading-none text-[#26150f] md:text-3xl">
						Maison Thread
					</h1>
				</div>

				<div className="hidden gap-8 text-sm font-semibold uppercase tracking-[0.16em] text-[#47352e] md:flex">
					{navLinks.map((item) => (
						<Link key={item.href} href={item.href}>
							{item.label}
						</Link>
					))}
				</div>

				<div className="hidden items-center gap-2 md:flex">
					<button
						type="button"
						className="rounded-full border border-[#d8c4b1] bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#3e2b24] transition hover:-translate-y-0.5"
					>
						Cart
					</button>
					<button
						type="button"
						className="rounded-full bg-[#1f1410] px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#f5ece2] transition hover:-translate-y-0.5"
					>
						Profile
					</button>
				</div>

				<button
					type="button"
					onClick={() => setIsOpen((prev) => !prev)}
					className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#d8c4b1] bg-white/80 md:hidden"
					aria-label="Toggle menu"
				>
					<span className="relative h-4 w-5">
						<span
							className={`absolute left-0 top-0 h-0.5 w-5 bg-[#3a2a22] transition ${
								isOpen ? "translate-y-[7px] rotate-45" : ""
							}`}
						/>
						<span
							className={`absolute left-0 top-[7px] h-0.5 w-5 bg-[#3a2a22] transition ${
								isOpen ? "opacity-0" : ""
							}`}
						/>
						<span
							className={`absolute left-0 top-[14px] h-0.5 w-5 bg-[#3a2a22] transition ${
								isOpen ? "-translate-y-[7px] -rotate-45" : ""
							}`}
						/>
					</span>
				</button>
			</div>

			<AnimatePresence>
				{isOpen ? (
					<motion.div
						initial={{ opacity: 0, y: -8 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -8 }}
						transition={{ duration: 0.22 }}
						className="mx-auto mt-4 w-full max-w-6xl rounded-2xl border border-[#dcc7b3] bg-[#fff9f0] p-4 md:hidden"
					>
						<div className="grid gap-3 text-sm font-semibold uppercase tracking-[0.14em] text-[#47352e]">
							{navLinks.map((item) => (
								<Link key={item.href} onClick={closeMenu} href={item.href}>
									{item.label}
								</Link>
							))}
						</div>
						<div className="mt-4 flex gap-2">
							<button
								type="button"
								className="flex-1 rounded-full border border-[#d8c4b1] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#3e2b24]"
							>
								Cart
							</button>
							<button
								type="button"
								className="flex-1 rounded-full bg-[#1f1410] px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#f5ece2]"
							>
								Profile
							</button>
						</div>
					</motion.div>
				) : null}
			</AnimatePresence>
		</nav>
	);
}
