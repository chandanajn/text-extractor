# Enterprise OCR Text Extraction Platform

An advanced, production-grade text extraction and OCR platform leveraging FastAPI, React, PostgreSQL, and OpenCV.

## Features
- **Intelligent OCR Engine:** Uses Tesseract OCR with built-in OpenCV preprocessing (Grayscale, Median Blur, Adaptive Thresholding) for maximum accuracy.
- **Language & Handwriting Support:** Automatically handles 6+ languages and offers specific tuning for printed or handwritten text.
- **Robust Security:** JWT-based authentication (Access & Refresh tokens) and Role-Based Access Control.
- **Export & Analytics:** Dynamic PDF report generation and visual dashboards detailing OCR performance and usage metrics.
- **Modern UI:** Built on React + Vite using TailwindCSS and Material UI, featuring drag-and-drop uploads and detailed historical search.
- **Cloud-Ready:** Fully containerized using Docker and Docker Compose.

## Architecture
- **Frontend:** React, Vite, TailwindCSS, Material UI, React Query, Recharts
- **Backend:** FastAPI, SQLAlchemy, Alembic, PyJWT, Passlib, Python-Multipart
- **Core Processing:** OpenCV (`opencv-python`), Tesseract OCR (`pytesseract`), ReportLab
- **Database:** PostgreSQL 15

---

## Getting Started Locally

### Option 1: Docker Compose (Recommended)
This is the easiest way to spin up the entire stack, including the PostgreSQL database, the backend, and the frontend.

1. Clone the repository and configure your environment (optional).
2. Start the services:
   ```bash
   docker-compose up -d --build
   ```
3. The platform will be available at `http://localhost`.

### Option 2: Local Development Setup
If you want to run the services manually for development:

#### 1. Database
Ensure you have PostgreSQL running. 
Create a database named `text_extractor`. By default, the application connects using `postgresql://postgres:chandana@localhost/text_extractor`.

#### 2. Backend
1. Open a terminal and navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Activate your virtual environment and install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run Alembic migrations to build the tables:
   ```bash
   alembic upgrade head
   ```
4. Start the FastAPI server:
   ```bash
   uvicorn main:app --reload
   ```
The backend API docs are available at `http://127.0.0.1:8000/api/v1/docs`.

#### 3. Frontend
1. Open a new terminal and navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

---

## Running Tests
The backend includes a comprehensive `pytest` suite for authentication and API validation.
To run the tests:
```bash
cd backend
pytest
```

## Deployment
Check out the `DEPLOYMENT.md` file for detailed instructions on deploying to AWS ECS, Google Cloud Run, and general VPS instances.
