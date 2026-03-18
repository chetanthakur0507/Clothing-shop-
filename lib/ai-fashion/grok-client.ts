import type { RecommendationItem, RecommendationResponse } from "@/lib/ai-fashion/types";

type Mode = "item" | "image" | "user-photo";
type RecommendationPayload = Omit<RecommendationResponse, "previewImageUrl">;

type XAIChatMessage = {
	role: "system" | "user" | "assistant";
	content: string | Array<{ type: "text"; text: string } | { type: "image_url"; image_url: { url: string } }>;
};

type XAIChatResponse = {
	choices?: Array<{
		message?: {
			content?: string | Array<{ type?: string; text?: string }>;
		};
	}>;
	error?: { message?: string };
};

type XAIImageResponse = {
	data?: Array<{ url?: string; b64_json?: string }>;
	error?: { message?: string };
};

const XAI_API_KEY = process.env.XAI_API_KEY ?? process.env.GROK_API_KEY;
const XAI_BASE_URL = process.env.XAI_BASE_URL ?? "https://api.x.ai/v1";
const XAI_CHAT_MODEL = process.env.XAI_CHAT_MODEL ?? "grok-3-mini";
const XAI_IMAGE_MODEL = process.env.XAI_IMAGE_MODEL ?? "grok-2-image-1212";
const XAI_TIMEOUT_MS = Number(process.env.XAI_TIMEOUT_MS ?? "70000");

const FALLBACK_PREVIEW_URL = "https://picsum.photos/seed/fashion-preview/1200/900";

export function isGrokConfigured(): boolean {
	return Boolean(XAI_API_KEY?.trim());
}

export async function recommendWithGrokFromItem(item: string): Promise<RecommendationResponse> {
	const payload = await requestRecommendation("item", `User selected item: ${item}`);
	const previewImageUrl = await safeGeneratePreviewImage(
		`High-quality ecommerce outfit photo of a stylish look built around ${item}.`,
		payload,
	);
	return {
		...payload,
		previewImageUrl,
	};
}

export async function recommendWithGrokFromImage(file: File): Promise<RecommendationResponse> {
	const dataUrl = await toDataUrl(file);
	const payload = await requestRecommendation("image", `Analyze uploaded clothing image: ${file.name}`, dataUrl);
	const previewImageUrl = await safeGeneratePreviewImage(
		"Studio fashion shot of a complete outfit inspired by the analyzed clothing image.",
		payload,
	);
	return {
		...payload,
		previewImageUrl,
	};
}

export async function recommendWithGrokFromUserPhoto(file: File): Promise<RecommendationResponse> {
	const dataUrl = await toDataUrl(file);
	const payload = await requestRecommendation(
		"user-photo",
		`Analyze user photo for styling suggestions: ${file.name}`,
		dataUrl,
	);
	const previewImageUrl = await safeGeneratePreviewImage(
		"Photorealistic outfit concept for a user styling consultation, full body fashion editorial style.",
		payload,
	);
	return {
		...payload,
		previewImageUrl,
	};
}

async function requestRecommendation(
	mode: Mode,
	prompt: string,
	imageDataUrl?: string,
): Promise<RecommendationPayload> {
	ensureGrokConfigured();

	const systemPrompt = [
		"You are a fashion stylist assistant for an ecommerce web app.",
		"Return ONLY valid JSON with this schema:",
		"{",
		'  "inputSummary": "string",',
		'  "recommendedItems": [{ "name": "string", "category": "top|bottom|footwear|accessory", "reason": "string" }],',
		'  "colorSuggestions": ["string"],',
		'  "styleSuggestions": ["string"],',
		'  "nextStep": "string"',
		"}",
		"Recommended items should be 3 to 5 entries with practical mix-and-match advice.",
		"Keep output concise and production safe.",
	].join("\n");

	const userText = `${prompt}\nMode: ${mode}`;
	const content = imageDataUrl
		? [
				{ type: "text" as const, text: userText },
				{ type: "image_url" as const, image_url: { url: imageDataUrl } },
			]
		: userText;

	const res = await fetchWithTimeout<XAIChatResponse>(`${XAI_BASE_URL}/chat/completions`, {
		method: "POST",
		headers: xaiHeaders(),
		body: JSON.stringify({
			model: XAI_CHAT_MODEL,
			temperature: 0.35,
			max_tokens: 700,
			messages: [
				{ role: "system", content: systemPrompt },
				{ role: "user", content },
			] satisfies XAIChatMessage[],
		}),
	});

	if (res.error?.message) {
		throw new Error(`Grok chat error: ${res.error.message}`);
	}

	const rawContent = getChatText(res);
	if (!rawContent) {
		throw new Error("Grok returned empty content.");
	}

	const parsed = parseJsonObject(rawContent) as Partial<RecommendationPayload>;
	return normalizePayload(parsed, mode, prompt);
}

async function safeGeneratePreviewImage(basePrompt: string, payload: RecommendationPayload): Promise<string> {
	try {
		return await generatePreviewImage(basePrompt, payload);
	} catch {
		return FALLBACK_PREVIEW_URL;
	}
}

async function generatePreviewImage(basePrompt: string, payload: RecommendationPayload): Promise<string> {
	ensureGrokConfigured();

	const styleHint = payload.styleSuggestions.slice(0, 2).join(", ");
	const colorHint = payload.colorSuggestions.slice(0, 3).join(", ");
	const heroItem = payload.recommendedItems[0]?.name ?? "stylish outfit";
	const prompt = `${basePrompt} Include ${heroItem}. Color direction: ${colorHint}. Style: ${styleHint}. Realistic fashion catalog lighting.`;

	const res = await fetchWithTimeout<XAIImageResponse>(`${XAI_BASE_URL}/images/generations`, {
		method: "POST",
		headers: xaiHeaders(),
		body: JSON.stringify({
			model: XAI_IMAGE_MODEL,
			prompt,
			size: "1024x1024",
		}),
	});

	if (res.error?.message) {
		throw new Error(`Grok image error: ${res.error.message}`);
	}

	const image = res.data?.[0];
	if (!image) {
		throw new Error("No image returned from Grok.");
	}

	if (image.url) return image.url;
	if (image.b64_json) return `data:image/png;base64,${image.b64_json}`;

	throw new Error("Unsupported image payload from Grok.");
}

function normalizePayload(
	payload: Partial<RecommendationPayload>,
	mode: Mode,
	prompt: string,
): RecommendationPayload {
	const fallbackSummary =
		mode === "item"
			? prompt.replace(/^User selected item:\s*/i, "")
			: mode === "image"
				? "Uploaded clothing image"
				: "Uploaded user photo";

	const recommendedItems = Array.isArray(payload.recommendedItems)
		? payload.recommendedItems.slice(0, 5).map((item) => normalizeItem(item as Partial<RecommendationItem>))
		: [];

	return {
		inputSummary: safeText(payload.inputSummary, `Grok analysis for ${fallbackSummary}`),
		recommendedItems:
			recommendedItems.length > 0
				? recommendedItems
				: [
						{ name: "White Sneakers", category: "footwear", reason: "Versatile with most outfits" },
						{ name: "Dark Denim", category: "bottom", reason: "Balances casual and smart styling" },
						{ name: "Minimal Watch", category: "accessory", reason: "Adds clean premium detail" },
					],
		colorSuggestions: normalizeStringList(payload.colorSuggestions, ["White", "Navy", "Beige", "Black"]),
		styleSuggestions: normalizeStringList(payload.styleSuggestions, ["Smart Casual", "Streetwear", "Minimal"]),
		nextStep: safeText(
			payload.nextStep,
			"Generated via Grok API fallback. Improve with user profile and catalog inventory constraints.",
		),
	};
}

function normalizeItem(item: Partial<RecommendationItem>): RecommendationItem {
	return {
		name: safeText(item.name, "Style Essential"),
		category: normalizeCategory(item.category),
		reason: safeText(item.reason, "Works well with the selected style direction."),
	};
}

function normalizeCategory(value: RecommendationItem["category"] | string | undefined): RecommendationItem["category"] {
	if (value === "top" || value === "bottom" || value === "footwear" || value === "accessory") {
		return value;
	}
	const lower = String(value ?? "").toLowerCase();
	if (/(shoe|sneaker|boot|loafer)/.test(lower)) return "footwear";
	if (/(jean|pant|trouser|short|skirt)/.test(lower)) return "bottom";
	if (/(shirt|tee|t-shirt|hoodie|jacket|blazer|top)/.test(lower)) return "top";
	return "accessory";
}

function normalizeStringList(value: unknown, fallback: string[]): string[] {
	if (!Array.isArray(value)) return fallback;
	const list = value.map((entry) => String(entry).trim()).filter(Boolean).slice(0, 6);
	return list.length > 0 ? list : fallback;
}

function safeText(value: unknown, fallback: string): string {
	if (typeof value !== "string") return fallback;
	const cleaned = value.trim();
	return cleaned.length > 0 ? cleaned : fallback;
}

function parseJsonObject(raw: string): unknown {
	const trimmed = raw.trim();
	try {
		return JSON.parse(trimmed);
	} catch {
		const firstBrace = trimmed.indexOf("{");
		const lastBrace = trimmed.lastIndexOf("}");
		if (firstBrace >= 0 && lastBrace > firstBrace) {
			return JSON.parse(trimmed.slice(firstBrace, lastBrace + 1));
		}
		throw new Error("Could not parse JSON response from Grok.");
	}
}

function getChatText(response: XAIChatResponse): string {
	const content = response.choices?.[0]?.message?.content;
	if (typeof content === "string") return content;
	if (Array.isArray(content)) {
		return content
			.map((part) => (typeof part.text === "string" ? part.text : ""))
			.join("\n")
			.trim();
	}
	return "";
}

function xaiHeaders() {
	return {
		Authorization: `Bearer ${XAI_API_KEY}`,
		"Content-Type": "application/json",
	};
}

function ensureGrokConfigured() {
	if (!isGrokConfigured()) {
		throw new Error("Grok API not configured. Add GROK_API_KEY or XAI_API_KEY in .env.local.");
	}
}

async function toDataUrl(file: File): Promise<string> {
	const buffer = Buffer.from(await file.arrayBuffer());
	const mime = file.type || "image/jpeg";
	return `data:${mime};base64,${buffer.toString("base64")}`;
}

async function fetchWithTimeout<T>(url: string, init: RequestInit): Promise<T> {
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), XAI_TIMEOUT_MS);
	try {
		const res = await fetch(url, { ...init, signal: controller.signal });
		const text = await res.text();

		let parsed: unknown = {};
		if (text) {
			try {
				parsed = JSON.parse(text);
			} catch {
				throw new Error(`Invalid JSON from Grok API: ${text.slice(0, 200)}`);
			}
		}

		if (!res.ok) {
			const message =
				typeof parsed === "object" && parsed && "error" in parsed
					? (parsed as { error?: { message?: string } }).error?.message
					: undefined;
			throw new Error(message ?? `Grok API request failed (${res.status})`);
		}

		return parsed as T;
	} catch (error) {
		if (error instanceof DOMException && error.name === "AbortError") {
			throw new Error(`Grok API timeout after ${Math.round(XAI_TIMEOUT_MS / 1000)}s.`);
		}
		throw error;
	} finally {
		clearTimeout(timeout);
	}
}
