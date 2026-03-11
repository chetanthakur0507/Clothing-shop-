import { NextResponse } from "next/server";

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

	try {
		const res = await fetch(`${AI_SERVICE_URL}/health`, {
			method: "GET",
			signal: controller.signal,
		});

		const raw = (await res.json().catch(() => ({}))) as PythonHealth;
		const modelReady = Boolean(raw.ok && raw.embedding_mode === "clip");

		return NextResponse.json({
			webApiOnline: true,
			aiServiceReachable: res.ok,
			modelReady,
			embeddingMode: raw.embedding_mode ?? "unknown",
			error: raw.error ?? null,
		});
	} catch (error) {
		const message = error instanceof Error ? error.message : "Health check failed";
		return NextResponse.json({
			webApiOnline: true,
			aiServiceReachable: false,
			modelReady: false,
			embeddingMode: "offline",
			error: message,
		});
	} finally {
		clearTimeout(timeout);
	}
}
