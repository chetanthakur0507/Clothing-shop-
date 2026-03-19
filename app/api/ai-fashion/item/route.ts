import { NextResponse } from "next/server";
import { AIServiceError, callPythonJson } from "@/lib/ai-fashion/python-client";
import { isGrokConfigured, recommendWithGrokFromItem } from "@/lib/ai-fashion/grok-client";
import { recommendFromItem } from "@/lib/ai-fashion/mock";
import type { RecommendationResponse } from "@/lib/ai-fashion/types";

export async function POST(request: Request) {
	let item = "";
	try {
		const body = (await request.json()) as { item?: string };
		item = body.item?.trim() ?? "";

		if (!item) {
			return NextResponse.json({ error: "item is required" }, { status: 400 });
		}

		const result = await callPythonJson<RecommendationResponse>("/predict/item", { item });
		return NextResponse.json(result);
	} catch (error) {
		if (isGrokConfigured()) {
			try {
				if (item) {
					const result = await recommendWithGrokFromItem(item);
					return NextResponse.json({ ...result, provider: "grok-fallback" });
				}
			} catch {
				// Ignore and try dummy fallback below.
			}
		}

		if (item) {
			const result = recommendFromItem(item);
			return NextResponse.json({ ...result, provider: "mock-fallback" });
		}

		const status = error instanceof AIServiceError ? error.status : 502;
		return NextResponse.json(
			{ error: error instanceof Error ? error.message : "Python service unavailable" },
			{ status },
		);
	}
}
