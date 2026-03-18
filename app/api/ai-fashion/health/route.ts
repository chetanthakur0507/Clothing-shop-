import { NextResponse } from "next/server";
import { isGrokConfigured } from "@/lib/ai-fashion/grok-client";

const AI_SERVICE_URL = process.env.AI_FASHION_SERVICE_URL ?? "http://127.0.0.1:8010";
const HEALTH_TIMEOUT_MS = Number(process.env.AI_FASHION_HEALTH_TIMEOUT_MS ?? "15000");

type PythonHealth = {
	ok?: boolean;
	embedding_mode?: string;
	error?: string | null;
};

export async function GET() {
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), HEALTH_TIMEOUT_MS);
	const grokReady = isGrokConfigured();

	try {
		const res = await fetch(`${AI_SERVICE_URL}/health`, {
			method: "GET",
			signal: controller.signal,
		});

		const raw = (await res.json().catch(() => ({}))) as PythonHealth;
		const pythonReady = Boolean(raw.ok && raw.embedding_mode === "clip");
		const modelReady = pythonReady || grokReady;
		const embeddingMode = pythonReady ? raw.embedding_mode ?? "clip" : grokReady ? "grok-fallback" : "offline";
		const error =
			pythonReady || grokReady
				? null
				: raw.error ?? "No active AI provider. Start Python model or configure XAI_API_KEY.";

		return NextResponse.json({
			webApiOnline: true,
			aiServiceReachable: res.ok,
			modelReady,
			embeddingMode,
			error,
			grokFallbackReady: grokReady,
		});
	} catch (error) {
		const message = error instanceof Error ? error.message : "Health check failed";
		return NextResponse.json({
			webApiOnline: true,
			aiServiceReachable: false,
			modelReady: grokReady,
			embeddingMode: grokReady ? "grok-fallback" : "offline",
			error: grokReady ? null : message,
			grokFallbackReady: grokReady,
		});
	} finally {
		clearTimeout(timeout);
	}
}
