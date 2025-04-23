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
from pydantic import BaseModel
import subprocess
import json
import importlib.util

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)


############################################### AUDIO ANALYSIS #######################################################


# Load trained model
MODEL_PATH = "models/random_forest_model_audio.pkl"
rf_model = joblib.load(MODEL_PATH)

# Ensure upload directory exists
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


NODE_SERVER_URL = "http://localhost:5001/api/save-audio-data"


SAMPLE_RATE = 44100
RECORD_TIMESTAMPS = [(1, 4), (5, 10), (12, 20), (22, 30), (33, 59)]  

def record_audio(start_time, duration, session_id):
    file_name = f"{session_id}_recording_{start_time}-{start_time+duration}.wav"
    file_path = os.path.join(UPLOAD_DIR, file_name)

    print(f"Recording audio from {start_time}s for {duration}s...")
    
    # Start recording
    recording = sd.rec(int(duration * SAMPLE_RATE), samplerate=SAMPLE_RATE, channels=1, dtype=np.int16)
    sd.wait()

    with wave.open(file_path, "wb") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(SAMPLE_RATE)
        wf.writeframes(recording.tobytes())

    return file_path

def combine_audio_files(file_paths, session_id):
    combined = AudioSegment.empty()
    
    for file in file_paths:
        audio = AudioSegment.from_wav(file)
        combined += audio 

    combined_path = os.path.join(UPLOAD_DIR, f"{session_id}_combined.wav")
    combined.export(combined_path, format="wav")

    return combined_path

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

    # 🛠️ Combine all recorded files into a single audio file
    combined_audio_path = combine_audio_files(recorded_files, session_id)

    # Process and store the combined recording
    return process_and_store_recordings(combined_audio_path, session_id)

# 🎯 Process, Predict, and Store Data
def process_and_store_recordings(combined_audio_path, session_id):
    print(f"Processing combined audio file: {combined_audio_path}")

    # Extract speech features
    features, mfcc_mean, response_latency, speech_confidence, speech_onset_delay, echolalia_score = extract_features(combined_audio_path)

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

    print(f"Stored result: {combined_audio_path} - {label}")


    # CALL API HERE "/api/mark-speech-status-true/:sessionId"
    try:
        speech_status_url = f"http://localhost:5001/api/mark-speech-status-true/{session_id}"
        status_response = requests.post(speech_status_url)
        status_response.raise_for_status()
        print(f"✅ Speech status updated for SessionID: {session_id}")
    except requests.exceptions.RequestException as e:
        print(f"❌ Failed to update SpeechStatus: {str(e)}")

        
    return {"status": "Processing completed.", "sessionID": session_id, "prediction": label}


########################################################### EYE TRACKING #######################################################


# 🎯 API: Start Eye Tracking    
@app.post("/start-eyetracking/")
async def start_eye_tracking(data: dict):
    session_id = data.get("sessionID", 0)
    print(f"Starting eye tracking for SessionID: {session_id}")

    try:
        # Get absolute path to the script
        current_dir = os.path.dirname(os.path.abspath(__file__))
        script_path = os.path.join(current_dir, "try.py")
        
        # Make sure the script exists
        if not os.path.exists(script_path):
            return {"error": f"Eye tracking script not found at {script_path}"}
        
        # Launch the subprocess with proper permissions
        process = subprocess.Popen(
            ["python", script_path, str(session_id)], 
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
    print(f"Starting eye tracking for SessionID: {session_id}")

    try:
        # Get absolute path to the script
        current_dir = os.path.dirname(os.path.abspath(__file__))
        script_path = os.path.join(current_dir, "human.py")
        
        # Make sure the script exists
        if not os.path.exists(script_path):
            return {"error": f"Eye tracking script not found at {script_path}"}
        
        # Launch the subprocess with proper permissions
        process = subprocess.Popen(
            ["python", script_path, str(session_id)], 
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

    
# class ReportRequest(BaseModel):
#     data: str  # JSON string

# file_path = os.path.join(os.path.dirname(__file__), "report_gemini.py")

# # Load module
# spec = importlib.util.spec_from_file_location("report_gemini", file_path)
# report_gemini = importlib.util.module_from_spec(spec)
# spec.loader.exec_module(report_gemini)

# @app.post("/api/generate-report")
# async def generate_report(req: ReportRequest):
#     try:
#         report_data = json.loads(req.data)
#         report_text = report_gemini.generate_autism_report(report_data)
#         return report_text
#     except Exception as e:
#         return {"error": str(e)}

# @app.get("/api/download-report")
# async def download_report():
#     from fastapi.responses import FileResponse
#     return FileResponse("autism_report.pdf", media_type="application/pdf", filename="autism_report.pdf")



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