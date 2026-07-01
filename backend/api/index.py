import os
import sys

# On Vercel the working directory is the repo root, so the `app` package
# (which lives in backend/) isn't importable by default. Add backend/ to the
# path so `from app.main import app` resolves.
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.main import app  # noqa: E402
