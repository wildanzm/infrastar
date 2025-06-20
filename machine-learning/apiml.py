
import os
import io
import traceback
import json
import numpy as np
import pandas as pd
import joblib
from flask import Flask, request, jsonify
from PIL import Image
import base64
from flask_cors import CORS 

from keras.models import load_model # type: ignore
from keras.applications.mobilenet_v2 import preprocess_input # type: ignore

# Inisialisasi & Konfigurasi 
app = Flask(__name__)
CORS(app) 

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Path Model 
MODEL_CLASSIFIER_PATH = os.path.join(BASE_DIR, 'model1.h5')
MODEL_URGENCY_PATH = os.path.join(BASE_DIR, 'model2.joblib')
CLASS_NAMES_PATH = os.path.join(BASE_DIR, 'class_names.json')

model_classifier, model_urgency, class_names, severity_mapping = None, None, [], {}


# Fungsi Load Model 
def load_all_models():
    global model_classifier, model_urgency, class_names, severity_mapping
    model_classifier = load_model(MODEL_CLASSIFIER_PATH)
    model_urgency = joblib.load(MODEL_URGENCY_PATH)
    with open(CLASS_NAMES_PATH, 'r') as f:
        class_names = json.load(f)
    severity_mapping = {'jembatan': 1, 'jalan': 2}
    print("success")

# Fungsi Preprocessing
def preprocess_image_from_base64(b64_string):
    img_bytes = base64.b64decode(b64_string)
    img = Image.open(io.BytesIO(img_bytes)).convert('RGB').resize((224, 224))
    img_array = np.expand_dims(np.array(img), axis=0)
    return preprocess_input(img_array)

# API Endpoint Utama 
@app.route("/predict", methods=["POST"])
def predict():
    if not request.is_json:
        return jsonify({"success": False, "error": "Invalid input"}), 400
    
    data = request.get_json()
    required_keys = ["image_base64", "num_similar_reports"]
    if not all(key in data for key in required_keys):
        return jsonify({"success": False, "error": "Missing keys"}), 400

    try:
        # Proses Prediksi 
        image_b64 = data["image_base64"]
        num_reports = int(data["num_similar_reports"])
        
        processed_image = preprocess_image_from_base64(image_b64)
        predictions = model_classifier.predict(processed_image)
        pred_index = np.argmax(predictions[0])
        predicted_class = class_names[pred_index]
        confidence = float(predictions[0][pred_index] * 100)
        
        keparahan_numerik = severity_mapping.get(predicted_class, 1)
        input_urgency = pd.DataFrame({'Keparahan_Numerik': [keparahan_numerik], 'Jumlah_Laporan': [num_reports]})
        predicted_score = model_urgency.predict(input_urgency)
        final_score = max(1, min(100, int(predicted_score[0])))

        
        print(f" Prediksi berhasil: {predicted_class} ({confidence:.2f}%), Skor: {final_score}")

        response = {
            "success": True,
            "message": "Prediction successful",
            "prediction_results": {
                "classification_result": predicted_class,
                "confidence": round(confidence, 
                                    ),
                "urgency_prediction": final_score
            }
        }
        return jsonify(response), 200

    except Exception as e:
        traceback.print_exc()
        return jsonify({"success": False, "error": "Internal server error."}), 500

if __name__ == "__main__":
    load_all_models()
    app.run(host="0.0.0.0", port=5000, debug=True)