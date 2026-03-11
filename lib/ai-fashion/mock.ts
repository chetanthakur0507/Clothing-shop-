import type { RecommendationItem, RecommendationResponse } from "@/lib/ai-fashion/types";

const itemMap: Record<string, RecommendationItem[]> = {
	"black t-shirt": [
		{ name: "White Sneakers", category: "footwear", reason: "High contrast clean look" },
		{ name: "Grey Cargo Pants", category: "bottom", reason: "Balances casual street vibe" },
		{ name: "Blue Denim Jeans", category: "bottom", reason: "Classic pairing for all-day wear" },
	],
	"red hoodie": [
		{ name: "Black Jeans", category: "bottom", reason: "Tones down bright upper color" },
		{ name: "White Sneakers", category: "footwear", reason: "Keeps outfit fresh and sporty" },
		{ name: "Grey Joggers", category: "bottom", reason: "Athleisure friendly combination" },
	],
};

function inferColor(text: string): string {
	const lower = text.toLowerCase();
	if (lower.includes("red")) return "Red";
	if (lower.includes("black")) return "Black";
	if (lower.includes("blue")) return "Blue";
	if (lower.includes("green")) return "Green";
	if (lower.includes("white")) return "White";
	return "Neutral";
}

function defaultItems(color: string): RecommendationItem[] {
	if (color === "Red") {
		return [
			{ name: "Black Tapered Jeans", category: "bottom", reason: "Grounds bright color" },
			{ name: "White Low-top Sneakers", category: "footwear", reason: "Adds clean contrast" },
			{ name: "Charcoal Cap", category: "accessory", reason: "Complements street silhouette" },
		];
	}

	if (color === "Black") {
		return [
			{ name: "Beige Chinos", category: "bottom", reason: "Adds warm color contrast" },
			{ name: "White Sneakers", category: "footwear", reason: "Modern minimal finish" },
			{ name: "Silver Watch", category: "accessory", reason: "Elevates monochrome outfit" },
		];
	}

	return [
		{ name: "Navy Slim Jeans", category: "bottom", reason: "Versatile for most tops" },
		{ name: "Off-White Sneakers", category: "footwear", reason: "Neutral pairing" },
		{ name: "Minimal Belt", category: "accessory", reason: "Structured outfit shape" },
	];
}

export function recommendFromItem(selectedItem: string): RecommendationResponse {
	const key = selectedItem.trim().toLowerCase();
	const color = inferColor(key);
	const recommendedItems = itemMap[key] ?? defaultItems(color);

	return {
		inputSummary: `Selected item: ${selectedItem}`,
		recommendedItems,
		colorSuggestions: ["White", "Grey", "Navy", "Beige"],
		styleSuggestions: ["Smart Casual", "Streetwear", "Minimal"],
		previewImageUrl:
			"https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=1200&q=80",
		nextStep: "Use CLIP embedding + FAISS to replace rule-based matching.",
	};
}

export function recommendFromImageName(imageName: string): RecommendationResponse {
	const lower = imageName.toLowerCase();
	const guess = lower.includes("hoodie") ? "Red Hoodie" : lower.includes("shirt") ? "Black T-shirt" : "Uploaded clothing item";
	const result = recommendFromItem(guess);

	return {
		...result,
		inputSummary: `Image analyzed: ${imageName} (detected as ${guess})`,
		nextStep: "Connect FashionCLIP service to infer type/color/style from pixels.",
	};
}

export function recommendFromUserPhoto(photoName: string): RecommendationResponse {
	return {
		inputSummary: `User photo uploaded: ${photoName}`,
		recommendedItems: [
			{ name: "Navy Blue Shirt", category: "top", reason: "Complements most skin tones" },
			{ name: "Beige Chinos", category: "bottom", reason: "Balanced warm neutral" },
			{ name: "White Sneakers", category: "footwear", reason: "Clean finishing touch" },
		],
		colorSuggestions: ["Navy", "Beige", "White", "Olive"],
		styleSuggestions: ["Smart Casual", "Weekend Formal", "Urban Minimal"],
		previewImageUrl:
			"https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=1200&q=80",
		nextStep: "Use human parsing + virtual try-on model for person-specific preview.",
	};
}
