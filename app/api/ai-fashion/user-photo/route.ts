import { NextResponse } from "next/server";
import { callPythonMultipart } from "@/lib/ai-fashion/python-client";
import type { RecommendationResponse } from "@/lib/ai-fashion/types";

export async function POST(request: Request) {
	try {
		const formData = await request.formData();
		const photo = formData.get("photo") as File | null;

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
		return NextResponse.json(
			{ error: error instanceof Error ? error.message : "Python service unavailable" },
			{ status: 502 },
		);
	}
}
