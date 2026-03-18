from __future__ import annotations

import base64
import json
import os
from io import BytesIO
from typing import Any, Literal
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from PIL import Image

try:
    from openai import OpenAI
except Exception:  # pragma: no cover - optional runtime dependency
    OpenAI = None

FALLBACK_PREVIEW_URL = "https://picsum.photos/seed/fashion-preview/1200/900"


def is_grok_configured() -> bool:
    return bool((os.getenv("GROK_API_KEY") or os.getenv("XAI_API_KEY") or "").strip())


def recommend_from_item(item: str) -> dict[str, Any]:
    payload = _request_recommendation(mode="item", prompt=f"User selected item: {item}")
    payload["previewImageUrl"] = _safe_generate_preview(
        f"High-quality ecommerce outfit photo of a stylish look built around {item}.", payload
    )
    payload["provider"] = "grok-fallback"
    return payload


def recommend_from_image(image: Image.Image, file_name: str) -> dict[str, Any]:
    payload = _request_recommendation(
        mode="image",
        prompt=f"Analyze uploaded clothing image: {file_name}",
        image_data_url=_image_to_data_url(image),
    )
    payload["previewImageUrl"] = _safe_generate_preview(
        "Studio fashion shot of a complete outfit inspired by the analyzed clothing image.",
        payload,
    )
    payload["provider"] = "grok-fallback"
    return payload


def recommend_from_user_photo(image: Image.Image, file_name: str) -> dict[str, Any]:
    payload = _request_recommendation(
        mode="user-photo",
        prompt=f"Analyze user photo for styling suggestions: {file_name}",
        image_data_url=_image_to_data_url(image),
    )
    payload["previewImageUrl"] = _safe_generate_preview(
        "Photorealistic outfit concept for a user styling consultation, full body fashion editorial style.",
        payload,
    )
    payload["provider"] = "grok-fallback"
    return payload


def _request_recommendation(mode: Literal["item", "image", "user-photo"], prompt: str, image_data_url: str | None = None) -> dict[str, Any]:
    _ensure_configured()

    system_prompt = "\n".join(
        [
            "You are a fashion stylist assistant for an ecommerce web app.",
            "Return ONLY valid JSON with this schema:",
            "{",
            '  "inputSummary": "string",',
            '  "recommendedItems": [{ "name": "string", "category": "top|bottom|footwear|accessory", "reason": "string" }],',
            '  "colorSuggestions": ["string"],',
            '  "styleSuggestions": ["string"],',
            '  "nextStep": "string"',
            "}",
            "Recommended items should be 3 to 5 entries with practical mix-and-match advice.",
        ]
    )

    user_text = f"{prompt}\nMode: {mode}"
    user_content: Any
    if image_data_url:
        user_content = [
            {"type": "text", "text": user_text},
            {"type": "image_url", "image_url": {"url": image_data_url}},
        ]
    else:
        user_content = user_text

    message = _chat_completion_text(system_prompt, user_content)
    if not message:
        raise RuntimeError("Grok returned empty chat response.")

    parsed = _parse_json_object(message)
    return _normalize_payload(parsed, mode, prompt)


def _safe_generate_preview(base_prompt: str, payload: dict[str, Any]) -> str:
    try:
        return _generate_preview(base_prompt, payload)
    except Exception:
        return FALLBACK_PREVIEW_URL


def _generate_preview(base_prompt: str, payload: dict[str, Any]) -> str:
    _ensure_configured()
    style_hint = ", ".join(payload.get("styleSuggestions", [])[:2])
    color_hint = ", ".join(payload.get("colorSuggestions", [])[:3])
    items = payload.get("recommendedItems", [])
    hero_item = items[0].get("name") if items and isinstance(items[0], dict) else "stylish outfit"
    outfit_items = ", ".join(
        i.get("name", "") for i in items if isinstance(i, dict) and isinstance(i.get("name"), str)
    )
    outfit_items = outfit_items or hero_item
    prompt = (
        "Generate a realistic ecommerce studio image of a full-body mannequin (dummy model) wearing the exact outfit. "
        f"Outfit pieces: {outfit_items}. Hero item: {hero_item}. "
        f"Color direction: {color_hint}. Style: {style_hint}. "
        f"Scene context: {base_prompt}. "
        "Front view, clean plain background, realistic fabric folds, no real human, no face details, no extra unrelated garments."
    )

    image_url = _generate_image_url(prompt)
    if image_url:
        return image_url

    raise RuntimeError("No image returned from Grok image API.")


def _normalize_payload(payload: Any, mode: str, prompt: str) -> dict[str, Any]:
    payload = payload if isinstance(payload, dict) else {}
    fallback_summary = (
        prompt.replace("User selected item: ", "")
        if mode == "item"
        else "Uploaded clothing image"
        if mode == "image"
        else "Uploaded user photo"
    )

    items = payload.get("recommendedItems")
    normalized_items = []
    if isinstance(items, list):
        for entry in items[:5]:
            if isinstance(entry, dict):
                normalized_items.append(
                    {
                        "name": _safe_text(entry.get("name"), "Style Essential"),
                        "category": _normalize_category(entry.get("category")),
                        "reason": _safe_text(entry.get("reason"), "Works well with the selected style direction."),
                    }
                )

    if not normalized_items:
        normalized_items = [
            {"name": "White Sneakers", "category": "footwear", "reason": "Versatile with most outfits"},
            {"name": "Dark Denim", "category": "bottom", "reason": "Balances casual and smart styling"},
            {"name": "Minimal Watch", "category": "accessory", "reason": "Adds clean premium detail"},
        ]

    return {
        "inputSummary": _safe_text(payload.get("inputSummary"), f"Grok analysis for {fallback_summary}"),
        "recommendedItems": normalized_items,
        "colorSuggestions": _normalize_string_list(payload.get("colorSuggestions"), ["White", "Navy", "Beige", "Black"]),
        "styleSuggestions": _normalize_string_list(payload.get("styleSuggestions"), ["Smart Casual", "Streetwear", "Minimal"]),
        "nextStep": _safe_text(
            payload.get("nextStep"),
            "Generated via Grok fallback. Improve with user profile and catalog inventory constraints.",
        ),
    }


def _normalize_category(value: Any) -> Literal["top", "bottom", "footwear", "accessory"]:
    if value in ("top", "bottom", "footwear", "accessory"):
        return value
    lower = str(value or "").lower()
    if any(word in lower for word in ("shoe", "sneaker", "boot", "loafer")):
        return "footwear"
    if any(word in lower for word in ("jean", "pant", "trouser", "short", "skirt")):
        return "bottom"
    if any(word in lower for word in ("shirt", "tee", "t-shirt", "hoodie", "jacket", "blazer", "top")):
        return "top"
    return "accessory"


def _normalize_string_list(value: Any, fallback: list[str]) -> list[str]:
    if not isinstance(value, list):
        return fallback
    out = [str(x).strip() for x in value if str(x).strip()]
    return out[:6] if out else fallback


def _safe_text(value: Any, fallback: str) -> str:
    return value.strip() if isinstance(value, str) and value.strip() else fallback


def _parse_json_object(raw: str) -> Any:
    text = raw.strip()
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        first = text.find("{")
        last = text.rfind("}")
        if first >= 0 and last > first:
            return json.loads(text[first : last + 1])
        raise RuntimeError("Could not parse JSON response from Grok.")


def _get_chat_content(payload: Any) -> str:
    if not isinstance(payload, dict):
        return ""
    choices = payload.get("choices")
    if not isinstance(choices, list) or not choices:
        return ""
    first = choices[0]
    if not isinstance(first, dict):
        return ""
    message = first.get("message")
    if not isinstance(message, dict):
        return ""
    content = message.get("content")
    if isinstance(content, str):
        return content
    if isinstance(content, list):
        parts = []
        for entry in content:
            if isinstance(entry, dict) and isinstance(entry.get("text"), str):
                parts.append(entry["text"])
        return "\n".join(parts).strip()
    return ""


def _image_to_data_url(image: Image.Image) -> str:
    buffer = BytesIO()
    image.convert("RGB").save(buffer, format="JPEG", quality=90)
    encoded = base64.b64encode(buffer.getvalue()).decode("ascii")
    return f"data:image/jpeg;base64,{encoded}"


def _post_json(path: str, payload: dict[str, Any]) -> dict[str, Any]:
    _ensure_configured()
    base_url = os.getenv("XAI_BASE_URL", "https://api.x.ai/v1").rstrip("/")
    timeout_ms = int(os.getenv("XAI_TIMEOUT_MS", "70000"))
    api_key = (os.getenv("GROK_API_KEY") or os.getenv("XAI_API_KEY") or "").strip()
    body = json.dumps(payload).encode("utf-8")
    request = Request(
        url=f"{base_url}{path}",
        data=body,
        method="POST",
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
    )

    try:
        with urlopen(request, timeout=max(timeout_ms / 1000.0, 5.0)) as response:
            raw = response.read().decode("utf-8", errors="replace")
    except HTTPError as exc:
        raw = exc.read().decode("utf-8", errors="replace") if exc.fp else ""
        message = _extract_error_message(raw) or f"Grok API request failed ({exc.code})"
        raise RuntimeError(message) from exc
    except URLError as exc:
        raise RuntimeError(f"Grok API network error: {exc.reason}") from exc

    try:
        return json.loads(raw) if raw else {}
    except json.JSONDecodeError as exc:
        raise RuntimeError(f"Invalid JSON from Grok API: {raw[:200]}") from exc


def _chat_completion_text(system_prompt: str, user_content: Any) -> str:
    client = _openai_client()
    if client is not None:
        try:
            response = client.chat.completions.create(
                model=os.getenv("XAI_CHAT_MODEL", "grok-3-mini"),
                temperature=0.35,
                max_tokens=700,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_content},
                ],
            )
            content = response.choices[0].message.content if response.choices else ""
            if isinstance(content, str):
                return content
            if isinstance(content, list):
                parts = []
                for entry in content:
                    text = getattr(entry, "text", None)
                    if isinstance(text, str):
                        parts.append(text)
                return "\n".join(parts).strip()
        except Exception:
            # Fall through to raw HTTP mode when SDK path fails.
            pass

    raw = _post_json(
        "/chat/completions",
        {
            "model": os.getenv("XAI_CHAT_MODEL", "grok-3-mini"),
            "temperature": 0.35,
            "max_tokens": 700,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_content},
            ],
        },
    )
    return _get_chat_content(raw)


def _generate_image_url(prompt: str) -> str | None:
    client = _openai_client()
    if client is not None:
        try:
            response = client.images.generate(
                model=os.getenv("XAI_IMAGE_MODEL", "grok-2-image-1212"),
                prompt=prompt,
                size="1024x1024",
            )
            if response.data:
                first = response.data[0]
                url = getattr(first, "url", None)
                b64_json = getattr(first, "b64_json", None)
                if isinstance(url, str) and url.strip():
                    return url.strip()
                if isinstance(b64_json, str) and b64_json.strip():
                    return f"data:image/png;base64,{b64_json}"
        except Exception:
            # Fall through to raw HTTP mode when SDK path fails.
            pass

    raw = _post_json(
        "/images/generations",
        {
            "model": os.getenv("XAI_IMAGE_MODEL", "grok-2-image-1212"),
            "prompt": prompt,
            "size": "1024x1024",
        },
    )
    data = raw.get("data") if isinstance(raw, dict) else None
    first = data[0] if isinstance(data, list) and data else None
    if isinstance(first, dict):
        if isinstance(first.get("url"), str) and first["url"].strip():
            return first["url"].strip()
        if isinstance(first.get("b64_json"), str) and first["b64_json"].strip():
            return f"data:image/png;base64,{first['b64_json']}"

    return None


def _extract_error_message(raw: str) -> str | None:
    if not raw.strip():
        return None
    try:
        parsed = json.loads(raw)
    except json.JSONDecodeError:
        return raw.strip()

    if isinstance(parsed, dict):
        err = parsed.get("error")
        if isinstance(err, str):
            return err
        if isinstance(err, dict) and isinstance(err.get("message"), str):
            return err["message"]
        if isinstance(parsed.get("message"), str):
            return parsed["message"]
        if isinstance(parsed.get("code"), str):
            return parsed["code"]
    return None


def _ensure_configured() -> None:
    if not is_grok_configured():
        raise RuntimeError("Grok API key not configured. Set GROK_API_KEY or XAI_API_KEY.")


def _openai_client() -> Any | None:
    if OpenAI is None:
        return None

    api_key = (os.getenv("GROK_API_KEY") or os.getenv("XAI_API_KEY") or "").strip()
    if not api_key:
        return None

    base_url = os.getenv("XAI_BASE_URL", "https://api.x.ai/v1").rstrip("/")
    timeout_ms = int(os.getenv("XAI_TIMEOUT_MS", "70000"))
    return OpenAI(api_key=api_key, base_url=base_url, timeout=max(timeout_ms / 1000.0, 5.0))
