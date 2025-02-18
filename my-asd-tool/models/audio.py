from fastapi import FastAPI, File, UploadFile
import librosa
import numpy as np
import joblib
import os
import requests
from pydub import AudioSegment
from datetime import datetime

# Load trained model
MODEL_PATH = "random_forest.pkl"
rf_model = joblib.load(MODEL_PATH)

app = FastAPI()

# Ensure upload directory exists
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Your Node.js server URL
NODE_SERVER_URL = "http://localhost:5001/api/save-audio-data"

# Function to extract features
def extract_features(audio_path):
    y, sr = librosa.load(audio_path, sr=None)

    # Extract MFCC features
    mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
    mfcc_mean = np.mean(mfcc, axis=1)  # Averaged MFCCs

    # Speech-related features
    onset_env = librosa.onset.onset_strength(y=y, sr=sr)
    onset_times = librosa.onset.onset_detect(y=y, sr=sr, backtrack=True)

    response_latency = onset_times[0] if len(onset_times) > 0 else -1
    speech_confidence = np.mean(onset_env)
    speech_onset_delay = response_latency
    echolalia_score = np.std(onset_env)

    # Combine features
    features = np.concatenate([mfcc_mean, [response_latency, speech_confidence, speech_onset_delay, echolalia_score]])
    return features.reshape(1, -1), mfcc_mean.tolist(), response_latency, speech_confidence, speech_onset_delay, echolalia_score

@app.post("/predict/")
async def predict(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_DIR, file.filename)

    # Save uploaded file
    with open(file_path, "wb") as f:
        f.write(await file.read())

    # Extract SessionID from filename
    try:
        session_id = int(file.filename.split("_")[0])
    except ValueError:
        return {"error": "Invalid filename format. SessionID must be an integer at the start."}

    # Convert if needed
    if file.filename.endswith(".m4a"):
        audio = AudioSegment.from_file(file_path, format="m4a")
        file_path = file_path.replace(".m4a", ".wav")
        audio.export(file_path, format="wav")

    # Extract features and predict
    features, mfcc_mean, response_latency, speech_confidence, speech_onset_delay, echolalia_score = extract_features(file_path)
    prediction = rf_model.predict(features)[0]
    label = "Autistic" if prediction == 1 else "Neurotypical"

    # Send data to Node.js server
    payload = {
        "SessionID": session_id,
        "MFCC_Mean": [float(x) for x in mfcc_mean],  # Convert to float
        "ResponseLatency": float(response_latency),   # Convert to float
        "SpeechConfidence": float(speech_confidence), # Convert to float
        "SpeechOnsetDelay": float(speech_onset_delay), # Convert to float
        "EcholaliaScore": float(echolalia_score),     # Convert to float
        "Prediction": label,
        "Timestamp": datetime.now().isoformat()
    }

    try:
        response = requests.post(NODE_SERVER_URL, json=payload)
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        return {"error": f"Failed to send data to server.mjs: {str(e)}"}

    return {"file": file.filename, "SessionID": session_id, "prediction": label}
