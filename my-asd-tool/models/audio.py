from fastapi import FastAPI, File, UploadFile, HTTPException
import librosa
import numpy as np
import joblib
import os
import requests
import sounddevice as sd
import wave
from pydub import AudioSegment
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware

# Load trained model
MODEL_PATH = "models/random_forest.pkl"
rf_model = joblib.load(MODEL_PATH)

app = FastAPI()

# ✅ Allow CORS for React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

# Ensure upload directory exists
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Your Node.js server URL
NODE_SERVER_URL = "http://localhost:5001/api/save-audio-data"

# Recording configuration
SAMPLE_RATE = 44100
RECORD_TIMESTAMPS = [(1, 4), (5, 10), (12, 20), (22, 30), (33, 40)]  # Start and stop times in seconds


# 🎤 Function to record audio at specific timestamps
def record_audio(start_time, duration, session_id):
    file_name = f"{session_id}_recording_{start_time}-{start_time+duration}.wav"
    file_path = os.path.join(UPLOAD_DIR, file_name)

    print(f"Recording audio from {start_time}s for {duration}s...")
    
    # Start recording
    recording = sd.rec(int(duration * SAMPLE_RATE), samplerate=SAMPLE_RATE, channels=1, dtype=np.int16)
    sd.wait()

    # Save as WAV file
    with wave.open(file_path, "wb") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(SAMPLE_RATE)
        wf.writeframes(recording.tobytes())

    return file_path



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

# 🎬 API endpoint: Starts recording at predefined timestamps
@app.post("/process-video/")
async def process_video(session_data: dict):
    session_id = session_data.get("sessionID", 0)
    
    if not session_id:
        raise HTTPException(status_code=400, detail="SessionID is required.")

    recorded_files = []

    # Record audio at predefined timestamps
    for start, stop in RECORD_TIMESTAMPS:
        duration = stop - start
        file_path = record_audio(start, duration, session_id)
        recorded_files.append(file_path)

    return process_and_store_recordings(recorded_files, session_id)

# 🎯 Process, Predict, and Store Data
def process_and_store_recordings(recorded_files, session_id):
    results = []

    for file_path in recorded_files:
        print(f"Processing {file_path}...")

        # Extract speech features
        features, mfcc_mean, response_latency, speech_confidence, speech_onset_delay, echolalia_score = extract_features(file_path)
        
        # Predict ASD or Neurotypical
        prediction = rf_model.predict(features)[0]
        label = "Autistic" if prediction == 1 else "Neurotypical"

        # Prepare data for storage
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

        # Send to Node.js API for storage
        try:
            response = requests.post(NODE_SERVER_URL, json=payload)
            response.raise_for_status()
        except requests.exceptions.RequestException as e:
            print(f"Failed to send data to server: {str(e)}")

        print(f"Stored result: {file_path} - {label}")
        results.append({"file": file_path, "SessionID": session_id, "prediction": label})

    return {"status": "Completed processing all recordings.", "results": results}