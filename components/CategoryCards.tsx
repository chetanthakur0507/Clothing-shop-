import ScrollReveal from "@/components/ScrollReveal";
import { StaggerContainer, StaggerItem } from "@/components/StaggerGrid";

export default function CategoryCards() {
	return (
		<ScrollReveal>
			<StaggerContainer
				id="collections"
				className="mx-auto grid w-full max-w-6xl scroll-mt-28 grid-cols-1 gap-5 px-4 py-10 md:grid-cols-3 md:px-8"
			>
				<StaggerItem
				className="group relative min-h-64 overflow-hidden rounded-3xl"
				style={{
					backgroundImage:
						"linear-gradient(145deg, rgba(0,0,0,0.5), rgba(0,0,0,0.2)), url('/jacket.svg')",
					backgroundSize: "cover",
					backgroundPosition: "center",
					backgroundColor: "#31211a",
				}}
				>
				<div className="absolute bottom-0 w-full p-6 text-white">
					<p className="text-xs uppercase tracking-[0.25em] text-[#f8d38f]">Limited</p>
					<h3 className="display-font mt-2 text-3xl">50% Off</h3>
					<p className="mt-1 text-sm text-[#f6ece2]">Street Essentials Sale</p>
				</div>
				</StaggerItem>

				<StaggerItem
				className="group relative min-h-64 overflow-hidden rounded-3xl"
				style={{
					backgroundImage:
						"linear-gradient(145deg, rgba(0,0,0,0.5), rgba(0,0,0,0.2)), url('/shirt.svg')",
					backgroundSize: "cover",
					backgroundPosition: "center",
					backgroundColor: "#2f2018",
				}}
				>
				<div className="absolute bottom-0 w-full p-6 text-white">
					<p className="text-xs uppercase tracking-[0.25em] text-[#f8d38f]">New</p>
					<h3 className="display-font mt-2 text-3xl">Men&apos;s Edit</h3>
					<p className="mt-1 text-sm text-[#f6ece2]">Sharp Layers and Denim</p>
				</div>
				</StaggerItem>

				<StaggerItem
				className="group relative min-h-64 overflow-hidden rounded-3xl"
				style={{
					backgroundImage:
						"linear-gradient(145deg, rgba(0,0,0,0.5), rgba(0,0,0,0.2)), url('/dress.svg')",
					backgroundSize: "cover",
					backgroundPosition: "center",
					backgroundColor: "#3b251b",
				}}
				>
				<div className="absolute bottom-0 w-full p-6 text-white">
					<p className="text-xs uppercase tracking-[0.25em] text-[#f8d38f]">Trending</p>
					<h3 className="display-font mt-2 text-3xl">Women&apos;s Form</h3>
					<p className="mt-1 text-sm text-[#f6ece2]">Drapes, Dresses, Details</p>
				</div>
				</StaggerItem>
			</StaggerContainer>
		</ScrollReveal>
	);
}
