# import cv2
# import dlib
# import numpy as np
# import matplotlib.pyplot as plt
# import time
# import sys
# import os
# import requests
# import json

# from tensorflow.keras.models import load_model
# from tensorflow.keras.preprocessing.image import load_img, img_to_array

# # API endpoint
# API_URL = "https://chavez-ai-screening-and-progress.onrender.com/api/save-follow-data" 
# API_URL1 = "https://chavez-ai-screening-and-progress.onrender.com/api/update-ftf-output"

# if len(sys.argv) > 1:
#     session_id = sys.argv[1]  # Get sessionID from command-line argument
#     print(f"Eye tracking started for SessionID: {session_id}")
# else:
#     print("No SessionID provided!")

# # Load Dlib's face detector and landmark predictor
# detector = dlib.get_frontal_face_detector()
# # predictor = dlib.shape_predictor("C:\Users\Siraj\Documents\GitHub\Chavez-AI-Screening-and-Progress-Tracking-Tool\Chavez-AI-Screening-and-Progress-Tracking-Tool\my-asd-tool\models\shape_predictor_68_face_landmarks.dat")
# predictor = dlib.shape_predictor("/Users/simalanjum/Desktop/Chavez-AI-Screening-and-Progress-Tracking-Tool/my-asd-tool/models/shape_predictor_68_face_landmarks.dat")

# # Function to get eye landmarks
# def get_eye_landmarks(landmarks, eye_indices):
#     return [(landmarks.part(i).x, landmarks.part(i).y) for i in eye_indices]

# # Function to get the center of the eye
# def get_eye_center(eye_points):
#     x = sum([p[0] for p in eye_points]) // len(eye_points)
#     y = sum([p[1] for p in eye_points]) // len(eye_points)
#     return (x, y)

# # Initialize webcam
# cap = cv2.VideoCapture(0)

# scanpath = []  # Store gaze points with timestamps

# # Define stop signal file
# stop_signal_file = f"stop_signal_{session_id}.txt"

# try:
#     while True:
#         ret, frame = cap.read()
#         if not ret:
#             break

#         gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
#         faces = detector(gray)

#         for face in faces:
#             landmarks = predictor(gray, face)

#             # Get left and right eye landmarks
#             left_eye = get_eye_landmarks(landmarks, [36, 37, 38, 39, 40, 41])
#             right_eye = get_eye_landmarks(landmarks, [42, 43, 44, 45, 46, 47])

#             # Compute eye centers
#             left_eye_center = get_eye_center(left_eye)
#             right_eye_center = get_eye_center(right_eye)

#             # Compute average gaze position
#             gaze_x = (left_eye_center[0] + right_eye_center[0]) // 2
#             gaze_y = (left_eye_center[1] + right_eye_center[1]) // 2

#             # Store gaze points with timestamp
#             scanpath.append((gaze_x, gaze_y, time.time()))

#         # Stop tracking after 10 seconds
#         # if time.time() - start_time > duration:
#         #     break

#         # Check if stop signal file exists
#         if os.path.exists(stop_signal_file):
#             print("Stop signal received. Exiting eye tracking...")
#             break

#         if cv2.waitKey(1) & 0xFF == ord('q'):
#             break

# finally:

#     cap.release()
#     cv2.destroyAllWindows()

#     # Cleanup stop signal file after stopping
#     if os.path.exists(stop_signal_file):
#         os.remove(stop_signal_file)

#     print("Eye tracking stopped successfully.")

# # ----------------------------------------------------------------------------------------------------------------------------------------------

# # import cv2
# # import dlib
# # import numpy as np
# # import matplotlib.pyplot as plt
# # import time
# # import sys
# # import os
# # import requests
# # import json

# # from tensorflow.keras.models import load_model
# # from tensorflow.keras.preprocessing.image import load_img, img_to_array

# # API_URL = "https://chavez-ai-screening-and-progress.onrender.com/api/save-follow-data"
# # API_URL1 = "https://chavez-ai-screening-and-progress.onrender.com/api/update-ftf-output"

# # if len(sys.argv) > 1:
# #     session_id = sys.argv[1]
# #     print(f"🎯 Eye tracking started for SessionID: {session_id}")
# # else:
# #     print("❌ No SessionID provided.")
# #     sys.exit(1)

# # # Load Dlib models
# # cnn_detector = dlib.cnn_face_detection_model_v1("/Users/simalanjum/Desktop/Chavez-AI-Screening-and-Progress-Tracking-Tool/my-asd-tool/models/mmod_human_face_detector.dat")
# # predictor = dlib.shape_predictor("/Users/simalanjum/Desktop/Chavez-AI-Screening-and-Progress-Tracking-Tool/my-asd-tool/models/shape_predictor_68_face_landmarks.dat")

# # # Eye utility functions
# # def get_eye_landmarks(landmarks, eye_indices):
# #     return [(landmarks.part(i).x, landmarks.part(i).y) for i in eye_indices]

# # def get_eye_center(eye_points):
# #     x = sum([p[0] for p in eye_points]) // len(eye_points)
# #     y = sum([p[1] for p in eye_points]) // len(eye_points)
# #     return (x, y)

# # # Initialize camera
# # cap = cv2.VideoCapture(0)
# # start_time = time.time()
# # while not cap.isOpened():
# #     if time.time() - start_time > 5:
# #         print("❌ Webcam failed to open.")
# #         sys.exit(1)
# #     time.sleep(0.5)
# # print("✅ Webcam opened.")

# # scanpath = []
# # stop_signal_file = f"stop_signal_{session_id}.txt"

# # try:
# #     max_wait = 60
# #     wait_start = time.time()
# #     scale = 0.5

# #     while True:
# #         ret, frame = cap.read()
# #         if not ret:
# #             print("⚠️ Could not read frame.")
# #             continue

# #         gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
# #         small_gray = cv2.resize(gray, (0, 0), fx=scale, fy=scale)
# #         cnn_faces = cnn_detector(small_gray)
# #         small_faces = [d.rect for d in cnn_faces]

# #         rescaled_faces = []
# #         for face in small_faces:
# #             rescaled_faces.append(
# #                 dlib.rectangle(
# #                     int(face.left() / scale),
# #                     int(face.top() / scale),
# #                     int(face.right() / scale),
# #                     int(face.bottom() / scale)
# #                 )
# #             )

# #         if rescaled_faces:
# #             for face in rescaled_faces:
# #                 landmarks = predictor(gray, face)
# #                 left_eye = get_eye_landmarks(landmarks, [36, 37, 38, 39, 40, 41])
# #                 right_eye = get_eye_landmarks(landmarks, [42, 43, 44, 45, 46, 47])
# #                 left_eye_center = get_eye_center(left_eye)
# #                 right_eye_center = get_eye_center(right_eye)
# #                 gaze_x = (left_eye_center[0] + right_eye_center[0]) // 2
# #                 gaze_y = (left_eye_center[1] + right_eye_center[1]) // 2
# #                 scanpath.append((gaze_x, gaze_y, time.time()))

# #         if os.path.exists(stop_signal_file):
# #             print("🛑 Stop signal received. Exiting...")
# #             break

# #         if time.time() - wait_start > max_wait:
# #             print("⏳ Max wait time reached. Ending tracking.")
# #             break

# #         if len(scanpath) == 0 and int(time.time() - wait_start) % 5 == 0:
# #             print("⏳ Still waiting for valid face detection...")

# # finally:
# #     cap.release()
# #     cv2.destroyAllWindows()
# #     if os.path.exists(stop_signal_file):
# #         os.remove(stop_signal_file)
# #     print("✅ Camera released.")

# # ----------------------------------------------------------------------------------------------------------------------------------------------
# # Ensure scanpath is not empty before processing
# if scanpath:
# # ----------------------------------------------------------------------------------------------------------------------------------------------
#     # cap.release()
#     # cv2.destroyAllWindows()
# # ----------------------------------------------------------------------------------------------------------------------------------------------

#     # Prepare scanpath data
#     scanpath_json = [{"x": int(x), "y": int(y), "timestamp": float(t)} for x, y, t in scanpath]

#     # Prepare payload
#     payload = {
#         "SessionID": session_id,
#         "ScanPath": scanpath_json,
#         "Timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())  # Optional timestamp
#     }

#     # Send data to the server
#     try:
#         response = requests.post(API_URL, json=payload, headers={"Content-Type": "application/json"})
#         if response.status_code == 200:
#             print("Follow data saved successfully:", response.json())
#         else:
#             print("Error saving follow data:", response.status_code, response.text)
#     except requests.exceptions.RequestException as e:
#         print("Failed to connect to server:", e)

    
#     scanpath = np.array(scanpath)  # Convert to NumPy array

#     # Compute velocity for gaze movements
#     velocities = []
    
#     for i in range(1, len(scanpath)):
#         x1, y1, t1 = scanpath[i - 1]
#         x2, y2, t2 = scanpath[i]

#         dt = t2 - t1  # Time difference
#         if dt == 0:
#             continue  # Avoid division by zero

#         # Calculate velocity (distance / time)
#         velocity = np.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2) / dt
#         velocities.append(velocity)

#     velocities = np.array(velocities)

#     # Normalize values for color mapping
#     max_velocity = np.max(velocities) if len(velocities) > 0 else 1

#     # Get the min and max coordinates for zooming
#     min_x, max_x = min(scanpath[:, 0]) - 20, max(scanpath[:, 0]) + 20
#     min_y, max_y = min(scanpath[:, 1]) - 20, max(scanpath[:, 1]) + 20

#     # Generate scanpath visualization with BLACK BACKGROUND
#     plt.figure(figsize=(10, 7), facecolor='black')

#     # Get axis
#     ax = plt.gca()
#     ax.set_facecolor('black')  # Set background color
#     ax.set_xticks([])  # Remove x-axis ticks
#     ax.set_yticks([])  # Remove y-axis ticks
#     ax.set_xticklabels([])  # Remove x-axis labels
#     ax.set_yticklabels([])  # Remove y-axis labels
#     ax.set_frame_on(False)  # Remove border

#     # Plot gaze path with color-coded velocity
#     for i in range(1, len(scanpath)):
#         x1, y1, _ = scanpath[i - 1]
#         x2, y2, _ = scanpath[i]

#         # Determine color based on velocity
#         if i - 1 < len(velocities):
#             norm_vel = velocities[i - 1] / max_velocity  # Normalize

#             # Cyan for fixations, Red for saccades, Purple for slow transitions
#             if norm_vel < 0.2:
#                 color = (0, 1, 1)  # Cyan for Fixations
#             elif norm_vel > 0.8:
#                 color = (1, 0, 0)  # Red for fastest Saccades
#             else:
#                 color = (0.5, 0, 0.5)  # Purple for normal tracking

#         else:
#             color = (0.5, 0, 0.5)  # Default to purple for static fixations

#         plt.plot([x1, x2], [y1, y2], color=color, alpha=0.8, linewidth=2)  # Removed markers

#     # Zoom into the gaze region dynamically
#     plt.xlim(min_x, max_x)
#     plt.ylim(min_y, max_y)

#     plt.title("")  # Remove title

#     output_image = f"{session_id}_follow_scanpath_visualization.png"  # or .pdf, .svg

#     plt.savefig(output_image, facecolor='black', dpi=300, bbox_inches='tight')
#     print(f"Scanpath visualization saved as {output_image}")

#     # plt.show()
#     plt.close() 

#     try:
#         # model = load_model("models/ftf_model.h5")
#         model =  load_model('models/ftf_model.h5', compile=False)
#         print("Model loaded successfully.")
#         # Load the image in grayscale and resize to 200x200
#         img = load_img(output_image, color_mode='grayscale', target_size=(200, 200))
#         img_array = img_to_array(img)

        
#         # Normalize and reshape to (1, 200, 200, 1)
#         img_array = img_array / 255.0
#         img_array = np.expand_dims(img_array, axis=0)
#         print("Image preprocessed. Shape:", img_array.shape)

#         print("Image shape before prediction:", img_array.shape)  # Should be (1, 200, 200, 1)
        
#         prediction = model.predict(img_array)[0][0]  # Get scalar float output

#         # Interpret prediction
#         label = "Autistic" if prediction >= 0.5 else "Neurotypical"
#         confidence = prediction if prediction >= 0.5 else 1 - prediction

#         # Print diagnosis
#         print(f"\nPrediction: {label}")
#         print(f"Confidence: {confidence * 100:.2f}%")
#         print(f"Raw probability: {prediction:.4f}")

#     except Exception as e:
#         # print("Model prediction failed:", e)
#         import traceback
#         print("Model prediction failed:")
#         traceback.print_exc()
#         prediction = None

#     try:
#         payload = {
#             "sessionID": session_id,
#             "ftf_output": label if prediction is not None else "Unknown",
#         }

#         # Debugging statements
#         print("\n✅ Payload to be sent to backend:")
#         print(json.dumps(payload, indent=2))

#         response = requests.post(API_URL1, json=payload, headers={"Content-Type": "application/json"})

#         print("📡 Response status code:", response.status_code)
#         print("📡 Response text:", response.text)

#         if response.status_code == 200:
#             print("✅ FTF output saved successfully.")
#         else:
#             print("❌ Error from server:", response.status_code, response.text)
#     except Exception as e:
#         print("❌ Failed to connect to API:")
#         import traceback
#         traceback.print_exc()
# else:
#     print("No eye-tracking data collected. Please ensure face detection works.")






# # import cv2
# # import dlib
# # import numpy as np
# # import matplotlib.pyplot as plt
# # import time
# # import sys
# # import os
# # import requests
# # import json
# # # from tensorflow.keras.models import load_model
# # from tensorflow.keras.models import load_model
# # from tensorflow.keras.preprocessing.image import load_img, img_to_array
# # # from keras.src.utils.image_utils import load_img, img_to_array
# # # import tensorflow as tf


# # # API endpoint
# # API_URL = "https://chavez-ai-screening-and-progress.onrender.com/api/save-follow-data" 
# # API_URL1 = "https://chavez-ai-screening-and-progress.onrender.com/api/update-ftf-output"

# # if len(sys.argv) > 1:
# #     session_id = sys.argv[1]  # Get sessionID from command-line argument
# #     print(f"Eye tracking started for SessionID: {session_id}")
# # else:
# #     print("No SessionID provided!")

# # # Load Dlib's face detector and landmark predictor
# # detector = dlib.get_frontal_face_detector()
# # predictor = dlib.shape_predictor("/Users/simalanjum/Desktop/Chavez-AI-Screening-and-Progress-Tracking-Tool/my-asd-tool/models/shape_predictor_68_face_landmarks.dat")
# # # Function to get eye landmarks
# # def get_eye_landmarks(landmarks, eye_indices):
# #     return [(landmarks.part(i).x, landmarks.part(i).y) for i in eye_indices]

# # # Function to get the center of the eye
# # def get_eye_center(eye_points):
# #     x = sum([p[0] for p in eye_points]) // len(eye_points)
# #     y = sum([p[1] for p in eye_points]) // len(eye_points)
# #     return (x, y)

# # # Initialize webcam
# # cap = cv2.VideoCapture(0)

# # scanpath = []  # Store gaze points with timestamps
# # # start_time = time.time()
# # # duration = 60  # Track for 10 seconds

# # # Define stop signal file
# # stop_signal_file = f"stop_signal_{session_id}.txt"

# # try:
# #     while True:
# #         ret, frame = cap.read()
# #         if not ret:
# #             break

# #         gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
# #         faces = detector(gray)

# #         for face in faces:
# #             landmarks = predictor(gray, face)

# #             # Get left and right eye landmarks
# #             left_eye = get_eye_landmarks(landmarks, [36, 37, 38, 39, 40, 41])
# #             right_eye = get_eye_landmarks(landmarks, [42, 43, 44, 45, 46, 47])

# #             # Compute eye centers
# #             left_eye_center = get_eye_center(left_eye)
# #             right_eye_center = get_eye_center(right_eye)

# #             # Compute average gaze position
# #             gaze_x = (left_eye_center[0] + right_eye_center[0]) // 2
# #             gaze_y = (left_eye_center[1] + right_eye_center[1]) // 2

# #             # Store gaze points with timestamp
# #             scanpath.append((gaze_x, gaze_y, time.time()))

# #         # Stop tracking after 10 seconds
# #         # if time.time() - start_time > duration:
# #         #     break

# #         # Check if stop signal file exists
# #         if os.path.exists(stop_signal_file):
# #             print("Stop signal received. Exiting eye tracking...")
# #             break

# #         if cv2.waitKey(1) & 0xFF == ord('q'):
# #             break

# # finally:

# #     cap.release()
# #     cv2.destroyAllWindows()

# #     # Cleanup stop signal file after stopping
# #     if os.path.exists(stop_signal_file):
# #         os.remove(stop_signal_file)

# #     print("Eye tracking stopped successfully.")


# # # Ensure scanpath is not empty before processing
# # if scanpath:

# #     # Prepare scanpath data
# #     scanpath_json = [{"x": int(x), "y": int(y), "timestamp": float(t)} for x, y, t in scanpath]

# #     # Prepare payload
# #     payload = {
# #         "SessionID": session_id,
# #         "ScanPath": scanpath_json,
# #         "Timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())  # Optional timestamp
# #     }

# #     # Send data to the server
# #     try:
# #         response = requests.post(API_URL, json=payload, headers={"Content-Type": "application/json"})
# #         if response.status_code == 200:
# #             print("Follow data saved successfully:", response.json())
# #         else:
# #             print("Error saving follow data:", response.status_code, response.text)
# #     except requests.exceptions.RequestException as e:
# #         print("Failed to connect to server:", e)

    
# #     scanpath = np.array(scanpath)  # Convert to NumPy array

# #     # Compute velocity for gaze movements
# #     velocities = []
    
# #     for i in range(1, len(scanpath)):
# #         x1, y1, t1 = scanpath[i - 1]
# #         x2, y2, t2 = scanpath[i]

# #         dt = t2 - t1  # Time difference
# #         if dt == 0:
# #             continue  # Avoid division by zero

# #         # Calculate velocity (distance / time)
# #         velocity = np.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2) / dt
# #         velocities.append(velocity)

# #     velocities = np.array(velocities)

# #     # Normalize values for color mapping
# #     max_velocity = np.max(velocities) if len(velocities) > 0 else 1

# #     # Get the min and max coordinates for zooming
# #     min_x, max_x = min(scanpath[:, 0]) - 20, max(scanpath[:, 0]) + 20
# #     min_y, max_y = min(scanpath[:, 1]) - 20, max(scanpath[:, 1]) + 20

# #     # Generate scanpath visualization with BLACK BACKGROUND
# #     plt.figure(figsize=(10, 7), facecolor='black')

# #     # Get axis
# #     ax = plt.gca()
# #     ax.set_facecolor('black')  # Set background color
# #     ax.set_xticks([])  # Remove x-axis ticks
# #     ax.set_yticks([])  # Remove y-axis ticks
# #     ax.set_xticklabels([])  # Remove x-axis labels
# #     ax.set_yticklabels([])  # Remove y-axis labels
# #     ax.set_frame_on(False)  # Remove border

# #     # Plot gaze path with color-coded velocity
# #     for i in range(1, len(scanpath)):
# #         x1, y1, _ = scanpath[i - 1]
# #         x2, y2, _ = scanpath[i]

# #         # Determine color based on velocity
# #         if i - 1 < len(velocities):
# #             norm_vel = velocities[i - 1] / max_velocity  # Normalize

# #             # Cyan for fixations, Red for saccades, Purple for slow transitions
# #             if norm_vel < 0.2:
# #                 color = (0, 1, 1)  # Cyan for Fixations
# #             elif norm_vel > 0.8:
# #                 color = (1, 0, 0)  # Red for fastest Saccades
# #             else:
# #                 color = (0.5, 0, 0.5)  # Purple for normal tracking

# #         else:
# #             color = (0.5, 0, 0.5)  # Default to purple for static fixations

# #         plt.plot([x1, x2], [y1, y2], color=color, alpha=0.8, linewidth=2)  # Removed markers

# #     # Zoom into the gaze region dynamically
# #     plt.xlim(min_x, max_x)
# #     plt.ylim(min_y, max_y)

# #     plt.title("")  # Remove title

# #     # plt.show()
# #     output_image = f"{session_id}_follow_scanpath_visualization.png"  # or .pdf, .svg
# #     # plt.savefig(output_image, facecolor='black', dpi=300, bbox_inches='tight')
# #     # print(f"Scanpath visualization saved as {output_image}")

# #     plt.savefig(output_image, facecolor='black', dpi=300, bbox_inches='tight')
# #     print(f"Scanpath visualization saved as {output_image}")

# #     # plt.show()
# #     plt.close() 

# #     try:
# #         # model = load_model("models/ftf_model.h5")
# #         model =  load_model('models/ftf_model.h5', compile=False)
# #         print("Model loaded successfully.")
# #         # Load the image in grayscale and resize to 200x200
# #         img = load_img(output_image, color_mode='grayscale', target_size=(200, 200))
# #         img_array = img_to_array(img)

        
# #         # Normalize and reshape to (1, 200, 200, 1)
# #         img_array = img_array / 255.0
# #         img_array = np.expand_dims(img_array, axis=0)
# #         print("Image preprocessed. Shape:", img_array.shape)

# #         print("Image shape before prediction:", img_array.shape)  # Should be (1, 200, 200, 1)
        
# #         prediction = model.predict(img_array)[0][0]  # Get scalar float output

# #         # Interpret prediction
# #         label = "Autistic" if prediction >= 0.5 else "Neurotypical"
# #         confidence = prediction if prediction >= 0.5 else 1 - prediction

# #         # Print diagnosis
# #         print(f"\nPrediction: {label}")
# #         print(f"Confidence: {confidence * 100:.2f}%")
# #         print(f"Raw probability: {prediction:.4f}")

# #     except Exception as e:
# #         # print("Model prediction failed:", e)
# #         import traceback
# #         print("Model prediction failed:")
# #         traceback.print_exc()
# #         prediction = None

# #     try:
# #         payload = {
# #             "sessionID": session_id,
# #             "ftf_output": label if prediction is not None else "Unknown",
# #         }

# #         # Debugging statements
# #         print("\n✅ Payload to be sent to backend:")
# #         print(json.dumps(payload, indent=2))

# #         response = requests.post(API_URL1, json=payload, headers={"Content-Type": "application/json"})

# #         print("📡 Response status code:", response.status_code)
# #         print("📡 Response text:", response.text)

# #         if response.status_code == 200:
# #             print("✅ FTF output saved successfully.")
# #         else:
# #             print("❌ Error from server:", response.status_code, response.text)
# #     except Exception as e:
# #         print("❌ Failed to connect to API:")
# #         import traceback
# #         traceback.print_exc()
# # else:
# #     print("No eye-tracking data collected. Please ensure face detection works.")




import cv2
import dlib
import numpy as np
import matplotlib.pyplot as plt
import time
import sys
import os
import requests
import json

from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import load_img, img_to_array

# API endpoint

API_URL = "https://chavez-ai-screening-and-progress.onrender.com/api/save-follow-data" 
API_URL1 = "https://chavez-ai-screening-and-progress.onrender.com/api/update-ftf-output"

if len(sys.argv) > 1:
    session_id = sys.argv[1]  # Get sessionID from command-line argument
    print(f"Eye tracking started for SessionID: {session_id}")
else:
    print("No SessionID provided!")



# Load Dlib's face detector and landmark predictor
detector = dlib.get_frontal_face_detector()
# predictor = dlib.shape_predictor("C:\Users\Siraj\Documents\GitHub\Chavez-AI-Screening-and-Progress-Tracking-Tool\Chavez-AI-Screening-and-Progress-Tracking-Tool\my-asd-tool\models\shape_predictor_68_face_landmarks.dat")

dat_file = os.path.join("models", "shape_predictor_68_face_landmarks.dat")
predictor = dlib.shape_predictor(dat_file)

# Function to get eye landmarks
def get_eye_landmarks(landmarks, eye_indices):
    return [(landmarks.part(i).x, landmarks.part(i).y) for i in eye_indices]

# Function to get the center of the eye
def get_eye_center(eye_points):
    x = sum([p[0] for p in eye_points]) // len(eye_points)
    y = sum([p[1] for p in eye_points]) // len(eye_points)
    return (x, y)

# Initialize webcam
cap = cv2.VideoCapture(0)

scanpath = []  # Store gaze points with timestamps
# start_time = time.time()
# duration = 60  # Track for 10 seconds

# Define stop signal file
stop_signal_file = f"stop_signal_{session_id}.txt"

try:
    while True:
        ret, frame = cap.read()
        if not ret:
            break

        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = detector(gray)

        for face in faces:
            landmarks = predictor(gray, face)

            # Get left and right eye landmarks
            left_eye = get_eye_landmarks(landmarks, [36, 37, 38, 39, 40, 41])
            right_eye = get_eye_landmarks(landmarks, [42, 43, 44, 45, 46, 47])

            # Compute eye centers
            left_eye_center = get_eye_center(left_eye)
            right_eye_center = get_eye_center(right_eye)

            # Compute average gaze position
            gaze_x = (left_eye_center[0] + right_eye_center[0]) // 2
            gaze_y = (left_eye_center[1] + right_eye_center[1]) // 2

            # Store gaze points with timestamp
            scanpath.append((gaze_x, gaze_y, time.time()))

        # Stop tracking after 10 seconds
        # if time.time() - start_time > duration:
        #     break

        # Check if stop signal file exists
        if os.path.exists(stop_signal_file):
            print("Stop signal received. Exiting eye tracking...")
            break

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

finally:

    cap.release()
    cv2.destroyAllWindows()

    # Cleanup stop signal file after stopping
    if os.path.exists(stop_signal_file):
        os.remove(stop_signal_file)

    print("Eye tracking stopped successfully.")


# Ensure scanpath is not empty before processing
if scanpath:

    # Prepare scanpath data
    scanpath_json = [{"x": int(x), "y": int(y), "timestamp": float(t)} for x, y, t in scanpath]

    # Prepare payload
    payload = {
        "SessionID": session_id,
        "ScanPath": scanpath_json,
        "Timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())  # Optional timestamp
    }

    # Send data to the server
    try:
        response = requests.post(API_URL, json=payload, headers={"Content-Type": "application/json"})
        if response.status_code == 200:
            print("Follow data saved successfully:", response.json())
        else:
            print("Error saving follow data:", response.status_code, response.text)
    except requests.exceptions.RequestException as e:
        print("Failed to connect to server:", e)

    
    scanpath = np.array(scanpath)  # Convert to NumPy array

    # Compute velocity for gaze movements
    velocities = []
    
    for i in range(1, len(scanpath)):
        x1, y1, t1 = scanpath[i - 1]
        x2, y2, t2 = scanpath[i]

        dt = t2 - t1  # Time difference
        if dt == 0:
            continue  # Avoid division by zero

        # Calculate velocity (distance / time)
        velocity = np.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2) / dt
        velocities.append(velocity)

    velocities = np.array(velocities)

    # Normalize values for color mapping
    max_velocity = np.max(velocities) if len(velocities) > 0 else 1

    # Get the min and max coordinates for zooming
    min_x, max_x = min(scanpath[:, 0]) - 20, max(scanpath[:, 0]) + 20
    min_y, max_y = min(scanpath[:, 1]) - 20, max(scanpath[:, 1]) + 20

    # Generate scanpath visualization with BLACK BACKGROUND
    plt.figure(figsize=(10, 7), facecolor='black')

    # Get axis
    ax = plt.gca()
    ax.set_facecolor('black')  # Set background color
    ax.set_xticks([])  # Remove x-axis ticks
    ax.set_yticks([])  # Remove y-axis ticks
    ax.set_xticklabels([])  # Remove x-axis labels
    ax.set_yticklabels([])  # Remove y-axis labels
    ax.set_frame_on(False)  # Remove border

    # Plot gaze path with color-coded velocity
    for i in range(1, len(scanpath)):
        x1, y1, _ = scanpath[i - 1]
        x2, y2, _ = scanpath[i]

        # Determine color based on velocity
        if i - 1 < len(velocities):
            norm_vel = velocities[i - 1] / max_velocity  # Normalize

            # Cyan for fixations, Red for saccades, Purple for slow transitions
            if norm_vel < 0.2:
                color = (0, 1, 1)  # Cyan for Fixations
            elif norm_vel > 0.8:
                color = (1, 0, 0)  # Red for fastest Saccades
            else:
                color = (0.5, 0, 0.5)  # Purple for normal tracking

        else:
            color = (0.5, 0, 0.5)  # Default to purple for static fixations

        plt.plot([x1, x2], [y1, y2], color=color, alpha=0.8, linewidth=2)  # Removed markers

    # Zoom into the gaze region dynamically
    plt.xlim(min_x, max_x)
    plt.ylim(min_y, max_y)

    plt.title("")  # Remove title

    # plt.show()
    output_image = f"{session_id}_follow_scanpath_visualization.png"  # or .pdf, .svg
    # plt.savefig(output_image, facecolor='black', dpi=300, bbox_inches='tight')
    # print(f"Scanpath visualization saved as {output_image}")

    plt.savefig(output_image, facecolor='black', dpi=300, bbox_inches='tight')
    print(f"Scanpath visualization saved as {output_image}")

    # plt.show()
    plt.close() 

    try:
        # model = load_model("models/ftf_model.h5")
        model =  load_model('models/ftf_model.h5', compile=False)
        print("Model loaded successfully.")
        # Load the image in grayscale and resize to 200x200
        img = load_img(output_image, color_mode='grayscale', target_size=(200, 200))
        img_array = img_to_array(img)

        
        # Normalize and reshape to (1, 200, 200, 1)
        img_array = img_array / 255.0
        img_array = np.expand_dims(img_array, axis=0)
        print("Image preprocessed. Shape:", img_array.shape)

        # print("Image shape before prediction:", img_array.shape)  # Should be (1, 200, 200, 1)

        # import tensorflow as tf
        # tf.keras.backend.clear_session()
        
        prediction = model.predict(img_array)[0][0]  # Get scalar float output

        # Interpret prediction
        label = "Autistic" if prediction >= 0.5 else "Neurotypical"
        confidence = prediction if prediction >= 0.5 else 1 - prediction

        # Print diagnosis
        print(f"\nPrediction: {label}")
        print(f"Confidence: {confidence * 100:.2f}%")
        print(f"Raw probability: {prediction:.4f}")

    except Exception as e:
        # print("Model prediction failed:", e)
        import traceback
        print("Model prediction failed:")
        traceback.print_exc()
        prediction = None

    try:
        payload = {
                    "sessionID": session_id,
                    "ftf_output": label if prediction is not None else "Unknown",
                }

        # Debugging statements
        print("\n✅ Payload to be sent to backend:")
        print(json.dumps(payload, indent=2))

        response = requests.post(API_URL1, json=payload, headers={"Content-Type": "application/json"})

        print("📡 Response status code:", response.status_code)
        print("📡 Response text:", response.text)

        if response.status_code == 200:
            print("✅ ftf output saved successfully.")
        else:
            print("❌ Error from server:", response.status_code, response.text)
    except Exception as e:
        print("❌ Failed to connect to API:")
        import traceback
        traceback.print_exc()

else:
    print("No eye-tracking data collected. Please ensure face detection works.")
