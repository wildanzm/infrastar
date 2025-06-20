import os
import io
import traceback
import json
import base64
import numpy as np
import pandas as pd
import joblib
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
from keras.models import load_model
from keras.applications.mobilenet_v2 import preprocess_input
app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MODEL_CLASSIFIER_PATH = os.path.join(BASE_DIR, 'model1.h5')
MODEL_URGENCY_PATH = os.path.join(BASE_DIR, 'model2.joblib')
CLASS_NAMES_PATH = os.path.join(BASE_DIR, 'class_names.json')

model_classifier = None
model_urgency = None
class_names = []
severity_mapping = {}


def load_all_models():
    """
    Memuat semua model machine learning dan file konfigurasi ke dalam memori.
    Fungsi ini dijalankan sekali saat server pertama kali dimulai.
    """
    global model_classifier, model_urgency, class_names, severity_mapping
    
    print("Mencoba memuat model dan file konfigurasi...")
    try:
        model_classifier = load_model(MODEL_CLASSIFIER_PATH)
        print(f"-> Model klasifikasi '{os.path.basename(MODEL_CLASSIFIER_PATH)}' berhasil dimuat.")
        
        model_urgency = joblib.load(MODEL_URGENCY_PATH)
        print(f"-> Model urgensi '{os.path.basename(MODEL_URGENCY_PATH)}' berhasil dimuat.")
        
        # Memuat nama kelas dari file JSON
        with open(CLASS_NAMES_PATH, 'r') as f:
            class_names = json.load(f)
        print(f"-> Nama kelas {class_names} berhasil dimuat dari '{os.path.basename(CLASS_NAMES_PATH)}'.")
        
        severity_mapping = {'jembatan': 1, 'jalan': 2}
        print(f"-> Pemetaan keparahan (severity mapping) berhasil diatur: {severity_mapping}")
        
        print("\n*** Semua model dan konfigurasi berhasil dimuat. Server siap menerima permintaan. ***\n")
        
    except Exception as e:
        print(f"\n!!! GAGAL MEMUAT MODEL ATAU FILE KONFIGURASI !!!")
        print(f"Error: {e}")
        traceback.print_exc()
        os._exit(1)


def preprocess_image_from_base64(b64_string: str) -> np.ndarray:
    """
    Mengubah string base64 menjadi array NumPy yang siap digunakan oleh model.
    
    Args:
        b64_string: String gambar dalam format base64.

    Returns:
        Array NumPy yang sudah diproses.
    """
    if "," in b64_string:
        b64_string = b64_string.split(',')[1]
        
    img_bytes = base64.b64decode(b64_string)
    
    img = Image.open(io.BytesIO(img_bytes)).convert('RGB').resize((224, 224))
    
    img_array = np.expand_dims(np.array(img), axis=0)
    
    return preprocess_input(img_array)


@app.route("/predict", methods=["POST"])
def predict():
    """Endpoint utama untuk menerima data gambar dan mengembalikan hasil prediksi."""
    
    if not request.is_json:
        return jsonify({"success": False, "error": "Input tidak valid, format harus JSON."}), 400
    
    data = request.get_json()
    
    required_keys = ["image_base64", "num_similar_reports"]
    if not all(key in data for key in required_keys):
        return jsonify({"success": False, "error": "Kunci yang dibutuhkan tidak lengkap. Pastikan ada 'image_base64' dan 'num_similar_reports'."}), 400

    try:
        image_b64 = data["image_base64"]
        num_reports = int(data["num_similar_reports"])
        
        processed_image = preprocess_image_from_base64(image_b64)
        
        predictions = model_classifier.predict(processed_image)
        pred_index = np.argmax(predictions[0])
        predicted_class = class_names[pred_index]
        confidence = float(predictions[0][pred_index] * 100)
        
        keparahan_numerik = severity_mapping.get(predicted_class, 1) 
        
        input_urgency = pd.DataFrame({
            'Keparahan_Numerik': [keparahan_numerik], 
            'Jumlah_Laporan': [num_reports]
        })
        predicted_score = model_urgency.predict(input_urgency)
        
        final_score = max(1, min(100, int(predicted_score[0])))

        print(f"Prediksi Berhasil -> Kelas: {predicted_class} ({confidence:.2f}%), Keparahan: {keparahan_numerik}, Skor Urgensi Akhir: {final_score}")

        response = {
            "success": True,
            "message": "Prediction successful",
            "prediction_results": {
                "classification_result": predicted_class,
                "confidence": round(confidence),
                "Keparahan_Numerik": keparahan_numerik,
                "urgency_prediction": final_score  
            }
        }
        return jsonify(response), 200

    except Exception as e:
        print(f"!!! TERJADI ERROR SAAT PREDIKSI !!!")
        traceback.print_exc()
        return jsonify({"success": False, "error": f"Internal server error: {str(e)}"}), 500

if __name__ == "__main__":
    load_all_models()
    app.run(host="0.0.0.0", port=5000, debug=True)
