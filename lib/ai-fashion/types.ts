export type RecommendationItem = {
	name: string;
	category: "top" | "bottom" | "footwear" | "accessory";
	reason: string;
};

export type RecommendationResponse = {
	inputSummary: string;
	recommendedItems: RecommendationItem[];
	colorSuggestions: string[];
	styleSuggestions: string[];
	previewImageUrl: string;
	nextStep: string;
};
