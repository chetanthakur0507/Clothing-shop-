import { NextResponse } from "next/server";
import { callPythonJson } from "@/lib/ai-fashion/python-client";
import type { RecommendationResponse } from "@/lib/ai-fashion/types";

export async function POST(request: Request) {
	try {
		const body = (await request.json()) as { item?: string };
		const item = body.item?.trim();

		if (!item) {
			return NextResponse.json({ error: "item is required" }, { status: 400 });
		}

		const result = await callPythonJson<RecommendationResponse>("/predict/item", { item });
		return NextResponse.json(result);
	} catch (error) {
		return NextResponse.json(
			{ error: error instanceof Error ? error.message : "Python service unavailable" },
			{ status: 502 },
		);
	}
}
