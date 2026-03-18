import { NextResponse } from "next/server";
import { AIServiceError, callPythonMultipart } from "@/lib/ai-fashion/python-client";
import type { RecommendationResponse } from "@/lib/ai-fashion/types";

export async function POST(request: Request) {
	try {
		const formData = await request.formData();
		const image = formData.get("image") as File | null;

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
		const status = error instanceof AIServiceError ? error.status : 502;
		return NextResponse.json(
			{ error: error instanceof Error ? error.message : "Python service unavailable" },
			{ status },
		);
	}
}
