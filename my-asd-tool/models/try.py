import cv2
import dlib
import numpy as np
import matplotlib.pyplot as plt
import time
import sys

if len(sys.argv) > 1:
    session_id = sys.argv[1]  # Get sessionID from command-line argument
    print(f"Eye tracking started for SessionID: {session_id}")
else:
    print("No SessionID provided!")

# Load Dlib's face detector and landmark predictor
detector = dlib.get_frontal_face_detector()
predictor = dlib.shape_predictor("/Users/simalanjum/Desktop/Chavez-AI-Screening-and-Progress-Tracking-Tool/my-asd-tool/models/shape_predictor_68_face_landmarks.dat")
# /Users/simalanjum/Desktop/Chavez-AI-Screening-and-Progress-Tracking-Tool/my-asd-tool/models/shape_predictor_68_face_landmarks.dat

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
start_time = time.time()
duration = 60  # Track for 10 seconds

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
    if time.time() - start_time > duration:
        break

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()

# Ensure scanpath is not empty before processing
if scanpath:
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

    plt.show()
    output_image = f"{session_id}_follow_scanpath_visualization.jpg"  # or .pdf, .svg
    plt.savefig(output_image, facecolor='black', dpi=300, bbox_inches='tight')
    print(f"Scanpath visualization saved as {output_image}")

else:
    print("No eye-tracking data collected. Please ensure face detection works.")



