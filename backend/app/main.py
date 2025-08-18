from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
import os
from utils import preprocess_image, compute_skin_score, simplify_conditions

app = Flask(__name__)

# Allow all origins (you can restrict later if needed)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

# Load models
skin_type_model = tf.keras.models.load_model(r'D:\SRM\skinchapters\backend\models\skin_type_model.h5')
skin_condition_model = tf.keras.models.load_model(r'D:\SRM\skinchapters\backend\models\skin_condition_model.h5')

# Labels
skin_type_labels = ['dry', 'oily', 'combination']
skin_condition_labels = ['acne', 'blackheads', 'wrinkles', 'irritation', 'dullness', 'rash']

UPLOAD_FOLDER = 'static/uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/analyze', methods=['POST'])
def analyze_skin():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400

    image = request.files['image']
    image_path = os.path.join(UPLOAD_FOLDER, image.filename)
    image.save(image_path)

    img_array = preprocess_image(image_path)

    # Predict Skin Type
    type_preds = skin_type_model.predict(img_array)[0]
    predicted_type = skin_type_labels[np.argmax(type_preds)]

    # Predict Skin Conditions
    condition_preds = skin_condition_model.predict(img_array)[0]
    raw_conditions = {
        label: float(score) for label, score in zip(skin_condition_labels, condition_preds)
    }

    simplified_conditions = simplify_conditions(raw_conditions)
    overall_score = compute_skin_score(simplified_conditions)

    # Map chapter numbers
    chapter_map = {
        'dry': 1,
        'oily': 2,
        'combination': 3
    }
    recommended_chapter = chapter_map.get(predicted_type, 0)

    # Response formatted to match what your frontend expects
    result = {
        "predicted_skin_type": predicted_type,
        "skin_conditions": simplified_conditions,  # dict, so Object.keys() works
        "overall_skin_condition_score": overall_score,
        "recommended_chapter": recommended_chapter
    }

    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)




# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import tensorflow as tf
# import numpy as np
# import os
# from utils import preprocess_image, compute_skin_score, simplify_conditions
# from routine_generator import generate_routine

# # Flask setup
# app = Flask(__name__)
# CORS(app)

# # Model loading
# skin_type_model = tf.keras.models.load_model(r"D:\SRM\skinchapters\backend\models\skin_type_model.h5")
# skin_condition_model = tf.keras.models.load_model(r"D:\SRM\skinchapters\backend\models\skin_condition_model.h5")

# # Labels
# skin_type_labels = ['dry', 'oily', 'combination']
# skin_condition_labels = ['acne', 'blackheads', 'wrinkles', 'irritation', 'dullness', 'rash']

# # Upload folder
# UPLOAD_FOLDER = "uploads"
# os.makedirs(UPLOAD_FOLDER, exist_ok=True)


# @app.route("/analyze", methods=["POST"])
# def analyze_skin():
#     if "image" not in request.files:
#         return jsonify({"error": "No image uploaded"}), 400

#     # Save image
#     image = request.files["image"]
#     image_path = os.path.join(UPLOAD_FOLDER, image.filename)
#     image.save(image_path)

#     # Preprocess image
#     img_array = preprocess_image(image_path)

#     # Predict skin type
#     type_preds = skin_type_model.predict(img_array)[0]
#     predicted_type = skin_type_labels[np.argmax(type_preds)]

#     # Predict skin conditions
#     condition_preds = skin_condition_model.predict(img_array)[0]
#     raw_conditions = {
#         label: float(score) for label, score in zip(skin_condition_labels, condition_preds)
#     }

#     simplified_conditions = simplify_conditions(raw_conditions)
#     overall_score = compute_skin_score(simplified_conditions)

#     # Example mapping
#     chapter_map = {
#         'dry': 1,
#         'oily': 2,
#         'combination': 3
#     }
#     recommended_chapter = chapter_map.get(predicted_type, 1)

#     # Match frontend expectations
#     result = {
#         "predicted_skin_type": predicted_type,
#         "skin_conditions": simplified_conditions,  # dict
#         "overall_skin_condition_score": round(overall_score),
#         "recommended_chapter": recommended_chapter
#     }

#     return jsonify(result)


# if __name__ == "__main__":
#     app.run(host="0.0.0.0", port=5000, debug=True)

