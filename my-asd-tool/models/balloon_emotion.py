import requests
import numpy as np
import pandas as pd
import joblib

# Load the trained model
BALLOON_MODEL_PATH = "models/model_updated22.pkl"
rf_balloon_model = joblib.load(BALLOON_MODEL_PATH)

# Node.js API Endpoints
BALLOON_ENDPOINT = "http://localhost:5001/api/balloon-game"
EMOTION_ENDPOINT = "http://localhost:5001/api/emotion-puzzle"
UPDATE_OUTPUT_ENDPOINT = "http://localhost:5001/api/update-balloon-emotion-output"


def fetch_metrics_from_node(endpoint, session_id):
    """
    Send POST request to Node.js API and return the JSON response.
    """
    try:
        response = requests.post(endpoint, json={"sessionID": session_id})
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"❌ Error fetching data from {endpoint}: {e}")
        return None


def process_balloon_metrics(balloon_data_list):
    """
    Process raw balloon game rows (level 1 and 2) into summary format.
    """
    df = pd.DataFrame(balloon_data_list)

    if df.empty or 'level' not in df.columns:
        raise ValueError("Balloon data is empty or malformed.")

    summary = {}

    for level in [1, 2]:
        level_data = df[df['level'] == level]
        if level_data.empty:
            raise ValueError(f"Missing level {level} data in balloon game")

        row = level_data.iloc[0]

        summary[f"sessionduration{level}"] = float(row["sessionduration"])
        summary[f"correcttaps{level}"] = int(row["correcttaps"])
        summary[f"missedballoons{level}"] = int(row["missedballoons"])
        summary[f"incorrectclicks{level}"] = int(row["incorrectclicks"])
        summary[f"totaltaps{level}"] = int(row["totaltaps"])

    return summary


def summarize_emotion_metrics(emotion_data_list):
    """
    Summarize raw emotion puzzle trial-level data into a single session summary.
    """
    df = pd.DataFrame(emotion_data_list)

    if df.empty or 'SessionID' not in df.columns:
        raise ValueError("Emotion puzzle data is empty or invalid.")

    # Convert is_correct to boolean if needed
    if df['is_correct'].dtype != 'bool':
        df['is_correct'] = df['is_correct'].astype(str).str.upper() == 'TRUE'

    session_id = df['SessionID'].iloc[0]
    age = df['Age'].iloc[0]
    gender = df['Gender'].iloc[0]

    summary = {
        "SessionID": session_id,
        "reaction_mean": float(df['reaction_time'].mean()),
        "reaction_median": float(df['reaction_time'].median()),
        "reaction_min": float(df['reaction_time'].min()),
        "reaction_max": float(df['reaction_time'].max()),
        "correct_total": int(df['is_correct'].sum()),
        "attempts_total": int(df['attempt_number'].count()),
        "Age": int(age),
        "Gender": gender
    }

    return summary


def preprocess_combined_metrics(balloon_summary, emotion_summary):
    """
    Combine both game summaries into a single model-ready input vector.
    """
    try:
        features = [
            balloon_summary["sessionduration1"],
            balloon_summary["sessionduration2"],
            balloon_summary["correcttaps1"],
            balloon_summary["correcttaps2"],
            balloon_summary["missedballoons1"],
            balloon_summary["missedballoons2"],
            balloon_summary["incorrectclicks1"],
            balloon_summary["incorrectclicks2"],
            balloon_summary["totaltaps1"],
            balloon_summary["totaltaps2"],
            emotion_summary["reaction_mean"],
            emotion_summary["reaction_median"],
            emotion_summary["reaction_min"],
            emotion_summary["reaction_max"],
            emotion_summary["correct_total"],
            emotion_summary["attempts_total"],
            emotion_summary["Age"],
            1 if emotion_summary["Gender"].strip().lower() in ["male", "m"] else 0
        ]
        return np.array(features).reshape(1, -1)
    except KeyError as e:
        raise ValueError(f"Missing expected metric key: {e}")


def update_result_in_db(session_id, label):
    """
    Store the final prediction into the sessions table.
    """
    try:
        response = requests.post(UPDATE_OUTPUT_ENDPOINT, json={
            "sessionID": session_id,
            "balloonemotion_output": label
        })
        response.raise_for_status()
        print(f"✅ Updated balloonemotion_output for SessionID: {session_id}")
    except requests.exceptions.RequestException as e:
        print(f"❌ Failed to update result: {e}")


def process_balloon_emotion_prediction(session_id):
    """
    Orchestrate the full process: Fetch, summarize, preprocess, predict, and store.
    """
    balloon_data = fetch_metrics_from_node(BALLOON_ENDPOINT, session_id)
    emotion_data = fetch_metrics_from_node(EMOTION_ENDPOINT, session_id)

    if not balloon_data:
        raise ValueError("Balloon game data not found.")
    if not emotion_data:
        raise ValueError("Emotion puzzle data not found.")

    # Process both games
    balloon_summary = process_balloon_metrics(balloon_data)
    emotion_summary = summarize_emotion_metrics(emotion_data)

    # Preprocess and predict
    features = preprocess_combined_metrics(balloon_summary, emotion_summary)
    prediction = rf_balloon_model.predict(features)[0]
    label = "Autistic" if prediction == 1 else "Neurotypical"

    # Save result
    update_result_in_db(session_id, label)

    return label
