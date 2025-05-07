from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import sounddevice as sd
import wave
import os
import numpy as np
import librosa
import joblib
from datetime import datetime
from pydub import AudioSegment
import requests
import threading
from pydantic import BaseModel
import subprocess
import json
import importlib.util

app = FastAPI()

# CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Constants
SAMPLE_RATE = 44100
UPLOAD_DIR = "uploads"
MODEL_PATH = "models/random_forest_model_audio.pkl"
NODE_SERVER_URL = "https://chavez-ai-screening-and-progress.onrender.com/api/save-audio-data"
RECORD_TIMESTAMPS = [(1, 4), (5, 10), (12, 20), (22, 30), (33, 59)]
RECORD_DURATION = 60  # full video/audio length

# Ensure directory exists
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Load model
rf_model = joblib.load(MODEL_PATH)


############################################
# 🎙️ Record full audio in separate thread
def record_audio_background(session_id: int, duration: int = RECORD_DURATION):
    print(f"🎙️ Starting background recording for {duration}s...")

    recording = sd.rec(int(duration * SAMPLE_RATE), samplerate=SAMPLE_RATE, channels=1, dtype=np.int16)
    sd.wait()

    file_path = os.path.join(UPLOAD_DIR, f"{session_id}_full.wav")
    with wave.open(file_path, "wb") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(SAMPLE_RATE)
        wf.writeframes(recording.tobytes())

    print(f"✅ Audio saved to {file_path}")


############################################
# 📡 Start recording when video plays
@app.post("/start-audio")
async def start_audio(session_data: dict):
    session_id = session_data.get("sessionID", 0)
    if not session_id:
        raise HTTPException(status_code=400, detail="SessionID is required.")

    thread = threading.Thread(target=record_audio_background, args=(session_id,))
    thread.start()

    return {"status": "Recording started", "sessionID": session_id}


############################################
# ✂️ Extract timestamp-based segments
def extract_segments(full_audio_path, timestamps, session_id):
    audio = AudioSegment.from_wav(full_audio_path)
    recorded_files = []

    for start, stop in timestamps:
        segment = audio[start * 1000: stop * 1000]  # convert to milliseconds
        file_path = os.path.join(UPLOAD_DIR, f"{session_id}segment{start}-{stop}.wav")
        segment.export(file_path, format="wav")
        recorded_files.append(file_path)

    return recorded_files


############################################
# ➕ Combine all segments
def combine_audio_files(file_paths, session_id):
    combined = AudioSegment.empty()
    for file in file_paths:
        audio = AudioSegment.from_wav(file)
        combined += audio

    combined_path = os.path.join(UPLOAD_DIR, f"{session_id}_combined.wav")
    combined.export(combined_path, format="wav")
    return combined_path


############################################
# 🔍 Extract features for classification
def extract_features(audio_path):
    y, sr = librosa.load(audio_path, sr=None)
    mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
    mfcc_mean = np.mean(mfcc, axis=1)

    onset_env = librosa.onset.onset_strength(y=y, sr=sr)
    onset_times = librosa.onset.onset_detect(y=y, sr=sr, backtrack=True)

    response_latency = onset_times[0] if len(onset_times) > 0 else -1
    speech_confidence = np.mean(onset_env)
    speech_onset_delay = response_latency
    echolalia_score = np.std(onset_env)

    features = np.concatenate([mfcc_mean, [response_latency, speech_confidence, speech_onset_delay, echolalia_score]])
    return features.reshape(1, -1), mfcc_mean.tolist(), response_latency, speech_confidence, speech_onset_delay, echolalia_score


############################################
# 🧠 Process and Predict ASD
def process_and_store_recordings(combined_audio_path, session_id):
    print(f"🧪 Processing combined audio: {combined_audio_path}")
    features, mfcc_mean, response_latency, speech_confidence, speech_onset_delay, echolalia_score = extract_features(combined_audio_path)

    prediction = rf_model.predict(features)[0]
    label = "Autistic" if prediction == 1 else "Neurotypical"

    payload = {
        "SessionID": session_id,
        "MFCC_Mean": [float(x) for x in mfcc_mean],
        "ResponseLatency": float(response_latency),
        "SpeechConfidence": float(speech_confidence),
        "SpeechOnsetDelay": float(speech_onset_delay),
        "EcholaliaScore": float(echolalia_score),
        "Prediction": label,
        "Timestamp": datetime.now().isoformat()
    }

    try:
        response = requests.post(NODE_SERVER_URL, json=payload)
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        print(f"❌ Failed to send data to Node server: {str(e)}")

    try:
        status_url = f"https://chavez-ai-screening-and-progress.onrender.com/api/mark-speech-status-true/{session_id}"
        status_response = requests.post(status_url)
        status_response.raise_for_status()
        print(f"✅ Speech status updated for SessionID: {session_id}")
    except requests.exceptions.RequestException as e:
        print(f"❌ Failed to update speech status: {str(e)}")

    return {"status": "Processing completed", "sessionID": session_id, "prediction": label}


############################################
# 🧾 Endpoint: Process after recording
@app.post("/process-audio/")
async def process_audio(session_data: dict):
    session_id = session_data.get("sessionID", 0)
    if not session_id:
        raise HTTPException(status_code=400, detail="SessionID is required.")

    full_audio_path = os.path.join(UPLOAD_DIR, f"{session_id}_full.wav")
    if not os.path.exists(full_audio_path):
        raise HTTPException(status_code=404, detail="Full audio not found. Did recording complete?")

    recorded_files = extract_segments(full_audio_path, RECORD_TIMESTAMPS, session_id)
    combined_audio_path = combine_audio_files(recorded_files, session_id)

    return process_and_store_recordings(combined_audio_path, session_id)

########################################################### EYE TRACKING #######################################################


# 🎯 API: Start Eye Tracking    
@app.post("/start-eyetracking/")
async def start_eye_tracking(data: dict):
    session_id = data.get("sessionID", 0)
    print(f"Starting eye tracking for SessionID python file printing: {session_id}")

    try:
        # Get absolute path to the script
        current_dir = os.path.dirname(os.path.abspath(__file__))
        script_path = os.path.join(current_dir, "try.py")
        
        # Make sure the script exists
        if not os.path.exists(script_path):
            return {"error": f"Eye tracking script not found at {script_path}"}
        
        # Launch the subprocess with proper permissions
        process = subprocess.Popen(
            ["python3", script_path, str(session_id)], 
            # Redirect output to prevent blocking
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            # Run in background
            start_new_session=True
        )
        
        # Check if process started successfully
        if process.poll() is None:  # None means it's still running
            return {"message": "Eye tracking started successfully", "process_id": process.pid}
        else:
            return {"error": "Failed to start eye tracking process"}
    except Exception as e:
        print(f"Error starting eye tracking: {str(e)}")
        return {"error": str(e)}

@app.post("/stop-eyetracking/")
async def stop_eye_tracking(data: dict):
    session_id = data.get("sessionID", 0)
    print(f"Stopping eye tracking for SessionID: {session_id}")

    try:
        # Create stop signal file
        stop_signal_file = f"stop_signal_{session_id}.txt"
        with open(stop_signal_file, "w") as f:
            f.write("stop")
            f.write("stop")

        return {"message": "Eye tracking stop signal sent"}
    except Exception as e:
        print(f"Error stopping eye tracking: {str(e)}")
        return {"error": str(e)}
    
@app.post("/start-eyetracking2/")
async def start_eye_tracking2(data: dict):
    session_id = data.get("sessionID", 0)
    print(f"Starting eye tracking for SessionID python file printing: {session_id}")

    try:
        # Get absolute path to the script
        current_dir = os.path.dirname(os.path.abspath(__file__))
        script_path = os.path.join(current_dir, "human.py")
        
        # Make sure the script exists
        if not os.path.exists(script_path):
            return {"error": f"Eye tracking script not found at {script_path}"}
        
        # Launch the subprocess with proper permissions
        process = subprocess.Popen(
            ["python3", script_path, str(session_id)], 
            # Redirect output to prevent blocking
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            start_new_session=True
        )
        
        # Check if process started successfully
        if process.poll() is None:  # None means it's still running
            return {"message": "Eye tracking started successfully", "process_id": process.pid}
        else:
            return {"error": "Failed to start eye tracking process"}
    except Exception as e:
        print(f"Error starting eye tracking: {str(e)}")
        return {"error": str(e)}

@app.post("/stop-eyetracking2/")
async def stop_eye_tracking2(data: dict):
    session_id = data.get("sessionID", 0)
    print(f"Stopping eye tracking for SessionID: {session_id}")

    try:
        # Create stop signal file
        stop_signal_file = f"stop2_signal_{session_id}.txt"
        with open(stop_signal_file, "w") as f:
            f.write("stop")
            f.write("stop")

        return {"message": "Eye tracking stop signal sent"}
    except Exception as e:
        print(f"Error stopping eye tracking: {str(e)}")
        return {"error": str(e)}
    


############################################################ BALLOON EMOTION MODEL #######################################################
from models.balloon_emotion import process_balloon_emotion_prediction

@app.post("/process-balloon-emotion/")
async def process_balloon_emotion(session_data: dict):
    session_id = session_data.get("sessionID")
    if not session_id:
        raise HTTPException(status_code=400, detail="SessionID is required.")

    try:
        prediction = process_balloon_emotion_prediction(session_id)
        return {"status": "Processed", "prediction": prediction, "sessionID": session_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

########################################################### AUTISM REPORT #######################################################

class ReportRequest(BaseModel):
    data: str  # JSON string

# -------------------- Load English Report Module --------------------
english_path = os.path.join(os.path.dirname(__file__), "report_gemini.py")
spec_en = importlib.util.spec_from_file_location("report_gemini", english_path)
report_gemini = importlib.util.module_from_spec(spec_en)
spec_en.loader.exec_module(report_gemini)

# -------------------- Load Urdu Report Module --------------------
urdu_path = os.path.join(os.path.dirname(__file__), "report_gemini_urdu.py")
spec_urdu = importlib.util.spec_from_file_location("report_gemini_urdu", urdu_path)
report_gemini_urdu = importlib.util.module_from_spec(spec_urdu)
spec_urdu.loader.exec_module(report_gemini_urdu)

# -------------------- English Report API --------------------
@app.post("/api/generate-report")
async def generate_report(req: ReportRequest):
    try:
        report_data = json.loads(req.data)
        report_text = report_gemini.generate_autism_report(report_data)
        return report_text
    except Exception as e:
        return {"error": str(e)}

# -------------------- Urdu Report API --------------------
@app.post("/api/generate-report-urdu")
async def generate_report_urdu(req: ReportRequest):
    try:
        report_data = json.loads(req.data)
        report_text = report_gemini_urdu.generate_autism_report_urdu(report_data)
        return report_text
    except Exception as e:
        return {"error": str(e)}