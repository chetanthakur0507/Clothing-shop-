const AI_SERVICE_URL = process.env.AI_FASHION_SERVICE_URL ?? "http://127.0.0.1:8010";
const AI_TIMEOUT_MS = Number(process.env.AI_FASHION_TIMEOUT_MS ?? "90000");
const AI_HEALTH_TIMEOUT_MS = Number(process.env.AI_FASHION_HEALTH_TIMEOUT_MS ?? "15000");

type HealthResponse = {
	ok?: boolean;
	embedding_mode?: string;
	error?: string | null;
};

function withTimeoutSignal() {
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), AI_TIMEOUT_MS);
	return { controller, timeout };
}

async function ensurePythonReady() {
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), AI_HEALTH_TIMEOUT_MS);
	try {
		const response = await fetch(`${AI_SERVICE_URL}/health`, {
			method: "GET",
			signal: controller.signal,
		});

		if (!response.ok) {
			throw new Error("AI service health check failed.");
		}

		const health = (await response.json()) as HealthResponse;
		if (!health.ok || health.embedding_mode !== "clip") {
			throw new Error(
				`AI model अभी ready nahi hai (mode: ${health.embedding_mode ?? "unknown"}). ${health.error ?? ""}`.trim(),
			);
		}
	} catch (error) {
		if (error instanceof DOMException && error.name === "AbortError") {
			// Non-blocking: service may still be starting up or model may be loading.
			// Let the actual prediction request proceed with the longer AI_TIMEOUT_MS.
			return;
		}

		// If health check itself fails for transient reasons, try actual request path.
		return;
	} finally {
		clearTimeout(timeout);
	}
}

export async function callPythonJson<T>(path: string, payload: unknown): Promise<T> {
	await ensurePythonReady();
	const { controller, timeout } = withTimeoutSignal();
	let response: Response;
	try {
		try {
			response = await fetch(`${AI_SERVICE_URL}${path}`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
				signal: controller.signal,
			});
		} catch (error) {
			if (error instanceof DOMException && error.name === "AbortError") {
				throw new Error(
					`AI service response timed out after ${Math.round(AI_TIMEOUT_MS / 1000)}s. Please try again.`,
				);
			}
			throw new Error("AI service se connection nahi ho paaya. Service running check karein.");
		}
	} finally {
		clearTimeout(timeout);
	}

	if (!response.ok) {
		const text = await response.text();
		throw new Error(text || `Python service request failed (${response.status})`);
	}

	return (await response.json()) as T;
}

export async function callPythonMultipart<T>(
	path: string,
	field: "image" | "photo",
	file: File,
): Promise<T> {
	await ensurePythonReady();
	const { controller, timeout } = withTimeoutSignal();
	const formData = new FormData();
	formData.append(field, file);

	let response: Response;
	try {
		try {
			response = await fetch(`${AI_SERVICE_URL}${path}`, {
				method: "POST",
				body: formData,
				signal: controller.signal,
			});
		} catch (error) {
			if (error instanceof DOMException && error.name === "AbortError") {
				throw new Error(
					`AI service response timed out after ${Math.round(AI_TIMEOUT_MS / 1000)}s. Please try again.`,
				);
			}
			throw new Error("AI service se connection nahi ho paaya. Service running check karein.");
		}
	} finally {
		clearTimeout(timeout);
	}

	if (!response.ok) {
		const text = await response.text();
		throw new Error(text || `Python service request failed (${response.status})`);
	}

	return (await response.json()) as T;
}
