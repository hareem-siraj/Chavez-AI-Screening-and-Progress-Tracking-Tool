import requests
import json
from typing import Dict, Any
import os
from dotenv import load_dotenv

load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

def generate_autism_report(report_data: Dict[str, Any]) -> Dict[str, str]:
    api_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GEMINI_API_KEY}"

    prompt_text = f"""
You are an AI generating structured psychological screening reports for children in Urdu.

Below is the child's performance across different gamified autism screening modules. Please analyze each section carefully and provide a **detailed overview in urdu**, especially for tasks with multiple levels. Highlight key behavioral insights, developmental patterns, and any potential concerns in plain language suitable for parents. Also, make sure not to use 'Chavez' as the child's name, but rather use 'the child' or 'your child'.

Questionnaire (M-CHAT):
- M-CHAT Score: {report_data['questionnaire']['mchat_score']}

Pop the Balloon (Attention & Motor Control):
Level 1:
- Session Duration: {report_data['pop_the_balloon']['level_1']['session_duration']} sec
- Correct Taps: {report_data['pop_the_balloon']['level_1']['correct_taps']}
- Missed Balloons: {report_data['pop_the_balloon']['level_1']['missed_balloons']}
- Incorrect Clicks: {report_data['pop_the_balloon']['level_1']['incorrect_clicks']}
- Total Taps: {report_data['pop_the_balloon']['level_1']['total_taps']}

Level 2:
- Session Duration: {report_data['pop_the_balloon']['level_2']['session_duration']} sec
- Correct Taps: {report_data['pop_the_balloon']['level_2']['correct_taps']}
- Missed Balloons: {report_data['pop_the_balloon']['level_2']['missed_balloons']}
- Incorrect Clicks: {report_data['pop_the_balloon']['level_2']['incorrect_clicks']}
- Total Taps: {report_data['pop_the_balloon']['level_2']['total_taps']}

Demographics:
- Age: {report_data['pop_the_balloon']['age']} years
- Gender: {report_data['pop_the_balloon']['gender']}

Emotion Puzzle (Emotion Recognition Summary):
- Total Attempts: {report_data['emotion_puzzle']['attempts_total']}
- Total Correct: {report_data['emotion_puzzle']['correct_total']}
- Reaction Time (Mean): {report_data['emotion_puzzle']['reaction_mean']} ms
- Reaction Time (Median): {report_data['emotion_puzzle']['reaction_median']} ms
- Reaction Time Range: {report_data['emotion_puzzle']['reaction_min']} – {report_data['emotion_puzzle']['reaction_max']} ms
- Age: {report_data['emotion_puzzle']['Age']} years
- Gender: {report_data['emotion_puzzle']['Gender']}

Audio Analysis (Flashcards):
- MFCC Mean: {report_data['audio_analysis']['mfcc_mean']}
- Response Latency: {report_data['audio_analysis']['response_latency']} sec
- Echolalia Score: {report_data['audio_analysis']['echolalia_score']}
- Speech Confidence: {report_data['audio_analysis']['speech_confidence']}

Classification Output (AI Model Predictions):
- Eye Tracking (Follow the Fish): {report_data['classification_output']['ftf_output']}
- Gaze Preference (Human vs Object): {report_data['classification_output']['hvo_output']}
- Balloon Game (Attention & Motor Skills): {report_data['classification_output']['balloonemotion_output']}
- Speech Analysis (Flashcards): {report_data['classification_output']['audio_output']}

🔁 Based on these outputs, include a short diagnostic summary within **each respective section** and mention the corresponding classified output.

For each section:
- Append a sentence like: “Based on our analysis, this game was classified as ASD/NT.”
- Then explain **why** (e.g., “due to high incorrect taps and difficulty adapting to selective instructions”).
- Justify the classification using the **game metrics already provided above**.
- keep it detailed explain the metrics and the patterns but dont add terms like "mffc" or "echolalia" in the report. Try to use simple english to explain the metrics and their results. 
- Keep it simple and nurturing — this should **not sound like a diagnosis**, but a screening-based interpretation.
- For MCHAT Scores, explain the score and its implications in a parent-friendly manner. LOW RISK (Adjusted Score 0–2): MODERATE RISK (Adjusted Score 3–7): HIGH RISK (Adjusted Score 8–20):


Also include:
- ftf_section: Explain the classified output i.e `ftf_output` and recommend accordingly.
- hvo_section: Explain the classified output i.e `hvo_output` and recommend accordingly.

Each field (like `balloon_section`, `audio_section`, `ftf_section`, etc.) should be a single **plain text paragraph in urdu** (no JSON objects, no headings like `overview` or `classification`). Just write one or two paragraph combining the explanation and the classification insight in simple parent-friendly language in urdu.

Return a valid JSON object with the following string fields:
- title
- note
- mchat_section
- balloon_section
- emotion_section
- audio_section
- ftf_section
- hvo_section
- summary
- recommendations
- important_consideration
    """

    payload = {
        "contents": [
            {"parts": [{"text": prompt_text.strip()}]}
        ]
    }

    try:
        response = requests.post(api_url, json=payload)
        response.raise_for_status()
        result = response.json()

        output_parts = result.get("candidates", [{}])[0].get("content", {}).get("parts", [])

        if output_parts:
            raw_json_text = output_parts[0].get("text", "").strip()

            # Clean Gemini formatting
            if "```" in raw_json_text:
                raw_json_text = raw_json_text.split("```")[1]
            if raw_json_text.startswith("json"):
                raw_json_text = raw_json_text[len("json"):].strip()

            print("🧠 Gemini raw output:\n", raw_json_text)

            try:
                start = raw_json_text.find('{')
                end = raw_json_text.rfind('}') + 1
                json_string = raw_json_text[start:end]
                return json.loads(json_string)
            except Exception as e:
                return {"error": f"Failed to parse Gemini JSON: {str(e)}"}
        else:
            return {"error": "No response received from Gemini."}

    except Exception as e:
        return {"error": str(e)}

