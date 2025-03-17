import express from "express";
import cors from "cors";
import path from "path";
import multer from "multer";
import { exec, spawn } from "child_process";
import { fileURLToPath } from "url"; // <-- Add this line
import { connection } from "./postgres/postgres.js";
import locationRouter from "./view/LocationRouter.js";
import locomotivePilotRouter from "./view/LocomotivePilotRouter.js";
import adminRouter from "./view/AdminRouter.js";
import hazardRouter from "./view/HazardRouter.js";
import locomotivePilotHazardRouter from "./view/LocomotivePilotHazardRouter.js";

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(cors());

// Set up routes from existing routers
app.use("/location", locationRouter);
app.use("/locomotivePilot", locomotivePilotRouter);
app.use("/admin", adminRouter);
app.use("/hazard", hazardRouter);
app.use("/pilotHazard", locomotivePilotHazardRouter);

// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Folder for uploaded videos
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename with extension
  },
});
const upload = multer({ storage: storage });

// Route to start object detection using a Python script
app.get("/start-detection", (req, res) => {
  const pythonScriptPath = path.join(__dirname, "model", "objectdetection.py");
  const videoFilePath = path.join(__dirname, "videos", "cow4.mp4");

  console.log(`Python Script Path: ${pythonScriptPath}`);
  console.log(`Video File Path: ${videoFilePath}`);

  // Set headers for SSE (Server-Sent Events)
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  // Start the Python process to run the detection script
  const pythonProcess = spawn("python", [pythonScriptPath, videoFilePath]);

  // Listen to Python script's stdout and stream it to the frontend
  pythonProcess.stdout.on("data", (data) => {
    console.log(`stdout: ${data.toString()}`);
    res.write(`data: ${data.toString().trim()}\n\n`);
  });

  // Handle error output from Python process
  pythonProcess.stderr.on("data", (data) => {
    console.error(`stderr: ${data.toString()}`);
    res.write(`data: Error: ${data.toString()}\n\n`);
  });

  // Handle process completion
  pythonProcess.on("close", (code) => {
    if (code === 0) {
      console.log("Detection complete");
      res.write(
        "data: Detection complete. If no bull was detected, the route is clear.\n\n"
      );
    } else {
      res.write("data: Error in object detection process.\n\n");
    }
    res.end(); // End the connection when Python process is done
  });

  // Error handling if Python process fails to start
  pythonProcess.on("error", (err) => {
    console.error("Failed to start Python process:", err);
    res.write("data: Failed to start detection process.\n\n");
    res.end();
  });
});

// Route for video upload and processing
app.post("/process-video", upload.single("video"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No video file uploaded.");
  }

  const inputVideoPath = path.join(__dirname, "uploads", req.file.filename);
  const outputVideoPath = path.join(__dirname, "public", "processed_video.avi");

  exec(
    `python3 process_video.py ${inputVideoPath} ${outputVideoPath}`,
    (err, stdout, stderr) => {
      if (err) {
        console.error(`exec error: ${err}`);
        return res.status(500).json({ error: "Error processing video" });
      }
      console.log(stdout);
      console.error(stderr);

      // Send the path to the processed video as the response
      res.json({ status: "success", outputVideoPath: `/processed_video.avi` });
    }
  );
});

// Start the server and establish the database connection
const PORT = process.env.PORT || 8000;
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);

  try {
    await connection(); // Establish database connection
    console.log("Database connected successfully.");
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
});
