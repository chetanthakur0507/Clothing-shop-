from __future__ import annotations

import hashlib
import os
import numpy as np
from PIL import Image


class EmbeddingEngine:
    """
    Pretrained FashionCLIP/CLIP embedding engine.
    In strict mode (default), requests fail if pretrained model is unavailable.
    """

    def __init__(self, model_name: str = "patrickjohncyh/fashion-clip") -> None:
        self.model_name = model_name
        self.mode = "unavailable"
        self.processor = None
        self.model = None
        self.dim = 512
        self.last_error: str | None = None
        self.require_pretrained = os.getenv("REQUIRE_PRETRAINED", "1") == "1"

        # Explicit opt-in to load the pretrained model.
        if os.getenv("ENABLE_FASHIONCLIP", "1") != "1":
            self.last_error = "ENABLE_FASHIONCLIP is disabled"
            return
        try:
            from transformers import CLIPModel, CLIPProcessor

            self.processor = CLIPProcessor.from_pretrained(model_name, use_fast=True)
            self.model = CLIPModel.from_pretrained(model_name)
            self.mode = "clip"
            self.dim = int(self.model.config.projection_dim)
        except Exception as exc:
            self.mode = "unavailable"
            self.last_error = str(exc)

    def _ensure_model_ready(self) -> None:
        if self.mode == "clip":
            return
        if self.require_pretrained:
            raise RuntimeError(
                "Pretrained embedding model unavailable. "
                f"mode={self.mode}, error={self.last_error or 'unknown'}"
            )

    def _normalize(self, vec: np.ndarray) -> np.ndarray:
        norm = np.linalg.norm(vec)
        if norm == 0:
            return vec
        return vec / norm

    def _hash_vector(self, key: str) -> np.ndarray:
        seed = int(hashlib.md5(key.encode("utf-8")).hexdigest()[:8], 16)
        rng = np.random.default_rng(seed)
        vec = rng.normal(size=self.dim).astype("float32")
        return self._normalize(vec)

    def embed_text(self, text: str) -> np.ndarray:
        self._ensure_model_ready()
        if self.mode == "clip" and self.model and self.processor:
            inputs = self.processor(text=[text], return_tensors="pt", padding=True)
            outputs = self.model.get_text_features(**inputs)
            vec = outputs.detach().cpu().numpy()[0].astype("float32")
            return self._normalize(vec)
        return self._hash_vector(text)

    def embed_image(self, image: Image.Image) -> np.ndarray:
        self._ensure_model_ready()
        if self.mode == "clip" and self.model and self.processor:
            inputs = self.processor(images=image.convert("RGB"), return_tensors="pt")
            outputs = self.model.get_image_features(**inputs)
            vec = outputs.detach().cpu().numpy()[0].astype("float32")
            return self._normalize(vec)

        key = f"{image.size[0]}x{image.size[1]}_{image.getbbox()}"
        return self._hash_vector(key)
