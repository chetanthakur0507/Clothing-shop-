from pydantic import BaseModel
from typing import Literal


class ItemPredictRequest(BaseModel):
    item: str


class RecommendationItem(BaseModel):
    name: str
    category: Literal["top", "bottom", "footwear", "accessory"]
    reason: str


class RecommendationResponse(BaseModel):
    inputSummary: str
    recommendedItems: list[RecommendationItem]
    colorSuggestions: list[str]
    styleSuggestions: list[str]
    previewImageUrl: str
    nextStep: str
