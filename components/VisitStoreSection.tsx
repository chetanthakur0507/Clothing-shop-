"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

/* ── Replace the src URL below with your store's Google Maps embed link ── */
const MAP_EMBED_SRC =
	"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2886.380176911997!2d78.97145250656628!3d28.464486322126287!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ac7cda5ca3335%3A0x1ad8a61510ee4421!2sShree%20Ram%20Readymade%20Showroom%20Dhakia!5e1!3m2!1sen!2sin!4v1773230365058!5m2!1sen!2sin";

const GMAPS_DIRECTIONS =
	"https://maps.app.goo.gl/yfmekj2u1UU2h6wWA";

const WA_NUMBER = "+917820022516";
const WA_BOOKING = encodeURIComponent(
	"Namaste! Mujhe Shree Ram Readymade ke kuch products dekhnai hai. Please confirm timing. 🙏",
);

export default function VisitStoreSection() {
	const sectionRef = useRef<HTMLElement>(null);
	const { scrollYProgress } = useScroll({
		target: sectionRef,
		offset: ["start end", "end start"],
	});

	const bgY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
	const glowY = useTransform(scrollYProgress, [0, 1], ["-20%", "18%"]);
	const contentY = useTransform(scrollYProgress, [0, 1], ["8%", "-6%"]);

	return (
		<div className="mx-auto w-full max-w-6xl px-4 py-12 md:px-8">
			<motion.section
				ref={sectionRef}
				id="visit"
				className="soft-border parallax-band relative overflow-hidden rounded-3xl border border-white/40 shadow-[0_20px_50px_rgba(52,29,14,0.22)]"
				style={{
					backgroundImage:
						"linear-gradient(120deg, rgba(25, 16, 10, 0.72), rgba(25, 16, 10, 0.45)), url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1800&q=80')",
					backgroundPositionY: bgY,
				}}
			>
				<motion.div
					style={{ y: glowY }}
					className="pointer-events-none absolute -left-16 top-8 h-48 w-48 rounded-full bg-[#d58d4f]/35 blur-3xl"
				/>
				<motion.div
					style={{ y: glowY }}
					className="pointer-events-none absolute -bottom-20 right-6 h-56 w-56 rounded-full bg-[#c64f36]/30 blur-3xl"
				/>
				<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_14%,rgba(255,255,255,0.7),transparent_40%)]" />

				<motion.div
					style={{ y: contentY }}
					className="relative grid grid-cols-1 gap-4 p-4 md:grid-cols-2 md:p-5"
				>
					{/* Store Info */}
					<div className="rounded-2xl border border-white/35 bg-white/80 p-6 backdrop-blur-md md:p-8">
						<p className="text-xs uppercase tracking-[0.24em] text-[#8e6344]">Visit Us</p>
						<h2 className="display-font mt-2 text-3xl text-[#241710] md:text-4xl">
							Shree Ram Readymade Showroom
						</h2>
						<p className="mt-3 text-sm leading-7 text-[#4a3a30]">
							Main Market Dhakia,Asafpur Road, Near State Bank of India.
						</p>
						<ul className="mt-4 space-y-1 text-sm text-[#4a3a30]">
							<li>🕙 Mon–Sat: 10:00 AM – 9:00 PM</li>
							<li>🕙 Sunday: 11:00 AM – 7:00 PM</li>
							<li>📞 +91 7820022516</li>
						</ul>
						<div className="mt-6 flex flex-wrap gap-3">
							<a
								href={GMAPS_DIRECTIONS}
								target="_blank"
								rel="noopener noreferrer"
								className="rounded-full bg-[#1f1410] px-5 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#f7ede2] transition hover:-translate-y-0.5"
							>
								📍 Get Directions
							</a>
							<a
								href={`https://wa.me/${WA_NUMBER}?text=${WA_BOOKING}`}
								target="_blank"
								rel="noopener noreferrer"
								className="rounded-full border border-[#2f2018] px-5 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#2f2018] transition hover:-translate-y-0.5"
							>
								💬 Book Styling Slot
							</a>
						</div>
					</div>

					{/* Embedded Map */}
					<div className="relative min-h-[320px] overflow-hidden rounded-2xl border border-white/35 bg-black/10 shadow-[0_16px_35px_rgba(32,18,9,0.3)] backdrop-blur-sm">
						<iframe
							title="Shree Ram Readymade Showroom Location"
							src={MAP_EMBED_SRC}
							allowFullScreen
							loading="lazy"
							referrerPolicy="no-referrer-when-downgrade"
							className="absolute inset-0 h-full w-full border-0"
						/>
					</div>
				</motion.div>
			</motion.section>
		</div>
	);
}
