"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import WhatsAppButton from "@/components/WhatsAppButton";
import type { RecommendationResponse } from "@/lib/ai-fashion/types";

type Mode = "item" | "image" | "user-photo";

type HealthState = {
	webApi: "online" | "offline" | "loading";
	model: "ready" | "loading";
	message: string;
};

const modeLabels: Record<Mode, string> = {
	item: "Item-Based",
	image: "Image-Based",
	"user-photo": "User Photo Styling",
};

export default function AIClothSuggestionPage() {
	const [mode, setMode] = useState<Mode>("item");
	const [itemInput, setItemInput] = useState("Black T-shirt");
	const [clothImage, setClothImage] = useState<File | null>(null);
	const [userPhoto, setUserPhoto] = useState<File | null>(null);
	const [loading, setLoading] = useState(false);
	const [downloadLoading, setDownloadLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [result, setResult] = useState<RecommendationResponse | null>(null);
	const [health, setHealth] = useState<HealthState>({
		webApi: "loading",
		model: "loading",
		message: "Checking services...",
	});
	const [cameraActive, setCameraActive] = useState(false);
	const [cameraSupported, setCameraSupported] = useState(true);
	const [hasCameraStream, setHasCameraStream] = useState(false);
	const videoRef = useRef<HTMLVideoElement | null>(null);
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const clothPreviewUrl = useMemo(() => {
		if (!clothImage) return null;
		return URL.createObjectURL(clothImage);
	}, [clothImage]);
	const userPhotoPreviewUrl = useMemo(() => {
		if (!userPhoto) return null;
		return URL.createObjectURL(userPhoto);
	}, [userPhoto]);

	const stopCamera = () => {
		const stream = videoRef.current?.srcObject as MediaStream | null;
		if (stream) {
			stream.getTracks().forEach((track) => track.stop());
		}
		if (videoRef.current) {
			videoRef.current.srcObject = null;
		}
		setCameraActive(false);
		setHasCameraStream(false);
	};

	const startCamera = async () => {
		setError(null);
		if (!navigator.mediaDevices?.getUserMedia) {
			setCameraSupported(false);
			setError("Camera is browser/device me supported nahi hai.");
			return;
		}
		try {
			let stream: MediaStream;
			try {
				stream = await navigator.mediaDevices.getUserMedia({
					video: { facingMode: "user" },
					audio: false,
				});
			} catch {
				// Fallback for devices/browsers that don't support facingMode constraint.
				stream = await navigator.mediaDevices.getUserMedia({
					video: true,
					audio: false,
				});
			}
			if (!videoRef.current) return;
			videoRef.current.srcObject = stream;
			setCameraActive(true);
			setHasCameraStream(true);

			videoRef.current.onloadedmetadata = () => {
				videoRef.current
					?.play()
					.then(() => {
						setCameraActive(true);
					})
					.catch(() => {
						setError("Camera start hua, par preview play nahi hua. Ek baar refresh karke try karein.");
					});
			};
		} catch {
			setCameraActive(false);
			setHasCameraStream(false);
			setError("Camera access allow karein, fir try karein.");
		}
	};

	const captureFromCamera = () => {
		if (!videoRef.current || !canvasRef.current) return;
		const video = videoRef.current;
		const canvas = canvasRef.current;
		canvas.width = video.videoWidth || 720;
		canvas.height = video.videoHeight || 960;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

		canvas.toBlob((blob) => {
			if (!blob) return;
			const file = new File([blob], `camera-capture-${Date.now()}.jpg`, { type: "image/jpeg" });
			if (mode === "image") {
				setClothImage(file);
			} else if (mode === "user-photo") {
				setUserPhoto(file);
			}
			stopCamera();
		}, "image/jpeg", 0.92);
	};

	const handleDownloadPreview = async () => {
		if (!result?.previewImageUrl) return;
		setDownloadLoading(true);
		setError(null);
		try {
			const response = await fetch(result.previewImageUrl);
			if (!response.ok) throw new Error("Preview image download failed");
			const blob = await response.blob();
			const objectUrl = URL.createObjectURL(blob);
			const anchor = document.createElement("a");
			anchor.href = objectUrl;
			anchor.download = `ai-outfit-preview-${Date.now()}.jpg`;
			document.body.appendChild(anchor);
			anchor.click();
			anchor.remove();
			URL.revokeObjectURL(objectUrl);
		} catch {
			window.open(result.previewImageUrl, "_blank", "noopener,noreferrer");
		} finally {
			setDownloadLoading(false);
		}
	};

	useEffect(() => {
		setCameraSupported(Boolean(navigator.mediaDevices?.getUserMedia));
	}, []);

	useEffect(() => {
		if (mode === "item") {
			stopCamera();
		}
	}, [mode]);

	useEffect(() => {
		return () => {
			stopCamera();
		};
	}, []);

	useEffect(() => {
		return () => {
			if (clothPreviewUrl) URL.revokeObjectURL(clothPreviewUrl);
		};
	}, [clothPreviewUrl]);

	useEffect(() => {
		return () => {
			if (userPhotoPreviewUrl) URL.revokeObjectURL(userPhotoPreviewUrl);
		};
	}, [userPhotoPreviewUrl]);

	useEffect(() => {
		let alive = true;
		let isChecking = false;

		const checkHealth = async () => {
			if (isChecking) return;
			isChecking = true;
			try {
				const res = await fetch("/api/ai-fashion/health");
				if (!res.ok) {
					if (!alive) return;
					setHealth({
						webApi: "offline",
						model: "loading",
						message: "Web API unreachable",
					});
					return;
				}

				const data = (await res.json()) as {
					webApiOnline?: boolean;
					aiServiceReachable?: boolean;
					modelReady?: boolean;
					error?: string | null;
					embeddingMode?: string;
				};

				if (!alive) return;
				setHealth({
					webApi: data.webApiOnline ? "online" : "offline",
					model: data.modelReady ? "ready" : "loading",
					message: data.modelReady
						? `Model ready (${data.embeddingMode ?? "clip"})`
						: data.error || "Model loading...",
				});
			} catch {
				if (!alive) return;
				setHealth({
					webApi: "offline",
					model: "loading",
					message: "Web/API connection failed",
				});
			} finally {
				isChecking = false;
			}
		};

		checkHealth();
		const intervalId = window.setInterval(checkHealth, 12000);

		return () => {
			alive = false;
			window.clearInterval(intervalId);
		};
	}, []);

	const handleSubmit = async () => {
		setError(null);
		setLoading(true);
		setResult(null);

		try {
			if (mode === "item") {
				const res = await fetch("/api/ai-fashion/item", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ item: itemInput }),
				});
				const data = await res.json();
				if (!res.ok) throw new Error(data.error ?? "Unable to fetch recommendations");
				setResult(data);
				return;
			}

			if (mode === "image") {
				if (!clothImage) throw new Error("Please upload a clothing image first.");
				const formData = new FormData();
				formData.append("image", clothImage);
				const res = await fetch("/api/ai-fashion/image", {
					method: "POST",
					body: formData,
				});
				const data = await res.json();
				if (!res.ok) throw new Error(data.error ?? "Unable to analyze image");
				setResult(data);
				return;
			}

			if (!userPhoto) throw new Error("Please upload your photo first.");
			const formData = new FormData();
			formData.append("photo", userPhoto);
			const res = await fetch("/api/ai-fashion/user-photo", {
				method: "POST",
				body: formData,
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error ?? "Unable to process user photo");
			setResult(data);
		} catch (err) {
			const message = err instanceof Error ? err.message : "Something went wrong";
			if (/failed to fetch|networkerror/i.test(message)) {
				setError(
					"Server connection failed. `npm run dev` chalakar web + AI service start karein, phir retry karein.",
				);
			} else {
				setError(message);
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<main>
			<Navbar />
			<section className="mx-auto w-full max-w-6xl px-4 pb-10 pt-12 md:px-8">
				<div className="relative overflow-hidden rounded-[2rem] border border-white/65 bg-gradient-to-br from-[#2d1a12] via-[#5b3122] to-[#9a5530] p-7 text-[#fdf1e4] shadow-[0_22px_45px_rgba(40,20,10,0.24)] md:p-10">
					<div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[#d5a14d]/35 blur-3xl" />
					<div className="absolute -bottom-20 -left-12 h-52 w-52 rounded-full bg-[#f3c389]/20 blur-3xl" />
					<div className="relative">
						<p className="text-xs uppercase tracking-[0.3em] text-[#f8cd91]">
							AI Cloth Suggestion
						</p>
						<h1 className="display-font mt-3 text-4xl leading-tight md:text-5xl">
							Outfit Recommendation Engine
						</h1>
						<p className="mt-4 max-w-3xl text-sm leading-7 text-[#ffe8cf] md:text-base">
							Item match, image analysis, aur user-photo styling ke liye complete workflow.
							Abhi demo APIs active hain; next step me aapke CLIP/FashionCLIP + FAISS +
							Stable Diffusion service ko plug-in karna hai.
						</p>
						<div className="mt-5 flex flex-wrap gap-2">
							<span
								className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.11em] ${
									health.webApi === "online"
										? "border-[#99e2b4] bg-[#123025] text-[#b9ffd1]"
										: health.webApi === "offline"
											? "border-[#f3a89d] bg-[#3a1916] text-[#ffd5cf]"
											: "border-[#e0c6a0] bg-[#3a2a1c] text-[#f5dfbf]"
								}`}
							>
								Web API: {health.webApi === "online" ? "Online" : health.webApi === "offline" ? "Offline" : "Loading"}
							</span>
							<span
								className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.11em] ${
									health.model === "ready"
										? "border-[#99e2b4] bg-[#123025] text-[#b9ffd1]"
										: "border-[#f0c88a] bg-[#3a2a1c] text-[#ffe7bf]"
								}`}
							>
								Model: {health.model === "ready" ? "Ready" : "Loading"}
							</span>
						</div>
						<p className="mt-2 text-xs text-[#f1dac0]">{health.message}</p>
					</div>
				</div>
			</section>

			<section className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 px-4 pb-12 md:grid-cols-5 md:px-8">
				<div className="md:col-span-2">
					<div className="rounded-3xl border border-[#e7d7c7] bg-[#fff9f2] p-5 shadow-[0_15px_30px_rgba(46,26,14,0.1)]">
						<p className="text-xs uppercase tracking-[0.24em] text-[#8e6344]">Try Mode</p>
						<div className="mt-4 grid gap-2">
							{(Object.keys(modeLabels) as Mode[]).map((m) => (
								<button
									key={m}
									onClick={() => setMode(m)}
									className={`rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
										mode === m
											? "bg-[#2d1a12] text-[#fff1df]"
											: "bg-[#f5e6d5] text-[#3f2b1f] hover:bg-[#edd8c2]"
									}`}
								>
									{modeLabels[m]}
								</button>
							))}
						</div>

						<div className="mt-5">
							{mode === "item" ? (
								<div className="space-y-2">
									<label className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6b4a33]">
										Selected Item
									</label>
									<input
										value={itemInput}
										onChange={(e) => setItemInput(e.target.value)}
										placeholder="e.g. Black T-shirt"
										className="w-full rounded-xl border border-[#dac6b3] bg-white px-4 py-3 text-sm outline-none"
									/>
								</div>
							) : null}

							{mode === "image" ? (
								<div className="space-y-2">
									<label className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6b4a33]">
										Upload Clothing Image
									</label>
									<input
										type="file"
										accept="image/*"
										onChange={(e) => setClothImage(e.target.files?.[0] ?? null)}
										className="block w-full rounded-xl border border-[#dac6b3] bg-white p-3 text-sm"
									/>
									{clothImage ? (
										<p className="text-xs text-[#6f5240]">Selected: {clothImage.name}</p>
									) : null}
									{clothPreviewUrl ? (
										<div className="overflow-hidden rounded-xl border border-[#dac6b3] bg-white">
											<p className="border-b border-[#ead7c4] bg-[#f8ecde] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#5b4333]">
												Captured / Uploaded Cloth Preview
											</p>
											<Image
												src={clothPreviewUrl}
												alt="Clothing preview"
												width={1200}
												height={700}
												unoptimized
												className="h-40 w-full object-cover"
											/>
										</div>
									) : null}
								</div>
							) : null}

							{mode === "user-photo" ? (
								<div className="space-y-2">
									<label className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6b4a33]">
										Upload Your Photo
									</label>
									<input
										type="file"
										accept="image/*"
										onChange={(e) => setUserPhoto(e.target.files?.[0] ?? null)}
										className="block w-full rounded-xl border border-[#dac6b3] bg-white p-3 text-sm"
									/>
									{userPhoto ? (
										<p className="text-xs text-[#6f5240]">Selected: {userPhoto.name}</p>
									) : null}
									{userPhotoPreviewUrl ? (
										<div className="overflow-hidden rounded-xl border border-[#dac6b3] bg-white">
											<p className="border-b border-[#ead7c4] bg-[#f8ecde] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#5b4333]">
												Captured / Uploaded User Preview
											</p>
											<Image
												src={userPhotoPreviewUrl}
												alt="User photo preview"
												width={1200}
												height={700}
												unoptimized
												className="h-40 w-full object-cover"
											/>
										</div>
									) : null}
								</div>
							) : null}

							{mode !== "item" ? (
								<div className="mt-4 overflow-hidden rounded-xl border border-[#dac6b3] bg-[#fffaf5]">
									<div className="flex items-center justify-between border-b border-[#ead7c4] bg-[#f8ecde] px-3 py-2">
										<p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#5b4333]">
											Camera Frame
										</p>
										<div className="flex gap-2">
											<button
												type="button"
												onClick={cameraActive ? stopCamera : startCamera}
												disabled={!cameraSupported}
												className="rounded-full border border-[#d5bda7] bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#3e2b24] disabled:opacity-50"
											>
												{cameraActive ? "Stop Camera" : "Open Camera"}
											</button>
											<button
												type="button"
												onClick={captureFromCamera}
												disabled={!hasCameraStream}
												className="rounded-full bg-[#1f1410] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#f7ede2] disabled:opacity-50"
											>
												Capture
											</button>
										</div>
									</div>

									{hasCameraStream ? (
										<video
											ref={videoRef}
											autoPlay
											className="h-56 w-full object-cover [transform:scaleX(-1)]"
											muted
											playsInline
										/>
									) : (
										<div className="flex h-56 items-center justify-center bg-[#f2dfca] text-center text-xs font-semibold uppercase tracking-[0.14em] text-[#7a573f]">
											Open Camera dabao, yahin live frame dikhega
										</div>
									)}
								</div>
							) : null}
							<canvas ref={canvasRef} className="hidden" />
						</div>

						<button
							onClick={handleSubmit}
							disabled={loading}
							className="mt-5 w-full rounded-full bg-[#1f1410] px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#f7ede2] transition hover:-translate-y-0.5 disabled:opacity-60"
						>
							{loading ? "Analyzing..." : "Get AI Suggestions"}
						</button>

						{error ? <p className="mt-3 text-sm text-[#b6402b]">{error}</p> : null}
					</div>
				</div>

				<div className="md:col-span-3">
					<div className="rounded-3xl border border-[#e7d7c7] bg-[#fff9f2] p-5 shadow-[0_15px_30px_rgba(46,26,14,0.1)]">
						<p className="text-xs uppercase tracking-[0.24em] text-[#8e6344]">Output</p>
						<h2 className="display-font mt-2 text-3xl text-[#241710]">Recommendation Result</h2>

						{result ? (
							<div className="mt-5 space-y-5">
								<div className="rounded-2xl bg-[#f6e7d4] p-4 text-sm text-[#3d2a1f]">
									<p className="font-semibold">{result.inputSummary}</p>
									<p className="mt-1 text-xs text-[#664836]">{result.nextStep}</p>
									{result.provider ? (
										<p className="mt-2 inline-flex rounded-full bg-[#3d2a1f] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#ffe8cf]">
											Provider: {result.provider}
										</p>
									) : null}
								</div>

								<div>
									<p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6b4a33]">
										Recommended Items
									</p>
									<div className="mt-2 grid gap-2 md:grid-cols-2">
										{result.recommendedItems.map((item) => (
											<div key={item.name} className="rounded-xl border border-[#e8d7c7] bg-white p-3">
												<p className="text-sm font-semibold text-[#27170f]">{item.name}</p>
												<p className="text-xs uppercase tracking-[0.16em] text-[#956a4b]">
													{item.category}
												</p>
												<p className="mt-1 text-xs text-[#5c4435]">{item.reason}</p>
											</div>
										))}
									</div>
								</div>

								<div className="grid gap-3 md:grid-cols-2">
									<div className="rounded-xl bg-[#f9ecdd] p-3">
										<p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6b4a33]">
											Color Suggestions
										</p>
										<p className="mt-2 text-sm text-[#3d2a1f]">
											{result.colorSuggestions.join(", ")}
										</p>
									</div>
									<div className="rounded-xl bg-[#f9ecdd] p-3">
										<p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6b4a33]">
											Style Suggestions
										</p>
										<p className="mt-2 text-sm text-[#3d2a1f]">
											{result.styleSuggestions.join(", ")}
										</p>
									</div>
								</div>

								<div>
									<p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6b4a33]">
										Generated Preview
									</p>
									<div className="relative mt-2 h-72 overflow-hidden rounded-2xl border border-[#e8d7c7] bg-[#f4e4d3]">
										<Image
											src={result.previewImageUrl}
											alt="AI outfit preview"
											fill
											unoptimized
											className="object-cover"
										/>
									</div>
									<button
										type="button"
										onClick={handleDownloadPreview}
										disabled={downloadLoading}
										className="mt-3 rounded-full bg-[#1f1410] px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#f7ede2] disabled:opacity-60"
									>
										{downloadLoading ? "Preparing..." : "Download Preview"}
									</button>
								</div>
							</div>
						) : (
							<p className="mt-4 text-sm text-[#5d4535]">
								Mode choose karke input do, fir AI recommendation output yahin show hoga.
							</p>
						)}
					</div>
				</div>
			</section>

			<Footer />
			<WhatsAppButton />
		</main>
	);
}
