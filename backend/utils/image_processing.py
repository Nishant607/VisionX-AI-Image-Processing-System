import cv2
import numpy as np
import logging

logger = logging.getLogger(__name__)

# ==========================================
# EDGE DETECTION GROUP
# ==========================================

def canny_edge_detection(img: np.ndarray, threshold1: int = 100, threshold2: int = 200) -> np.ndarray:
    """Pre-blur -> Canny Edge Detection -> Return BGR."""
    # Convert to grayscale first if it is BGR
    if len(img.shape) == 3:
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    else:
        gray = img
        
    # Pre-blur to reduce noise
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    
    # Apply Canny algorithm
    edges = cv2.Canny(blurred, threshold1, threshold2)
    
    # Convert back to BGR to maintain consistent output format
    return cv2.cvtColor(edges, cv2.COLOR_GRAY2BGR)

def sobel_filter(img: np.ndarray, direction: str = 'combined', ksize: int = 3) -> np.ndarray:
    """Sobel Filter supporting 'x', 'y' or 'combined'."""
    if len(img.shape) == 3:
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    else:
        gray = img

    if direction == 'x':
        sobel = cv2.Sobel(gray, cv2.CV_64F, 1, 0, ksize=ksize)
        sobel = cv2.convertScaleAbs(sobel)
    elif direction == 'y':
        sobel = cv2.Sobel(gray, cv2.CV_64F, 0, 1, ksize=ksize)
        sobel = cv2.convertScaleAbs(sobel)
    else:
        # Combined
        sobelx = cv2.Sobel(gray, cv2.CV_64F, 1, 0, ksize=ksize)
        sobely = cv2.Sobel(gray, cv2.CV_64F, 0, 1, ksize=ksize)
        sobel = cv2.addWeighted(cv2.convertScaleAbs(sobelx), 0.5, cv2.convertScaleAbs(sobely), 0.5, 0)
        
    return cv2.cvtColor(sobel, cv2.COLOR_GRAY2BGR)

def laplacian_filter(img: np.ndarray) -> np.ndarray:
    """LoG (Laplacian of Gaussian) variant."""
    if len(img.shape) == 3:
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    else:
        gray = img
        
    blurred = cv2.GaussianBlur(gray, (3, 3), 0)
    laplacian = cv2.Laplacian(blurred, cv2.CV_64F)
    laplacian_abs = cv2.convertScaleAbs(laplacian)
    
    return cv2.cvtColor(laplacian_abs, cv2.COLOR_GRAY2BGR)

def contour_detection(img: np.ndarray) -> np.ndarray:
    """Find + draw external contours on original image."""
    output = img.copy()
    if len(img.shape) == 3:
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    else:
        gray = img
        output = cv2.cvtColor(img, cv2.COLOR_GRAY2BGR)
        
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    edged = cv2.Canny(blurred, 50, 150)
    
    # Find contours
    contours, _ = cv2.findContours(edged, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    # Draw contours (green)
    cv2.drawContours(output, contours, -1, (0, 255, 0), 2)
    return output


# ==========================================
# ENHANCEMENT GROUP
# ==========================================

def histogram_equalization(img: np.ndarray, clip_limit: float = 2.0) -> np.ndarray:
    """Uses CLAHE for a much better adaptive histogram equalization."""
    if len(img.shape) == 2:
        clahe = cv2.createCLAHE(clipLimit=clip_limit, tileGridSize=(8,8))
        return clahe.apply(img)
        
    ycrcb = cv2.cvtColor(img, cv2.COLOR_BGR2YCrCb)
    channels = list(cv2.split(ycrcb))
    
    # Apply CLAHE to Y channel
    clahe = cv2.createCLAHE(clipLimit=clip_limit, tileGridSize=(8,8))
    channels[0] = clahe.apply(channels[0])
    
    merged = cv2.merge(channels)
    return cv2.cvtColor(merged, cv2.COLOR_YCrCb2BGR)

def contrast_stretching(img: np.ndarray, strength: float = 50.0) -> np.ndarray:
    """Enhance contrast by stretching the histogram of the luminance channel.
    strength: 0 to 100. Higher means more aggressive clipping.
    """
    clip_percent = (strength / 100.0) * 10.0 # 0 to 10
    p_low = clip_percent
    p_high = 100.0 - clip_percent
    
    if len(img.shape) == 2:
        p_low_val, p_high_val = np.percentile(img, (p_low, p_high))
        clipped = np.clip(img, p_low_val, p_high_val)
        return cv2.normalize(clipped, None, alpha=0, beta=255, norm_type=cv2.NORM_MINMAX, dtype=cv2.CV_8U)
        
    # Convert to YCrCb space better for contrast enhancement than per-channel RGB
    ycrcb = cv2.cvtColor(img, cv2.COLOR_BGR2YCrCb)
    channels = list(cv2.split(ycrcb))
    
    # Calculate percentiles on Y (luminance) channel
    Y = channels[0]
    p_low_val, p_high_val = np.percentile(Y, (p_low, p_high))
    
    if p_high_val > p_low_val:
        Y_clipped = np.clip(Y, p_low_val, p_high_val)
        channels[0] = cv2.normalize(Y_clipped, None, alpha=0, beta=255, norm_type=cv2.NORM_MINMAX, dtype=cv2.CV_8U)
        
    merged = cv2.merge(channels)
    return cv2.cvtColor(merged, cv2.COLOR_YCrCb2BGR)

def adjust_brightness_contrast(img: np.ndarray, brightness: float = 0, contrast: float = 1.0) -> np.ndarray:
    """Linear transform: alpha*pixel + beta."""
    # Process brightness (-100 to 100 common range) and contrast (0.0 to 3.0 common range)
    # OpenCV convertScaleAbs performs saturated operations
    return cv2.convertScaleAbs(img, alpha=contrast, beta=brightness)


# ==========================================
# SMOOTHING GROUP
# ==========================================

def gaussian_blur(img: np.ndarray, kernel_size: int = 5) -> np.ndarray:
    """Gaussian blur with odd kernel."""
    if kernel_size % 2 == 0:
        kernel_size += 1
    return cv2.GaussianBlur(img, (kernel_size, kernel_size), 0)

def median_filter(img: np.ndarray, kernel_size: int = 5) -> np.ndarray:
    """Median filter for salt-and-pepper noise."""
    if kernel_size % 2 == 0:
        kernel_size += 1
    return cv2.medianBlur(img, kernel_size)


# ==========================================
# ADVANCED GROUP
# ==========================================

def order_points(pts):
    """Order points in [top-left, top-right, bottom-right, bottom-left] order."""
    rect = np.zeros((4, 2), dtype="float32")
    
    s = pts.sum(axis=1)
    rect[0] = pts[np.argmin(s)]
    rect[2] = pts[np.argmax(s)]
    
    diff = np.diff(pts, axis=1)
    rect[1] = pts[np.argmin(diff)]
    rect[3] = pts[np.argmax(diff)]
    
    return rect

def four_point_transform(img, pts):
    """Transform quad points to a top-down planar view."""
    rect = order_points(pts)
    (tl, tr, br, bl) = rect
    
    widthA = np.sqrt(((br[0] - bl[0]) ** 2) + ((br[1] - bl[1]) ** 2))
    widthB = np.sqrt(((tr[0] - tl[0]) ** 2) + ((tr[1] - tl[1]) ** 2))
    maxWidth = max(int(widthA), int(widthB))
    
    heightA = np.sqrt(((tr[0] - br[0]) ** 2) + ((tr[1] - br[1]) ** 2))
    heightB = np.sqrt(((tl[0] - bl[0]) ** 2) + ((tl[1] - bl[1]) ** 2))
    maxHeight = max(int(heightA), int(heightB))
    
    dst = np.array([
        [0, 0],
        [maxWidth - 1, 0],
        [maxWidth - 1, maxHeight - 1],
        [0, maxHeight - 1]], dtype="float32")
        
    M = cv2.getPerspectiveTransform(rect, dst)
    warped = cv2.warpPerspective(img, M, (maxWidth, maxHeight))
    
    return warped

def document_scanner(img: np.ndarray) -> np.ndarray:
    """Canny -> Find quad -> Perspective transform -> Adaptive Threshold."""
    # Convert to grayscale
    if len(img.shape) == 3:
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    else:
        gray = img.copy()
        
    # Edge detection
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    edged = cv2.Canny(blurred, 75, 200)
    
    # Find contours
    contours, _ = cv2.findContours(edged, cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE)
    contours = sorted(contours, key=cv2.contourArea, reverse=True)[:5]
    
    screen_cnt = None
    
    # Look for a quad
    for c in contours:
        peri = cv2.arcLength(c, True)
        approx = cv2.approxPolyDP(c, 0.02 * peri, True)
        
        if len(approx) == 4:
            screen_cnt = approx
            break
            
    # If no quad found, fallback to original image
    if screen_cnt is None:
        return img
        
    # Perspective transform
    warped = four_point_transform(img, screen_cnt.reshape(4, 2))
    
    # Convert warped to grayscale
    if len(warped.shape) == 3:
        warped_gray = cv2.cvtColor(warped, cv2.COLOR_BGR2GRAY)
    else:
        warped_gray = warped
        
    # Adaptive threshold for document look
    scan_look = cv2.adaptiveThreshold(
        warped_gray, 255, 
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C, 
        cv2.THRESH_BINARY, 21, 10
    )
    
    return cv2.cvtColor(scan_look, cv2.COLOR_GRAY2BGR)

def unsharp_mask(img: np.ndarray, strength: float = 1.5) -> np.ndarray:
    """sharpen = original + strength*(original - blurred)."""
    blurred = cv2.GaussianBlur(img, (9, 9), 10.0)
    # Apply mask formula: img + strength * (img - blurred)
    sharpened = cv2.addWeighted(img, 1.0 + strength, blurred, -strength, 0)
    return sharpened

def auto_white_balance(img: np.ndarray) -> np.ndarray:
    """Gray World assumption per-channel normalization."""
    # Ensure image is BGR
    if len(img.shape) == 2:
        return cv2.cvtColor(img, cv2.COLOR_GRAY2BGR)
        
    result = img.copy()
    b, g, r = cv2.split(result)
    
    # Calculate means
    mB, mG, mR = cv2.mean(b)[0], cv2.mean(g)[0], cv2.mean(r)[0]
    
    # Mean of means
    K = (mB + mG + mR) / 3
    
    # Normalize with clipping to prevent overflow
    if mB > 0: b = cv2.convertScaleAbs(b, alpha=K/mB)
    if mG > 0: g = cv2.convertScaleAbs(g, alpha=K/mG)
    if mR > 0: r = cv2.convertScaleAbs(r, alpha=K/mR)
    
    return cv2.merge([b, g, r])

# ==========================================
# CENTRAL DISPATCHER
# ==========================================

def apply_filter(img: np.ndarray, filter_type: str, params: dict = None) -> np.ndarray:
    """All filters routed through this single function."""
    if params is None:
        params = {}
        
    filter_map = {
        'canny': lambda i, p: canny_edge_detection(i, p.get('threshold1', 100), p.get('threshold2', 200)),
        'sobel': lambda i, p: sobel_filter(i, direction=p.get('direction', 'combined'), ksize=p.get('ksize', 3)),
        'laplacian': lambda i, p: laplacian_filter(i),
        'contour': lambda i, p: contour_detection(i),
        
        'histogram_eq': lambda i, p: histogram_equalization(i, float(p.get('clip_limit', 2.0))),
        'contrast_stretch': lambda i, p: contrast_stretching(i, float(p.get('strength', 50.0))),
        'brightness_contrast': lambda i, p: adjust_brightness_contrast(i, float(p.get('brightness', 0)), float(p.get('contrast', 1.0))),
        
        'gaussian_blur': lambda i, p: gaussian_blur(i, p.get('ksize', 5)),
        'median_filter': lambda i, p: median_filter(i, p.get('ksize', 5)),
        
        'document_scanner': lambda i, p: document_scanner(i),
        'unsharp_mask': lambda i, p: unsharp_mask(i, float(p.get('strength', 1.5))),
        'auto_white_balance': lambda i, p: auto_white_balance(i),
    }
    
    if filter_type not in filter_map:
        raise ValueError(f"Unknown filter_type: '{filter_type}'. Valid filters are: {list(filter_map.keys())}")
        
    try:
        return filter_map[filter_type](img, params)
    except Exception as e:
        logger.error(f"Error executing filter {filter_type}: {str(e)}")
        raise
