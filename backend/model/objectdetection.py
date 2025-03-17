import cv2
from ultralytics import YOLO
import time
import sys

# Get the path to the video file passed as a command-line argument
if len(sys.argv) != 2:
    print("Usage: python objectdetection.py <video_file>")
    sys.exit(1)

video_path = sys.argv[1]

# Set the correct model path relative to the current working directory
model_path = 'model/best7.pt'  # Ensure this is correct
print("Model path:", model_path)

# Load YOLOv8 model
model = YOLO(model_path)

# Load video
cap = cv2.VideoCapture(1)

# Check if video opened successfully
if not cap.isOpened():
    print("Error: Could not open video.")
    sys.exit(1)

bull_detected = False
start_time = time.time()

# Process video frame by frame
while True:
    ret, frame = cap.read()
    if not ret:
        break

    # Detect and track objects
    results = model(frame)  # You can switch to model.track() if you want to use tracking

    # Loop over the detected boxes
    for result in results:
        for obj in result.boxes:
            class_index = int(obj.cls.item())  # Convert tensor to integer
            if model.names[class_index] == 'bull':  # Check if 'bull' is detected
                bull_detected = True
                break
        if bull_detected:
            break

    # Check if 3 seconds have passed, then print detection result
    if time.time() - start_time >= 1:
        if bull_detected:
            print("Bull detected")
        else:
            print("No bull detected")

        # Reset the detection status and start the next 3-second interval
        bull_detected = False
        start_time = time.time()  # Reset the timer for the next interval

cap.release()
cv2.destroyAllWindows()
