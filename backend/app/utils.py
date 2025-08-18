# utils.py
import numpy as np
from PIL import Image

def preprocess_image(image_path, target_size=(128, 128)):
    img = Image.open(image_path).convert('RGB')
    img = img.resize(target_size)
    img_array = np.array(img) / 255.0
    return np.expand_dims(img_array, axis=0)

def simplify_conditions(condition_preds):
    result = {}
    for condition, score in condition_preds.items():
        if score >= 0.3:
            result[condition] = "Current"
        elif 0.15 <= score < 0.3:
            result[condition] = "Potential"
    return result

def compute_skin_score(conditions):
    score = 100
    for status in conditions.values():
        if status == "Current":
            score -= 20
        elif status == "Potential":
            score -= 10
    return max(score, 0)
