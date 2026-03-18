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

    def _build_mannequin_preview_prompt(
        self,
        anchor_text: str,
        items: list[dict],
        color_suggestions: list[str],
        style_suggestions: list[str],
    ) -> str:
        item_names = ", ".join(i["name"] for i in items) if items else "coordinated outfit pieces"
        colors = ", ".join(color_suggestions[:3]) if color_suggestions else "neutral palette"
        styles = ", ".join(style_suggestions[:2]) if style_suggestions else "smart casual"
        return (
            "Studio fashion ecommerce photoshoot of a full-body mannequin (dummy model) wearing the exact outfit. "
            f"Anchor item: {anchor_text}. Outfit pieces: {item_names}. "
            f"Color palette: {colors}. Style: {styles}. "
            "Front-facing mannequin, clean seamless background, realistic fabric texture, no real person, no face."
        )

    def from_item(self, item_text: str) -> dict:
        vec = self.embedder.embed_text(item_text)
        candidates = self.index.search(vec, k=8)
        rules = self._rules_for_item(item_text)
        response_items = self._to_response_items(candidates)
        preview_prompt = self._build_mannequin_preview_prompt(
            anchor_text=item_text,
            items=response_items,
            color_suggestions=rules["colorSuggestions"],
            style_suggestions=rules["styleSuggestions"],
        )
        preview = generate_outfit_preview(preview_prompt)

        return {
            "inputSummary": f"Selected item: {item_text}",
            "recommendedItems": response_items,
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
        response_items = self._to_response_items(candidates)
        preview_prompt = self._build_mannequin_preview_prompt(
            anchor_text=f"uploaded clothing from {filename}",
            items=response_items,
            color_suggestions=rules["colorSuggestions"],
            style_suggestions=rules["styleSuggestions"],
        )
        preview = generate_outfit_preview(preview_prompt)

        return {
            "inputSummary": f"Image analyzed: {filename} (detected as {guess})",
            "recommendedItems": response_items,
            "colorSuggestions": rules["colorSuggestions"],
            "styleSuggestions": rules["styleSuggestions"],
            "previewImageUrl": preview,
            "nextStep": "Replace filename heuristics with fine-grained classifier labels.",
        }

    def from_user_photo(self, image: Image.Image, filename: str) -> dict:
        vec = self.embedder.embed_image(image)
        candidates = self.index.search(vec, k=8)
        color_suggestions = ["Navy", "Beige", "White", "Olive"]
        style_suggestions = ["Smart Casual", "Urban Minimal", "Weekend Formal"]
        response_items = self._to_response_items(candidates)
        preview_prompt = self._build_mannequin_preview_prompt(
            anchor_text=f"style profile inspired by user photo {filename}",
            items=response_items,
            color_suggestions=color_suggestions,
            style_suggestions=style_suggestions,
        )
        preview = generate_outfit_preview(preview_prompt)

        return {
            "inputSummary": f"User photo uploaded: {filename}",
            "recommendedItems": response_items,
            "colorSuggestions": color_suggestions,
            "styleSuggestions": style_suggestions,
            "previewImageUrl": preview,
            "nextStep": "Integrate person segmentation + virtual try-on model for body-aware previews.",
        }
