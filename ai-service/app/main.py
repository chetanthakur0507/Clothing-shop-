from __future__ import annotations

from io import BytesIO

from fastapi import FastAPI, File, HTTPException, UploadFile
from PIL import Image

from app.embedding import EmbeddingEngine
from app.faiss_index import FaissCatalogIndex
from app.matcher import HybridOutfitMatcher
from app.schemas import ItemPredictRequest, RecommendationResponse

app = FastAPI(title="AI Fashion Service", version="1.0.0")

embedder = EmbeddingEngine()
index = FaissCatalogIndex(embedder)
matcher = HybridOutfitMatcher(embedder, index)


@app.get("/health")
def health() -> dict:
    model_ready = embedder.mode == "clip"
    return {
        "ok": model_ready,
        "embedding_mode": embedder.mode,
        "index_size": len(index.items),
        "model_name": embedder.model_name,
        "error": embedder.last_error,
    }


@app.post("/predict/item", response_model=RecommendationResponse)
def predict_item(payload: ItemPredictRequest) -> dict:
    item = payload.item.strip()
    if not item:
        raise HTTPException(status_code=400, detail="item is required")
    try:
        return matcher.from_item(item)
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc


@app.post("/predict/image", response_model=RecommendationResponse)
async def predict_image(image: UploadFile = File(...)) -> dict:
    raw = await image.read()
    if not raw:
        raise HTTPException(status_code=400, detail="image is required")
    pil = Image.open(BytesIO(raw)).convert("RGB")
    try:
        return matcher.from_image(pil, image.filename or "uploaded-image")
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc


@app.post("/predict/user-photo", response_model=RecommendationResponse)
async def predict_user_photo(photo: UploadFile = File(...)) -> dict:
    raw = await photo.read()
    if not raw:
        raise HTTPException(status_code=400, detail="photo is required")
    pil = Image.open(BytesIO(raw)).convert("RGB")
    try:
        return matcher.from_user_photo(pil, photo.filename or "user-photo")
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
