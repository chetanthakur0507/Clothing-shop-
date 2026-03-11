# AI Fashion Service (FastAPI)

This service powers AI outfit recommendations for the Next.js storefront.

## Endpoints

- `POST /predict/item`
  - JSON body: `{ "item": "Black T-shirt" }`
- `POST /predict/image`
  - multipart/form-data: `image`
- `POST /predict/user-photo`
  - multipart/form-data: `photo`
- `GET /health`

## Features Included

- FashionCLIP/CLIP embedding loader (strict pretrained mode)
- FAISS similarity index built from in-memory product catalog
- Rule + ML hybrid outfit matcher
- Stable Diffusion integration hook for preview generation
- Stateless operation (no MongoDB, no persistence)

Note: Predictions are served only when pretrained model loads successfully.
Check readiness using `GET /health` and ensure `embedding_mode` is `clip`.

## Run

### One Command (recommended)

From workspace root (`clothing/`), run:

```bash
npm run dev
```

This starts both:
- Next.js web app
- FastAPI AI service

It auto-creates `ai-service/.venv` (if missing).

Install/update AI dependencies explicitly when needed:

```bash
npm run ai:install
```

### Manual Run

```bash
cd ai-service
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

If a previous `.venv` is corrupted/locked, recreate it:

```bash
deactivate
Remove-Item -Recurse -Force .venv
python -m venv .venv
```

## Next.js Integration

Set env variable in your Next app:

```bash
# PowerShell (current terminal only)
$env:AI_FASHION_SERVICE_URL="http://127.0.0.1:8010"

# OR set in clothing/.env.local (recommended)
AI_FASHION_SERVICE_URL=http://127.0.0.1:8010
```

The Next API routes in `app/api/ai-fashion/*` proxy all requests to this service.
