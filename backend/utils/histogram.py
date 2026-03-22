import cv2
import numpy as np

def generate_histogram(img: np.ndarray) -> dict:
    """
    Generate histogram data for Chart.js.
    Returns: { labels: [0..255], red: [], green: [], blue: [], luminance: [] }
    """
    labels = list(range(256))
    
    # Ensure standard BGR array
    if len(img.shape) == 2:
        img = cv2.cvtColor(img, cv2.COLOR_GRAY2BGR)
        
    color = ('b', 'g', 'r')
    hist_data = {
        'labels': labels,
        'red': [],
        'green': [],
        'blue': [],
        'luminance': []
    }
    
    # Calculate for each channel
    for i, col in enumerate(color):
        histr = cv2.calcHist([img], [i], None, [256], [0, 256])
        hist_list = [int(val[0]) for val in histr]
        if col == 'b':
            hist_data['blue'] = hist_list
        elif col == 'g':
            hist_data['green'] = hist_list
        elif col == 'r':
            hist_data['red'] = hist_list
            
    # Calculate luminance histogram
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    hist_l = cv2.calcHist([gray], [0], None, [256], [0, 256])
    hist_data['luminance'] = [int(val[0]) for val in hist_l]
    
    return hist_data
