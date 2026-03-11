from __future__ import annotations

from PIL import Image

from app.embedding import EmbeddingEngine
from app.faiss_index import FaissCatalogIndex
from app.generation import generate_outfit_preview


class HybridOutfitMatcher:
    """
    Rule + ML hybrid matcher:
    - ML: CLIP/FashionCLIP embedding + FAISS nearest neighbors
    - Rule: category diversity + basic color balancing
    """

    def __init__(self, embedder: EmbeddingEngine, index: FaissCatalogIndex) -> None:
        self.embedder = embedder
        self.index = index

    def _rules_for_item(self, item_text: str) -> dict:
        lower = item_text.lower()
        if "black" in lower:
            return {
                "colorSuggestions": ["White", "Grey", "Blue", "Beige"],
                "styleSuggestions": ["Streetwear", "Minimal", "Smart Casual"],
            }
        if "red" in lower:
            return {
                "colorSuggestions": ["Black", "White", "Grey", "Charcoal"],
                "styleSuggestions": ["Sport Casual", "Athleisure", "Streetwear"],
            }
        return {
            "colorSuggestions": ["Navy", "Beige", "White", "Olive"],
            "styleSuggestions": ["Smart Casual", "Minimal", "Daily Casual"],
        }

    def _to_response_items(self, candidates: list[dict]) -> list[dict]:
        # Rule layer: choose category-diverse top results.
        picked = []
        used_categories = set()
        for c in candidates:
            category = c["category"]
            if category in used_categories and len(picked) < 2:
                continue
            used_categories.add(category)
            picked.append(
                {
                    "name": c["name"],
                    "category": c["category"],
                    "reason": f"Visual/style similarity score: {c['score']:.2f}",
                }
            )
            if len(picked) == 3:
                break
        return picked

    def from_item(self, item_text: str) -> dict:
        vec = self.embedder.embed_text(item_text)
        candidates = self.index.search(vec, k=8)
        rules = self._rules_for_item(item_text)
        prompt = f"Fashion outfit flat-lay photo: {item_text}, with matching items"
        preview = generate_outfit_preview(prompt)

        return {
            "inputSummary": f"Selected item: {item_text}",
            "recommendedItems": self._to_response_items(candidates),
            "colorSuggestions": rules["colorSuggestions"],
            "styleSuggestions": rules["styleSuggestions"],
            "previewImageUrl": preview,
            "nextStep": "Connected to FastAPI + FAISS hybrid pipeline.",
        }

    def from_image(self, image: Image.Image, filename: str) -> dict:
        vec = self.embedder.embed_image(image)
        candidates = self.index.search(vec, k=8)
        guess = "uploaded clothing item"
        rules = self._rules_for_item(filename)
        preview = generate_outfit_preview(f"Outfit suggestion for image file {filename}")

        return {
            "inputSummary": f"Image analyzed: {filename} (detected as {guess})",
            "recommendedItems": self._to_response_items(candidates),
            "colorSuggestions": rules["colorSuggestions"],
            "styleSuggestions": rules["styleSuggestions"],
            "previewImageUrl": preview,
            "nextStep": "Replace filename heuristics with fine-grained classifier labels.",
        }

    def from_user_photo(self, image: Image.Image, filename: str) -> dict:
        vec = self.embedder.embed_image(image)
        candidates = self.index.search(vec, k=8)
        preview = generate_outfit_preview(
            f"Virtual try-on style preview for user portrait {filename} with modern smart casual outfit"
        )

        return {
            "inputSummary": f"User photo uploaded: {filename}",
            "recommendedItems": self._to_response_items(candidates),
            "colorSuggestions": ["Navy", "Beige", "White", "Olive"],
            "styleSuggestions": ["Smart Casual", "Urban Minimal", "Weekend Formal"],
            "previewImageUrl": preview,
            "nextStep": "Integrate person segmentation + virtual try-on model for body-aware previews.",
        }
