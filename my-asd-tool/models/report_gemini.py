# import requests
# from fpdf import FPDF
# import json
# from typing import Dict, Any
# import os
# from dotenv import load_dotenv

# load_dotenv() 
# GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# def generate_autism_report(report_data: Dict[str, Any]) -> Dict[str, str]:
#     api_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GEMINI_API_KEY}"

#     prompt_text = f"""
# You are an AI generating structured psychological screening reports for children.

# Below is the child's performance across different gamified autism screening modules. Please analyze each section carefully and provide a **detailed overview**, especially for tasks with multiple levels. Highlight key behavioral insights, developmental patterns, and any potential concerns in plain language suitable for parents. Also, make sure not to use 'Chavez' as the child's name, but rather use 'the child' or 'your child'.

# Questionnaire (M-CHAT):
# - M-CHAT Score: {report_data['questionnaire']['mchat_score']}

# Pop the Balloon (Attention & Motor Control):
# Level 1:
# - Session Duration: {report_data['pop_the_balloon']['level_1']['session_duration']} sec
# - Correct Taps: {report_data['pop_the_balloon']['level_1']['correct_taps']}
# - Missed Balloons: {report_data['pop_the_balloon']['level_1']['missed_balloons']}
# - Incorrect Clicks: {report_data['pop_the_balloon']['level_1']['incorrect_clicks']}
# - Total Taps: {report_data['pop_the_balloon']['level_1']['total_taps']}

# Level 2:
# - Session Duration: {report_data['pop_the_balloon']['level_2']['session_duration']} sec
# - Correct Taps: {report_data['pop_the_balloon']['level_2']['correct_taps']}
# - Missed Balloons: {report_data['pop_the_balloon']['level_2']['missed_balloons']}
# - Incorrect Clicks: {report_data['pop_the_balloon']['level_2']['incorrect_clicks']}
# - Total Taps: {report_data['pop_the_balloon']['level_2']['total_taps']}

# Demographics:
# - Age: {report_data['pop_the_balloon']['age']} years
# - Gender: {report_data['pop_the_balloon']['gender']}

# Emotion Puzzle (Emotion Recognition Summary):
# - Total Attempts: {report_data['emotion_puzzle']['attempts_total']}
# - Total Correct: {report_data['emotion_puzzle']['correct_total']}
# - Reaction Time (Mean): {report_data['emotion_puzzle']['reaction_mean']} ms
# - Reaction Time (Median): {report_data['emotion_puzzle']['reaction_median']} ms
# - Reaction Time Range: {report_data['emotion_puzzle']['reaction_min']} – {report_data['emotion_puzzle']['reaction_max']} ms
# - Age: {report_data['emotion_puzzle']['Age']} years
# - Gender: {report_data['emotion_puzzle']['Gender']}

# Audio Analysis (Flashcards):
# - MFCC Mean: {report_data['audio_analysis']['mfcc_mean']}
# - Response Latency: {report_data['audio_analysis']['response_latency']} sec
# - Echolalia Score: {report_data['audio_analysis']['echolalia_score']}
# - Speech Confidence: {report_data['audio_analysis']['speech_confidence']}

# Classification Output (AI Model Predictions):

# - Eye Tracking (Follow the Fish): {report_data['classification_output']['ftf_output']}
# - Gaze Preference (Human vs Object): {report_data['classification_output']['hvo_output']}
# - Balloon Game (Attention & Motor Skills): {report_data['classification_output']['balloonemotion_output']}
# - Speech Analysis (Flashcards): {report_data['classification_output']['audio_output']}

# 🔁 Based on these outputs, include a short diagnostic summary within **each respective section** and DONT FORGET to mention the corresponding classified output (i.e., in `balloon_section`, `audio_section`, etc.). 

# For each section:

# - Append a sentence like: “Based on AI analysis, this game was classified as ASD/NT.”
# - Then explain **why** (e.g., “due to high incorrect taps and difficulty adapting to selective instructions”).
# - Justify the classification using the **game metrics already provided above**.
# - Keep it simple and nurturing — this should **not sound like a diagnosis**, but a screening-based interpretation.
# - Emphasize that these are **AI-powered estimates** and should be verified by a professional.

# For example, end the balloon section like:
# > “Based on the gameplay behavior, the AI model classified this task as 'ASD'. This aligns with the child’s high incorrect click rate in Level 2, suggesting difficulty in selective attention and behavioral control.”

# In the audio section:
# > “The speech module was classified as 'NT', indicating that your child demonstrated relatively typical speech clarity, timing, and confidence.”

# Now, proceed to generate the response as described below.

# 👉 Generate a structured JSON response with the following fields:

# - title: "Chavez Summary Report"
# - note: Introductory message to the parent.
# - mchat_section: detailed explanation of what the M-CHAT score implies.
# - balloon_section: Provide a detailed analysis of the Pop the Balloon game performance. 

# Explain the difference in gameplay instructions:
# → In Level 1, the child is asked to pop **all balloons** (simple motor response task).
# → In Level 2, the child is instructed to pop **only yellow balloons**, requiring **selective attention** and **inhibitory control** to avoid incorrect taps.

# Use the following metrics to evaluate:
# - Correct Taps: How well did the child follow the popping instructions in both levels?
# - Incorrect Clicks: Did the child tap non-yellow balloons in Level 2, indicating difficulty with selective response?
# - Missed Balloons: Any signs of inattention or delayed reactions?
# - Total Taps: Overall engagement—was the child actively participating?

# Compare Level 1 and Level 2:
# - Did the child adapt to the increased complexity of selective popping?
# - Were there signs of impulsivity or rigid behavior in Level 2?
# - What does the performance indicate about the child’s **instruction-following**, **attention control**, and **behavioral flexibility**?

# Use parent-friendly language but explain all observed patterns and possible concerns. Write in one paragraph
# - emotion_section: summarize the emotion puzzle metrics and discuss how the child performs in identifying emotions. Are they responding quickly? Accurately? Any hesitation or confusion? Use the summary metrics, not individual trials.
# - Follow the Fish: Explain the classified output i.e ftf_output and recommend accordingly
# - Human vs Object: Explain the classified output i.e hvo_output and recommend accordingly
# - Audio Analysis (Flashcards):
# The audio data includes detailed speech patterns such as pronunciation, speech clarity, response timing, and presence of echolalia. Please analyze the results **without listing exact metric values**. Use the following guidelines:

# - MFCC values represent how clearly the child pronounced words, and how close their speech is to typical patterns. If the values show inconsistency or distortion, it may suggest unclear articulation or difficulty forming sounds.
# - Response Latency reflects how quickly the child responded after the prompt was played. Longer delays may indicate processing difficulties or hesitation.
# - Echolalia Score measures whether the child repeats words or phrases in a non-functional way. A higher score might indicate repetitive or automatic speech patterns.
# - Speech Confidence reflects how confidently the model detected valid, clear speech from the child.

# Write **two paragraphs** that:
# 1. Translate these metrics into **plain language**, summarizing how the child performed in terms of pronunciation, clarity, and timing.
# 2. Comment on any signs of **delayed speech, unusual patterns**, or **areas where the child seems on track**.

# Do **not** mention numerical values like "MFCC = X". Just give an informative, nurturing explanation that helps parents understand what the audio analysis might imply about their child's language development.
# - summary: a developmental summary combining all insights.
# - recommendations: what the parents should consider doing next (follow-up, professional help, home activities, etc.).
# - important_consideration: reflect on the individuality of each child and stress the need for a professional evaluation.

# Only return a valid JSON response. Do not include anything else.
#     """

#     payload = {
#         "contents": [
#             {"parts": [{"text": prompt_text.strip()}]}
#         ]
#     }

#     try:
#         response = requests.post(api_url, json=payload)
#         response.raise_for_status()
#         result = response.json()

#         output_parts = result.get("candidates", [{}])[0].get("content", {}).get("parts", [])

#         if output_parts:
#             raw_json_text = output_parts[0].get("text", "").strip()

#             # 🧹 Clean up any formatting Gemini may add
#             if "```" in raw_json_text:
#                 raw_json_text = raw_json_text.split("```")[1]
#             if raw_json_text.startswith("json"):
#                 raw_json_text = raw_json_text[len("json"):].strip()

#             # 🧠 Log to debug
#             print("🧠 Gemini raw output:\n", raw_json_text)

#             # 🛡️ Parse the clean string to JSON
#             try:
#                 start = raw_json_text.find('{')
#                 end = raw_json_text.rfind('}') + 1
#                 json_string = raw_json_text[start:end]
#                 return json.loads(json_string)
#             except Exception as e:
#                 return {"error": f"Failed to parse Gemini JSON: {str(e)}"}
#         else:
#             return {"error": "No response received from Gemini."}

#     except Exception as e:
#         return {"error": str(e)}


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
You are an AI generating structured psychological screening reports for children.

Below is the child's performance across different gamified autism screening modules. Please analyze each section carefully and provide a **detailed overview**, especially for tasks with multiple levels. Highlight key behavioral insights, developmental patterns, and any potential concerns in plain language suitable for parents. Also, make sure not to use 'Chavez' as the child's name, but rather use 'the child' or 'your child'.

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

Each field (like `balloon_section`, `audio_section`, `ftf_section`, etc.) should be a single **plain text paragraph** (no JSON objects, no headings like `overview` or `classification`). Just write one or two paragraph combining the explanation and the classification insight in simple parent-friendly language.

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

