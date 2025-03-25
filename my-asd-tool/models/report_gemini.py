import requests
from fpdf import FPDF
import json
from typing import Dict, Any
import os
from dotenv import load_dotenv


load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

def generate_autism_report(report_data: Dict[str, Any]) -> Dict[str, str]:
    api_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GEMINI_API_KEY}"

    prompt_text = f"""
You are an AI generating structured psychological screening reports for children.

Below is the child's performance across different gamified autism screening modules:

Questionnaire (M-CHAT):
- M-CHAT Score: {report_data['questionnaire']['mchat_score']}

Pop the Balloon (Attention & Motor Control):
- Session Duration: {report_data['pop_the_balloon']['session_duration']} sec
- Correct Taps: {report_data['pop_the_balloon']['correct_taps']}
- Missed Balloons: {report_data['pop_the_balloon']['missed_balloons']}
- Incorrect Clicks: {report_data['pop_the_balloon']['incorrect_clicks']}
- Total Taps: {report_data['pop_the_balloon']['total_taps']}
- Level: {report_data['pop_the_balloon']['level']}
- Age: {report_data['pop_the_balloon']['age']} years
- Gender: {report_data['pop_the_balloon']['gender']}

Emotion Puzzle (Emotion Recognition):
- Attempt #: {report_data['emotion_puzzle']['attempt_number']}
- Correct Emotion: {report_data['emotion_puzzle']['correct_emotion']}
- Selected Emotion: {report_data['emotion_puzzle']['selected_emotion']}
- Reaction Time: {report_data['emotion_puzzle']['reaction_time']} sec
- Is Correct: {report_data['emotion_puzzle']['is_correct']}
- Cumulative Time: {report_data['emotion_puzzle']['cumulative_time']} sec
- Age: {report_data['emotion_puzzle']['age']} years
- Gender: {report_data['emotion_puzzle']['gender']}
- Level: {report_data['emotion_puzzle']['level']}

Audio Analysis (Flashcards):
- MFCC Mean: {report_data['audio_analysis']['mfcc_mean']}
- Response Latency: {report_data['audio_analysis']['response_latency']} sec
- Echolalia Score: {report_data['audio_analysis']['echolalia_score']}
- Speech Confidence: {report_data['audio_analysis']['speech_confidence']}

👉 Generate a structured JSON response with the following fields:

- title: "Chavez Summary Report"
- Note: "Thank you for participating in our gamified autism screening. The results from the assessments are
summarized below. These games are designed to provide insights into various aspects of your
child's development, including attention, motor skills, language, and social interaction. Please note that this report is based solely on the provided assessment data and should
not be considered a definitive diagnosis. A qualified professional, such as a developmental
pediatrician, psychologist, or psychiatrist, must conduct a comprehensive evaluation to determine an
accurate diagnosis. This report aims to help you understand the results and guide you in seeking
further professional help."
- mchat_section: summary of the M-CHAT results
- balloon_section: insights from the Pop the Balloon game
- emotion_section: insights from the Emotion Puzzle game
- audio_section: summary of the audio/speech analysis
- summary: overall developmental summary of the child
- recommendations: guidance or next steps for the parent
- Important Considerations: "Remember that every child is unique, and the presentation of ASD can
vary widely. Focus not only on areas of challenge but also on your child's strengths and talents. Continue to monitor your child's development and seek professional
guidance as needed. Maintain a positive and supportive attitude, as this can have a profound
impact on your child's well-being and development"

Only return a valid JSON response. Do not include anything else.
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

            # 🧹 Clean up any formatting Gemini may add
            if "```" in raw_json_text:
                raw_json_text = raw_json_text.split("```")[1]
            if raw_json_text.startswith("json"):
                raw_json_text = raw_json_text[len("json"):].strip()

            # 🧠 Log to debug
            print("🧠 Gemini raw output:\n", raw_json_text)

            # 🛡️ Parse the clean string to JSON
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
