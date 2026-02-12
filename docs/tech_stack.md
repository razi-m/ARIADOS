x# HackSav Project Tech Stack

## 🎨 Frontend
**Core Framework**:
- **React 18**: UI Library
- **Vite**: Build Tool & Dev Server
- **JavaScript (ES6+)**: Logic

**Styling & UI**:
- **Vanilla CSS3**: Custom styling with CSS Variables for theming (Deep Navy/Cyan palette).
- **Glassmorphism**: Backdrop filters and translucent layers for modern UI.
- **CSS Animations**: Keyframe animations for fade-ins and floating effects.
- **Inline SVGs**: Custom vector icons for navigation and UI elements.

**State & Routing**:
- **React Router DOM 6**: Client-side routing (`/login`, `/dashboard`, `/admin`, etc.).
- **Context API**: Global state management for Authentication (`AuthContext`).

**Networking**:
- **Axios**: HTTP client for API requests with Interceptors for JWT handling.

---

## ⚙️ Backend (API Service)
**Core Framework**:
- **FastAPI**: High-performance async web framework.
- **Uvicorn**: ASGI Server for production-ready deployment.
- **Python 3.10+**: Core language.

**Database & ORM**:
- **PostgreSQL**: Relational database.
- **SQLAlchemy (AsyncIO)**: ORM for database interactions.
- **Pydantic**: Data validation and schema definition.
- **Alembic**: (Optional/Ready) Database migrations.

**Authentication & Security**:
- **OAuth2 with Password Flow**: Standard auth protocol.
- **Python-Jose**: JWT (JSON Web Token) generation and verification.
- **Passlib (Bcrypt)**: Secure password hashing.
- **Python-Multipart**: Handling video/file uploads.

**Utilities**:
- **FPDF2**: PDF Report generation.
- **Python-Dotenv**: Environment variable management.

---

## 🧠 ML Service (Microservice)
**Core Framework**:
- **FastAPI**: Dedicated service for inference to avoid blocking the main API.
- **Uvicorn**: ASGI Server.

**Machine Learning & Vision**:
- **PyTorch**: Deep learning framework for model inference.
- **Torchvision**: Pre-trained inspection models and image transforms.
- **OpenCV (cv2)**: Video frame extraction and processing.
- **Pillow (PIL)**: Image manipulation.
- **NumPy**: Numerical operations on image tensors.

**GenAI Integration**:
- **Google Gemini API (`google-generativeai`)**: Generates natural language summaries and reports based on detection data.

---

## 🗄️ Database
- **PostgreSQL**: Primary data store for Users, Inspections, Defects, and Reports.

---

## 🛠️ Infrastructure & Tooling
- **Git**: Version control.
- **GitHub**: Remote repository storage.
- **Concurrent Execution**: Powershell/Bash scripts to run multiple services (Frontend, Backend, ML) simultaneously.
- **Local File Storage**: `./uploads` for videos and `./reports` for generated PDFs.
