from __future__ import annotations

import base64
import hashlib
import json
import os
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen


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
    grok_key = (os.getenv("GROK_API_KEY") or os.getenv("XAI_API_KEY") or "").strip()

    if use_sd and model_id:
        # Integration point for production:
        # from diffusers import StableDiffusionPipeline
        # pipe = StableDiffusionPipeline.from_pretrained(model_id)
        # image = pipe(prompt).images[0]
        # save image to object storage and return public URL
        pass

    # Preferred preview path: generate mannequin outfit image via Grok if key is configured.
    if grok_key:
        generated = _generate_with_grok(prompt, grok_key)
        if generated:
            return generated

    # Deterministic non-persistent preview URL derived from prompt, so different
    # suggestions can show visibly different output images.
    seed = hashlib.sha256(prompt.encode("utf-8")).hexdigest()[:16]
    return f"https://picsum.photos/seed/{seed}/1200/900"


def _generate_with_grok(prompt: str, api_key: str) -> str | None:
    base_url = os.getenv("XAI_BASE_URL", "https://api.x.ai/v1").rstrip("/")
    model = os.getenv("XAI_IMAGE_MODEL", "grok-2-image-1212")
    timeout_ms = int(os.getenv("XAI_TIMEOUT_MS", "70000"))

    body = json.dumps(
        {
            "model": model,
            "prompt": prompt,
            "size": "1024x1024",
        }
    ).encode("utf-8")

    request = Request(
        url=f"{base_url}/images/generations",
        data=body,
        method="POST",
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
    )

    raw = ""
    try:
        with urlopen(request, timeout=max(timeout_ms / 1000.0, 5.0)) as response:
            raw = response.read().decode("utf-8", errors="replace")
    except (HTTPError, URLError):
        return None

    try:
        parsed = json.loads(raw) if raw else {}
    except json.JSONDecodeError:
        return None

    data = parsed.get("data") if isinstance(parsed, dict) else None
    first = data[0] if isinstance(data, list) and data else None
    if not isinstance(first, dict):
        return None

    url = first.get("url")
    if isinstance(url, str) and url.strip():
        return url.strip()

    b64_json = first.get("b64_json")
    if isinstance(b64_json, str) and b64_json.strip():
        # Validate base64 quickly before returning.
        try:
            base64.b64decode(b64_json, validate=True)
            return f"data:image/png;base64,{b64_json}"
        except Exception:
            return None

    return None
