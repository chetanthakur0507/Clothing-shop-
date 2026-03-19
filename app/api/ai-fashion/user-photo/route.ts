import { NextResponse } from "next/server";
import { AIServiceError, callPythonMultipart } from "@/lib/ai-fashion/python-client";
import { isGrokConfigured, recommendWithGrokFromUserPhoto } from "@/lib/ai-fashion/grok-client";
import { recommendFromUserPhoto } from "@/lib/ai-fashion/mock";
import type { RecommendationResponse } from "@/lib/ai-fashion/types";

export async function POST(request: Request) {
	let photo: File | null = null;
	try {
		const formData = await request.formData();
		photo = formData.get("photo") as File | null;

		if (!photo) {
			return NextResponse.json({ error: "photo is required" }, { status: 400 });
		}

		const result = await callPythonMultipart<RecommendationResponse>(
			"/predict/user-photo",
			"photo",
			photo,
		);
		return NextResponse.json(result);
	} catch (error) {
		if (isGrokConfigured() && photo) {
			try {
				const result = await recommendWithGrokFromUserPhoto(photo);
				return NextResponse.json({ ...result, provider: "grok-fallback" });
			} catch {
				// Ignore and try dummy fallback below.
			}
		}

		if (photo) {
			const result = recommendFromUserPhoto(photo.name || "Uploaded user photo");
			return NextResponse.json({ ...result, provider: "mock-fallback" });
		}

		const status = error instanceof AIServiceError ? error.status : 502;
		return NextResponse.json(
			{ error: error instanceof Error ? error.message : "Python service unavailable" },
			{ status },
		);
	}
}
