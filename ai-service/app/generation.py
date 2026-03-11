from __future__ import annotations

import hashlib
import os


def generate_outfit_preview(prompt: str) -> str:
    """
    Stable Diffusion integration hook.

    Current behavior:
    - If SD_MODEL_ID is configured and runtime supports diffusers, this method can be expanded
      to actually generate and store an image.
    - Returns a remote placeholder preview URL so API stays functional out-of-box.
    """

    model_id = os.getenv("SD_MODEL_ID", "")
    use_sd = os.getenv("USE_STABLE_DIFFUSION", "0") == "1"

    if use_sd and model_id:
        # Integration point for production:
        # from diffusers import StableDiffusionPipeline
        # pipe = StableDiffusionPipeline.from_pretrained(model_id)
        # image = pipe(prompt).images[0]
        # save image to object storage and return public URL
        pass

    # Deterministic non-persistent preview URL derived from prompt, so different
    # suggestions can show visibly different output images.
    seed = hashlib.sha256(prompt.encode("utf-8")).hexdigest()[:16]
    return f"https://picsum.photos/seed/{seed}/1200/900"
