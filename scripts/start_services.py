"""
Local dev launcher — starts all three services in separate console windows.
Run from the repo root: python scripts/start_services.py
"""
import subprocess
import time
import sys
import os

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def start_service(name, cmd, cwd):
    print(f"Starting {name}...")
    if sys.platform == "win32":
        process = subprocess.Popen(cmd, cwd=cwd, creationflags=subprocess.CREATE_NEW_CONSOLE)
    else:
        process = subprocess.Popen(cmd, cwd=cwd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    return process


if __name__ == "__main__":
    backend = start_service(
        "Backend (port 8000)",
        ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"],
        os.path.join(PROJECT_ROOT, "backend"),
    )
    time.sleep(2)

    ml = start_service(
        "ML Service (port 8001)",
        ["uvicorn", "ml.main:app", "--host", "0.0.0.0", "--port", "8001"],
        os.path.join(PROJECT_ROOT, "ml_service"),
    )
    time.sleep(2)

    frontend = start_service(
        "Frontend (port 5173)",
        ["npm", "run", "dev"],
        os.path.join(PROJECT_ROOT, "frontend"),
    )

    print("\n✓ All services started!")
    print("  Backend:    http://localhost:8000")
    print("  ML Service: http://localhost:8001")
    print("  Frontend:   http://localhost:5173")
    print("\nPress Ctrl+C to stop all services...")

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\nStopping services...")
        backend.terminate()
        ml.terminate()
        frontend.terminate()
        print("Done.")
