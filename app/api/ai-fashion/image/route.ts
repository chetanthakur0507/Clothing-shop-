import { NextResponse } from "next/server";
import { AIServiceError, callPythonMultipart } from "@/lib/ai-fashion/python-client";
import { isGrokConfigured, recommendWithGrokFromImage } from "@/lib/ai-fashion/grok-client";
import { recommendFromImageName } from "@/lib/ai-fashion/mock";
import type { RecommendationResponse } from "@/lib/ai-fashion/types";

export async function POST(request: Request) {
	let image: File | null = null;
	try {
		const formData = await request.formData();
		image = formData.get("image") as File | null;

		if (!image) {
			return NextResponse.json({ error: "image is required" }, { status: 400 });
		}

		const result = await callPythonMultipart<RecommendationResponse>(
			"/predict/image",
			"image",
			image,
		);
		return NextResponse.json(result);
	} catch (error) {
		if (isGrokConfigured() && image) {
			try {
				const result = await recommendWithGrokFromImage(image);
				return NextResponse.json({ ...result, provider: "grok-fallback" });
			} catch {
				// Ignore and try dummy fallback below.
			}
		}

		if (image) {
			const result = recommendFromImageName(image.name || "Uploaded clothing image");
			return NextResponse.json({ ...result, provider: "mock-fallback" });
		}

		const status = error instanceof AIServiceError ? error.status : 502;
		return NextResponse.json(
			{ error: error instanceof Error ? error.message : "Python service unavailable" },
			{ status },
		);
	}
}
