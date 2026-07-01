
import os
import shutil
import sqlite3
import sys
from pathlib import Path

# Paths relative to this script (assumed to be in scripts/, but running from root)
# Actually, let's just use absolute paths or relative to execution dir
BASE_DIR = Path("c:/Users/Razi/Documents/HackSavy1/final2")
BACKEND_DIR = BASE_DIR / "backend"
UPLOADS_DIR = BACKEND_DIR / "uploads"
REPORTS_DIR = BASE_DIR / "reports"  # Reports seem to go partially here, let's check
DB_FILE = BACKEND_DIR / "hacksav.db"

def cleanup():
    print("Starting cleanup...")

    # 1. Clear Database
    if DB_FILE.exists():
        print(f"Deleting database: {DB_FILE}")
        try:
            os.remove(DB_FILE)
            print("Database deleted.")
        except Exception as e:
            print(f"Error deleting database: {e}")
    else:
        print("Database not found, skipping delete.")

    # 2. Clear Uploads
    if UPLOADS_DIR.exists():
        print(f"Clearing uploads: {UPLOADS_DIR}")
        for item in UPLOADS_DIR.iterdir():
            if item.is_file() and item.name != ".gitkeep":
                try:
                    os.remove(item)
                except Exception as e:
                    print(f"Error deleting {item}: {e}")
    else:
        print("Uploads directory not found.")
        
    # 3. Clear Reports (backend/reports/ or reports/)
    # backend/routers/reports.py says:
    # reports_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "reports")
    # which is likely backend/../reports -> final2/reports
    if REPORTS_DIR.exists():
        print(f"Clearing reports: {REPORTS_DIR}")
        for item in REPORTS_DIR.iterdir():
            if item.is_file() and item.name != ".gitkeep":
                 try:
                    os.remove(item)
                 except Exception as e:
                    print(f"Error deleting {item}: {e}")

    print("Cleanup complete. Re-initializing database...")
    
    # Re-run init_db.py
    # Change CWD to backend so imports work
    os.chdir(BACKEND_DIR)
    sys.path.append(str(BACKEND_DIR))
    
    try:
        # Assuming init_db.py has a main block or we can import and run
        # Let's inspect init_db.py content first? No, let's just run it via subprocess
        import subprocess
        subprocess.run(["python", "init_db.py"], check=True)
        print("Database re-initialized successfully.")
    except Exception as e:
        print(f"Error re-initializing database: {e}")

if __name__ == "__main__":
    cleanup()
