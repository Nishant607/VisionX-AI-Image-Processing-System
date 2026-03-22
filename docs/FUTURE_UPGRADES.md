# Future Upgrades Architecture RoadMap

To further enterprise scalability and processing capabilities, the following enhancements are scoped for v2.0 Phase:

### 1. Object Detection Base (YOLOv8 Integration)
Integration of Ultralytics YOLOv8 for precise bounding-box detection.
- **Implementation:** Create a dedicated worker pool for heavy inference.
- **Frontend Scope:** Bounding box coordinate parsing via canvas overlay rather than embedded image.

### 2. Segment Anything Model (SAM2)
Interactive mask isolation.
- **Implementation:** Accept coordinate clicks from React coordinate mapper -> Convert to positive SAM bounding -> Return alpha channel cropped image.

### 3. FastAPI Migration
Convert Django DRF sync views to `async def` in FastAPI.
- **Reasoning:** OpenCV operations block threads. FastAPI `asyncio` loop with `run_in_threadpool` significantly increases concurrent requests without relying on heavy Gunicorn synchronous workers.

### 4. Background Job Queue (Celery + Redis)
- **Architecture:** Move OpenCV processing entirely off the HTTP loop. 
- **Flow:** API returns "Processing" immediately -> Frontend connects via WebSocket / Polling -> Celery worker handles `cv2.warpAffine` etc. -> Redis PubSub updates frontend status.

### 5. Media Cloud Storage
- Ensure compliance and state durability by migrating `django.core.files.storage.FileSystemStorage` to `storages.backends.s3boto3.S3Boto3Storage` pointing to AWS S3, leveraging `boto3`.
