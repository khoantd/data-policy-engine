# Plan: DRPE persistence (Supabase PolicyStore)

## Stack
Python 3.11+, FastAPI, Pydantic v2, SQLAlchemy 2, Alembic, psycopg3, pytest

## Slices
1. Deps + Settings (`DATABASE_URL`) — done
2. ORM + Alembic `drpe` schema — done
3. SqlAlchemyPolicyStore — done
4. App factory + ready probe — done
5. Tests + docs + remote migrate — done

## Target
Supabase lead-flow (`yshqwmldepsfckiacjwu`), schema `drpe`

## Verification
```bash
source .venv/bin/activate
python -m pip install -e ".[dev]"
python -m pytest tests/ -v
# with DATABASE_URL:
alembic upgrade head
uvicorn drpe.api.app:app --port 8000
```
