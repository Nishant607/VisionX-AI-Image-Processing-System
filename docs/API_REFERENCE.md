# VisionX API Reference

All endpoints are accessible under `http://localhost:8000/api/`

---

## 1. Upload Image
**Endpoint:** `POST /upload-image/`  
**Content-Type:** `multipart/form-data`

**Body:**
- `original_image` (File): The image to process (JPG, PNG, WEBP, BMP. Max 20MB).

**Response:**
```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "data": {
    "job_id": "uuid-string-here",
    "original_image_url": "http://localhost:8000/media/input/...",
    "created_at": "2023-11-20T12:00:00Z"
  }
}
```

---

## 2. Process Image
**Endpoint:** `POST /process-image/`  
**Content-Type:** `application/json`

**Body:**
- `job_id` (UUID): The ID received from upload.
- `filter_type` (String): e.g. "canny", "sobel", "gaussian_blur"
- `[param_name]` (Any): Required param specific to the filter.

**Response:**
```json
{
  "success": true,
  "message": "Image processed successfully",
  "data": {
    "job_id": "uuid-string-here",
    "processed_image_url": "http://localhost:8000/media/output/...",
    "filter_type": "canny",
    "status": "done"
  }
}
```

---

## 3. Histogram Generator
**Endpoint:** `GET /histogram/<job_id>/?type=<original|processed>`  

**Response:**
```json
{
  "success": true,
  "message": "Histogram generated",
  "data": {
    "labels": [0, 1, ..., 255],
    "red": [10, 5, ...],
    "green": [4, 1, ...],
    "blue": [6, 2, ...],
    "luminance": [5, 4, ...]
  }
}
```

---

## 4. Job History & Management
**GET /jobs/** - Returns last 20 processing jobs.  
**DELETE /jobs/<job_id>/** - Deletes job and underlying OS files.  
**GET /download/<job_id>/** - Forces file attachment download stream for processed file.
