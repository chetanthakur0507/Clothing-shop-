from __future__ import annotations

from io import BytesIO

from fastapi import FastAPI, File, HTTPException, UploadFile
from PIL import Image

from app.embedding import EmbeddingEngine
from app.faiss_index import FaissCatalogIndex
from app.grok_fallback import (
    is_grok_configured,
    recommend_from_image as grok_from_image,
    recommend_from_item as grok_from_item,
    recommend_from_user_photo as grok_from_user_photo,
)
from app.matcher import HybridOutfitMatcher
from app.schemas import ItemPredictRequest, RecommendationResponse

app = FastAPI(title="AI Fashion Service", version="1.0.0")

embedder = EmbeddingEngine()
index = FaissCatalogIndex(embedder)
matcher = HybridOutfitMatcher(embedder, index)


@app.get("/health")
def health() -> dict:
    local_ready = embedder.mode == "clip"
    grok_ready = is_grok_configured()
    model_ready = local_ready or grok_ready
    active_mode = "clip" if local_ready else "grok-fallback" if grok_ready else embedder.mode
    return {
        "ok": model_ready,
        "embedding_mode": active_mode,
        "index_size": len(index.items),
        "model_name": embedder.model_name,
        "error": None if model_ready else embedder.last_error,
        "grok_configured": grok_ready,
    }


@app.post("/predict/item", response_model=RecommendationResponse)
def predict_item(payload: ItemPredictRequest) -> dict:
    item = payload.item.strip()
    if not item:
        raise HTTPException(status_code=400, detail="item is required")
    if embedder.mode != "clip" and is_grok_configured():
        try:
            return grok_from_item(item)
        except RuntimeError as exc:
            raise HTTPException(status_code=503, detail=str(exc)) from exc
    try:
        return matcher.from_item(item)
    except RuntimeError as exc:
        if is_grok_configured():
            try:
                return grok_from_item(item)
            except RuntimeError as grok_exc:
                raise HTTPException(status_code=503, detail=str(grok_exc)) from grok_exc
        raise HTTPException(status_code=503, detail=str(exc)) from exc


@app.post("/predict/image", response_model=RecommendationResponse)
async def predict_image(image: UploadFile = File(...)) -> dict:
    raw = await image.read()
    if not raw:
        raise HTTPException(status_code=400, detail="image is required")
    pil = Image.open(BytesIO(raw)).convert("RGB")
    if embedder.mode != "clip" and is_grok_configured():
        try:
            return grok_from_image(pil, image.filename or "uploaded-image")
        except RuntimeError as exc:
            raise HTTPException(status_code=503, detail=str(exc)) from exc
    try:
        return matcher.from_image(pil, image.filename or "uploaded-image")
    except RuntimeError as exc:
        if is_grok_configured():
            try:
                return grok_from_image(pil, image.filename or "uploaded-image")
            except RuntimeError as grok_exc:
                raise HTTPException(status_code=503, detail=str(grok_exc)) from grok_exc
        raise HTTPException(status_code=503, detail=str(exc)) from exc


@app.post("/predict/user-photo", response_model=RecommendationResponse)
async def predict_user_photo(photo: UploadFile = File(...)) -> dict:
    raw = await photo.read()
    if not raw:
        raise HTTPException(status_code=400, detail="photo is required")
    pil = Image.open(BytesIO(raw)).convert("RGB")
    if embedder.mode != "clip" and is_grok_configured():
        try:
            return grok_from_user_photo(pil, photo.filename or "user-photo")
        except RuntimeError as exc:
            raise HTTPException(status_code=503, detail=str(exc)) from exc
    try:
        return matcher.from_user_photo(pil, photo.filename or "user-photo")
    except RuntimeError as exc:
        if is_grok_configured():
            try:
                return grok_from_user_photo(pil, photo.filename or "user-photo")
            except RuntimeError as grok_exc:
                raise HTTPException(status_code=503, detail=str(grok_exc)) from grok_exc
        raise HTTPException(status_code=503, detail=str(exc)) from exc
