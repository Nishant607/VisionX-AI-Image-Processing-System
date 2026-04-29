# VisionX: AI-Powered Image Processing System

![VisionX Hero](/docs/assets/placeholder.png)

A production-grade, full-stack AI image processing suite leveraging Computer Vision algorithms.

## Tech Stack
- **Backend:** Django 4.2, Django REST Framework, OpenCV 4.8, NumPy
- **Frontend:** React 18, Vite, Bootstrap 5, Chart.js
- **DevOps:** Docker, docker-compose, Nginx, Gunicorn

## Quick Start

### 1. Requirements
Ensure Docker and docker-compose are installed on your system.

### 2. Environment Setup
```bash
cp .env.example .env
```

### 3. Launch via Docker Native
Run the entire stack natively with one command:
```bash
docker-compose up --build
```

### 4. Access Services
- **Frontend Dashboard:** http://localhost:5173
- **Backend API Base:** http://localhost:8000/api/
- **Django Admin:** http://localhost:8000/admin/

## Key Features
- **Edge Detection Engine:** Canny, Sobel, Laplacian, Contours.
- **Enhancement Toolkit:** Histogram EQ, Contrast Stretching.
- **Computer Vision Utilities:** Auto White Balance, Unsharp Mask.
- **Live Document Scanner:** Perspective correction + adaptive threshold mockups.
- **Real-time Camera AI:** Client-side edge simulation overlay.
- **State Management:** Preserved image session history database.

Prepared by Senior Full-Stack Engineer.
