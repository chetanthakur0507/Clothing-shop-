from __future__ import annotations

import faiss
import numpy as np
from app.catalog import PRODUCT_CATALOG
from app.embedding import EmbeddingEngine


class FaissCatalogIndex:
    def __init__(self, embedder: EmbeddingEngine) -> None:
        self.embedder = embedder
        self.items = PRODUCT_CATALOG
        self.index = faiss.IndexFlatIP(embedder.dim)
        self._build()

    def _build(self) -> None:
        vectors = []
        for item in self.items:
            text = f"{item['name']} {' '.join(item['tags'])} {' '.join(item['style'])}"
            vectors.append(self.embedder.embed_text(text))
        matrix = np.vstack(vectors).astype("float32")
        self.index.add(matrix)

    def search(self, query_vector: np.ndarray, k: int = 6) -> list[dict]:
        q = query_vector.astype("float32").reshape(1, -1)
        scores, indices = self.index.search(q, k)
        out: list[dict] = []
        for score, idx in zip(scores[0], indices[0]):
            if idx < 0:
                continue
            item = dict(self.items[idx])
            item["score"] = float(score)
            out.append(item)
        return out
