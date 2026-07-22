# DRPE FastAPI API — multi-stage production image
FROM python:3.11-slim AS builder

WORKDIR /build

COPY pyproject.toml README.md ./
COPY drpe/ drpe/

RUN pip install --no-cache-dir .

# --- runtime ---
FROM python:3.11-slim AS api

WORKDIR /app

COPY --from=builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

# Runtime assets not installed by setuptools
COPY config/ config/
COPY alembic.ini .
COPY drpe/migrations/ drpe/migrations/

ENV DRPE_POLICIES_DIR=config \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://127.0.0.1:8000/api/v1/health')"

CMD ["uvicorn", "drpe.api.app:app", "--host", "0.0.0.0", "--port", "8000"]
