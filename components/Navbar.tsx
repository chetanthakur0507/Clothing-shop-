"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const navLinks = [
	{ href: "/", label: "Home" },
	{ href: "/collections", label: "Collections" },
	{ href: "/ai-cloth-suggestion", label: "AI Suggestion" },
	{ href: "/reviews", label: "Reviews" },
	{ href: "/contact", label: "Contact" },
];

export default function Navbar() {
	const [isOpen, setIsOpen] = useState(false);

	const closeMenu = () => setIsOpen(false);

	return (
		<nav className="sticky top-0 z-40 border-b border-white/60 bg-[#f8f3ea]/85 px-5 py-4 backdrop-blur-lg md:px-10">
			<div className="mx-auto flex w-full max-w-6xl items-center justify-between">
				<Link href="/" className="flex items-center gap-3">
					<Image
						src="/logo-shree-ram.png"
						alt="Shree Ram Logo"
						width={56}
						height={56}
						priority
						className="h-12 w-12 rounded-full border border-[#d9c3ab] object-cover md:h-14 md:w-14"
					/>
					<div>
						<p className="text-xs uppercase tracking-[0.32em] text-[#8a5a33]">Shree Ram</p>
						<h1 className="display-font text-xl leading-none text-[#26150f] md:text-2xl">
							Readymade Showroom
						</h1>
					</div>
				</Link>

				<div className="hidden gap-8 text-sm font-semibold uppercase tracking-[0.16em] text-[#47352e] md:flex">
					{navLinks.map((item) => (
						<Link key={item.href} href={item.href}>
							{item.label}
						</Link>
					))}
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
					</motion.div>
				) : null}
			</AnimatePresence>
		</nav>
	);
}
