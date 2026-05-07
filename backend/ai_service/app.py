from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
from PIL import Image
import numpy as np
import io
import json
import os

app = Flask(__name__)
CORS(app)

model = None
class_indices = {}

def load_ml_resources():
    global model, class_indices
    try:
        if os.path.exists('crop_disease_model.h5'):
            model = tf.keras.models.load_model('crop_disease_model.h5')
            print("Loaded CNN model successfully.")
        else:
            print("Warning: crop_disease_model.h5 not found. Please run train.py first.")
            
        if os.path.exists('class_indices.json'):
            with open('class_indices.json', 'r') as f:
                indices = json.load(f)
                # Convert string keys to int
                class_indices = {int(k): v for k, v in indices.items()}
            print("Loaded class indices successfully.")
        else:
            print("Warning: class_indices.json not found.")
    except Exception as e:
        print(f"Error loading ML resources: {e}")

load_ml_resources()

def preprocess_image(image_bytes):
    img = Image.open(io.BytesIO(image_bytes))
    if img.mode != 'RGB':
        img = img.convert('RGB')
    img = img.resize((224, 224))
    img_array = tf.keras.preprocessing.image.img_to_array(img)
    img_array = img_array / 255.0  # Normalize as done in training
    img_array = np.expand_dims(img_array, axis=0)
    return img_array

@app.route('/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({'error': 'Model not loaded. Train the model first.'}), 503
        
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400
        
    file = request.files['image']
    image_bytes = file.read()
    
    try:
        processed_image = preprocess_image(image_bytes)
        predictions = model.predict(processed_image)
        predicted_class_idx = np.argmax(predictions[0])
        confidence = float(predictions[0][predicted_class_idx])
        
        predicted_class_name = class_indices.get(predicted_class_idx, "Unknown")
        
        return jsonify({
            'success': True,
            'prediction': predicted_class_name,
            'confidence': confidence
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5001, debug=True)
