import express from "express";
import pkg from "pg"; // Default import
import dotenv from "dotenv";
import cors from "cors"; // Import cors
import nodemailer from 'nodemailer';
import nodemailerMailjetTransport from "nodemailer-mailjet-transport";

dotenv.config();

const { Pool } = pkg;
const app = express();
const port = 5001;

// Enable CORS for frontend to access backend
app.use(cors({
  origin: "http://localhost:3000", // Frontend URL
  methods: ["GET", "POST"],
  credentials: true
}));

// Middleware to parse JSON data from request body 
app.use(express.json());

// Set up PostgreSQL connection
const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
});


app.post("/api/create-account", async (req, res) => {
  const { name, email, userId, password } = req.body;

  // Log the incoming request to check if data is being received
  console.log("Received request to create account:", req.body);

  try {
    // Check if all necessary fields are provided
    if (!name || !email || !userId || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if the email already exists in the database
    const emailCheckQuery = 'SELECT * FROM "User" WHERE "Email" = $1';
    const emailCheckResult = await pool.query(emailCheckQuery, [email]);
    if (emailCheckResult.rows.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Check if the userId already exists in the database
    const userIdCheckQuery = 'SELECT * FROM "User" WHERE "UserID" = $1';
    const userIdCheckResult = await pool.query(userIdCheckQuery, [userId]);
    if (userIdCheckResult.rows.length > 0) {
      return res.status(400).json({ message: "UserID already exists" });
    }

    // Insert new user into the database
    const insertQuery = `
      INSERT INTO "User" ("UserID", "Name", "Email", "Password", "Role")
      VALUES ($1, $2, $3, $4, $5) RETURNING *;
    `;
    const values = [userId, name, email, password, "user"]; // Default role is "user"
    const result = await pool.query(insertQuery, values);

    // Return the created user (excluding password)
    const createdUser = result.rows[0];
    delete createdUser.Password; // Do not send password in response

    // Send response with the newly created user
    res.status(201).json(createdUser);
  } catch (error) {
    console.error("Error inserting user:", error);
    res.status(500).json({ message: "Error creating account" });
  }
});

// Endpoint for login
app.post("/api/login", async (req, res) => {
  const { Email, Password } = req.body;

  try {
    if (!Email || !Password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const query = `SELECT * FROM "User" WHERE "Email" = $1`;
    const result = await pool.query(query, [Email]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = result.rows[0];

    if (user.Password !== Password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    delete user.Password;
    res.status(200).json(user);
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Error during login" });
  }
});

// Endpoint for forgot password
app.post("/api/forgot-password", async (req, res) => {
  const { Email } = req.body;

  try {
    if (!Email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const query = `SELECT * FROM "User" WHERE "Email" = $1`;
    const result = await pool.query(query, [Email]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = result.rows[0];

    // Generate a reset token (for simplicity, we're using a random string here, but ideally use a secure token)
    const resetToken = Math.random().toString(36).substring(2);

    // You should ideally store this token in your database with an expiration time, but for now, we just log it
    console.log("Reset token generated:", resetToken);

    // Send reset email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: Email,
      subject: "Password Reset Request",
      text: `To reset your password, please use the following link: \n\nhttp://localhost:3000/reset-password/${resetToken}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending reset email:", error);
        return res.status(500).json({ message: "Error sending reset email" });
      }
      console.log("Password reset email sent:", info.response);
      res.status(200).json({ message: "Password reset email sent successfully" });
    });

  } catch (error) {
    console.error("Error during forgot password request:", error);
    res.status(500).json({ message: "Error during forgot password request" });
  }
});

// Endpoint for fetch children
app.get("/api/children/:UserID", async (req, res) => {
  const { UserID } = req.params;  // Extract UserID from request parameters

  try {
    // Query to get child profiles for the given UserID
    const query = 'SELECT * FROM "Child" WHERE "UserID" = $1';
    const result = await pool.query(query, [UserID]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No child profiles found" });
    }

    // Send the list of child profiles
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching child profiles:", error);
    res.status(500).json({ message: "Error fetching child profiles" });
  }
});

// Updated endpoint for profile creation
app.post("/api/save-child-profile", async (req, res) => {
  const { ChildID, Name, Gender, Age, UserID, Avatar } = req.body; // Ensure Avatar is included

  try {
    // Check if all necessary fields are provided
    if (!ChildID || !Name || !Gender || !Age || !UserID || Avatar === undefined) {
      return res.status(400).json({ message: "All fields are required, including Avatar" });
    }

    // Insert new child profile into the database
    const insertQuery = `
      INSERT INTO "Child" ("ChildID", "UserID", "Name", "Age", "Gender", "Avatar", "ASDProbability")
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;
    `;
    const values = [ChildID, UserID, Name, Age, Gender, Avatar, null]; // ASDProbability is null for now
    const result = await pool.query(insertQuery, values);

    // Send response with the newly created child profile
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error saving child profile:", error);
    res.status(500).json({ message: "Error saving child profile" });
  }
});



// Utility function to generate unique random IDs
const generateRandomId = () => {
  return Math.floor(Math.random() * 1000000000); // Random 9-digit number
};

// Endpoint to create a new session
app.post("/api/start-session", async (req, res) => {
  const { ChildID } = req.body; // ChildID from the request body

  try {
    // Generate random unique IDs
    const SessionID = generateRandomId();
    const QuestionnaireID = generateRandomId();
    const GameSessionID = generateRandomId();
    const ReportID = generateRandomId();

    // Insert the new session into the database
    const insertQuery = `
      INSERT INTO "Session" ("ChildID", "SessionID", "QuestionnaireID", "GameSessionID", "ReportID")
      VALUES ($1, $2, $3, $4, $5) RETURNING *;
    `;
    const values = [ChildID, SessionID, QuestionnaireID, GameSessionID, ReportID];
    const result = await pool.query(insertQuery, values);

    // Return the new session data
    res.status(201).json({
      session: result.rows[0],
      SessionID,
      QuestionnaireID,
      GameSessionID,
      ReportID,
    });
  } catch (error) {
    console.error("Error creating session:", error);
    res.status(500).json({ message: "Error creating session" });
  }
});

// Endpoint to fetch the most recent session for a given ChildID
app.get("/api/recent-session/:ChildID", async (req, res) => {
  const { ChildID } = req.params;

  try {
    const query = `
      SELECT "SessionID", "QuestionnaireID"
      FROM "Session"
      WHERE "ChildID" = $1
      ORDER BY "SessionID" DESC
      LIMIT 1;
    `;
    const result = await pool.query(query, [ChildID]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No sessions found for this ChildID" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching recent session:", error);
    res.status(500).json({ message: "Error fetching recent session" });
  }
});


// Endpoint to save a question response
app.post("/api/save-question-response", async (req, res) => {
  const { questionID, questionnaireID, question_text, followup_Qs_ans, result, main_qs_ans } = req.body;

  try {
    const insertOrUpdateQuery = `
      INSERT INTO "Question" ("QuestionID", "QuestionnaireID", "Question_Text", "FollowUpQs_Ans", "Result", "MainQs_Ans")
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT ("QuestionID", "QuestionnaireID")
      DO UPDATE SET 
        "Question_Text" = EXCLUDED."Question_Text",
        "FollowUpQs_Ans" = EXCLUDED."FollowUpQs_Ans",
        "Result" = EXCLUDED."Result",
        "MainQs_Ans" = EXCLUDED."MainQs_Ans";
    `;
    const values = [questionID, questionnaireID, question_text, followup_Qs_ans, result, main_qs_ans]; // All values are valid, including booleans
    await pool.query(insertOrUpdateQuery, values);

    res.status(200).json({ message: "Question response saved successfully." });
  } catch (error) {
    console.error("Error saving question response:", error);
    res.status(500).json({ message: "Error saving question response." });
  }
});

// Endpoint to save the final score of the questionnaire
app.post("/api/save-final-score", async (req, res) => {
  const { questionnaireID, sessionID, finalScore } = req.body;

  try {
    // Ensure sessionID is a number and questionnaireID is a string
    if (!questionnaireID || !sessionID || finalScore === undefined) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const Query = `
      INSERT INTO "Questionnaire" ("Session_ID", "Final_Score")
      VALUES ($1, $2)
    `;

    const values = [sessionID, finalScore];
    const result = await pool.query(Query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "cannot insert." });
    }

    res.status(200).json({ message: "Final score saved successfully." });
  } catch (error) {
    console.error("Error saving final score:", error);
    res.status(500).json({ message: "Error saving final score." });
  }
});


app.post("/api/save-game-data", async (req, res) => {
  try {
    const { SessionID, Timestamp, SessionDuration, CorrectTaps, MissedBalloons, IncorrectClicks, TotalTaps } = req.body;

    // Ensure all required fields are present
    if (!SessionID || !Timestamp || SessionDuration == null || CorrectTaps == null || MissedBalloons == null || IncorrectClicks == null || TotalTaps == null) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    console.log("Received SessionID:", SessionID);


    // Query to get ChildID from the Session table
    const childQuery = `SELECT "ChildID" FROM "Session" WHERE "SessionID" = $1`;
    const childResult = await pool.query(childQuery, [SessionID]);

    console.log("Session Query Result:", childResult.rows);

    if (childResult.rows.length === 0) {
      return res.status(404).json({ error: "SessionID not found" });
    }

    const ChildID = childResult.rows[0]["ChildID"]; // ✅ Use correct case

    console.log("Retrieved ChildID:", ChildID);

    // Query to get Age and Gender from the Child table
    console.log("Querying Child table for ChildID:", ChildID);
    const childDetailsQuery = `SELECT "Age", "Gender" FROM "Child" WHERE "ChildID" = $1`;
    const childDetailsResult = await pool.query(childDetailsQuery, [ChildID]);

    console.log("Child Query Result:", childDetailsResult.rows);


    const { Age, Gender } = childDetailsResult.rows[0];

    const level = 1; // Hardcoded level

    // Insert game data into the database
    const query = `
      INSERT INTO balloongame (timestamp, sessionDuration, correcttaps, missedballoons, incorrectclicks, totaltaps, level, "SessionID", "Age", "Gender")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING index
    `;

    const result = await pool.query(query, [Timestamp, SessionDuration, CorrectTaps, MissedBalloons, IncorrectClicks, TotalTaps, level, SessionID, Age, Gender]);

    res.status(200).json({ message: "Game data saved successfully", index: result.rows[0].index });
  } catch (error) {
    console.error("Error saving game data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/get-child-profile", async (req, res) => {
  const { ChildID } = req.query; // Get ChildID from the request query

  try {
    if (!ChildID) {
      return res.status(400).json({ message: "ChildID is required" });
    }

    const query = `SELECT * FROM "Child" WHERE "ChildID" = $1;`;
    const result = await pool.query(query, [ChildID]);

    if (result.rows.length > 0) {
      console.log("Returning Child Profile:", result.rows[0]); // Debugging log
      res.json(result.rows[0]); // Send child profile
    } else {
      console.warn("No child profile found in database!");
      res.status(404).json({ message: "Child profile not found" });
    }
  } catch (error) {
    console.error("Error fetching child profile:", error);
    res.status(500).json({ message: "Server error" });
  }
});



app.post("/api/save-game-data2", async (req, res) => {
  try {
    const { SessionID, Timestamp, SessionDuration, CorrectTaps, MissedBalloons, IncorrectClicks, TotalTaps } = req.body;

    // Ensure all required fields are present
    if (!SessionID || !Timestamp || SessionDuration == null || CorrectTaps == null || MissedBalloons == null || IncorrectClicks == null || TotalTaps == null) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    console.log("Received SessionID:", SessionID);


    // Query to get ChildID from the Session table
    const childQuery = `SELECT "ChildID" FROM "Session" WHERE "SessionID" = $1`;
    const childResult = await pool.query(childQuery, [SessionID]);

    console.log("Session Query Result:", childResult.rows);

    if (childResult.rows.length === 0) {
      return res.status(404).json({ error: "SessionID not found" });
    }

    const ChildID = childResult.rows[0]["ChildID"]; // ✅ Use correct case

    console.log("Retrieved ChildID:", ChildID);

    // Query to get Age and Gender from the Child table
    console.log("Querying Child table for ChildID:", ChildID);
    const childDetailsQuery = `SELECT "Age", "Gender" FROM "Child" WHERE "ChildID" = $1`;
    const childDetailsResult = await pool.query(childDetailsQuery, [ChildID]);

    console.log("Child Query Result:", childDetailsResult.rows);


    const { Age, Gender } = childDetailsResult.rows[0];

    const level = 2; // Hardcoded level

    // Insert game data into the database
    const query = `
      INSERT INTO balloongame (timestamp, sessionDuration, correcttaps, missedballoons, incorrectclicks, totaltaps, level, "SessionID", "Age", "Gender")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING index
    `;

    const result = await pool.query(query, [Timestamp, SessionDuration, CorrectTaps, MissedBalloons, IncorrectClicks, TotalTaps, level, SessionID, Age, Gender]);

    res.status(200).json({ message: "Game data saved successfully", index: result.rows[0].index });
  } catch (error) {
    console.error("Error saving game data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint to receive speech analysis data
app.post("/api/save-audio-data", async (req, res) => {
  try {
    const { SessionID, MFCC_Mean, ResponseLatency, SpeechConfidence, SpeechOnsetDelay, EcholaliaScore, Prediction, Timestamp } = req.body;

    if (!SessionID || !Timestamp) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    console.log("Received audio data for SessionID:", SessionID);

    // Insert into SpeechData table
    const speechDataQuery = `
      INSERT INTO "SpeechData" ("SessionID", "MFCC_Mean", "ResponseLatency", "SpeechConfidence", "SpeechOnsetDelay", "EcholaliaScore", "Timestamp")
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;
    await pool.query(speechDataQuery, [SessionID, MFCC_Mean, ResponseLatency, SpeechConfidence, SpeechOnsetDelay, EcholaliaScore, Timestamp]);

    // Insert into SpeechAnalysis table
    const analysisQuery = `
      INSERT INTO "SpeechAnalysis" ("SessionID", "PredictionLabel", "Timestamp")
      VALUES ($1, $2, $3)
    `;
    await pool.query(analysisQuery, [SessionID, Prediction, Timestamp]);

    res.status(200).json({ message: "Audio data saved successfully" });
  } catch (error) {
    console.error("Error saving audio data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/savePuzzleMetrics", async (req, res) => {
  try {
    const metricsData = req.body.data; // Expecting an array

    if (!Array.isArray(metricsData) || metricsData.length === 0) {
      return res.status(400).json({ message: "Invalid data format" });
    }

    const client = await pool.connect();

    try {
      // Start transaction
      await client.query('BEGIN');

      for (const metric of metricsData) {
        // Convert string timestamp to proper timestamp format
        const timestamp = new Date(metric.timestamp);
        
        // Query to get ChildID from the Session table
        const childQuery = `SELECT "ChildID" FROM "Session" WHERE "SessionID" = $1`;
        const childResult = await client.query(childQuery, [metric.session_id]);

        if (childResult.rows.length === 0) {
          throw new Error(`SessionID ${metric.session_id} not found`);
        }

        const ChildID = childResult.rows[0]["ChildID"];

        // Query to get Age and Gender from the Child table
        const childDetailsQuery = `SELECT "Age", "Gender" FROM "Child" WHERE "ChildID" = $1`;
        const childDetailsResult = await client.query(childDetailsQuery, [ChildID]);

        if (childDetailsResult.rows.length === 0) {
          throw new Error(`ChildID ${ChildID} not found`);
        }

        const { Age, Gender } = childDetailsResult.rows[0];
        const level = 1; // Hardcoded level as in balloon game

        const insertQuery = `
          INSERT INTO public."Puzzle" (
            "timestamp",
            attempt_number,
            correct_emotion,
            selected_emotion,
            reaction_time,
            is_correct,
            cumulative_time,
            "SessionID",
            "Age",
            "Gender",
            level
          ) 
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        `;

        await client.query(insertQuery, [
          timestamp,  // Now passing the converted timestamp
          metric.attempt_number,
          metric.correct_emotion,
          metric.selected_emotion,
          metric.reaction_time,
          metric.is_correct,
          metric.cumulative_time,
          BigInt(metric.session_id), // Ensure bigint conversion
          Age,
          Gender,
          level
        ]);
      }

      // Commit transaction
      await client.query('COMMIT');
      res.status(201).json({ message: "Metrics saved successfully!" });

    } catch (error) {
      // Rollback transaction on error
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

  } catch (error) {
    console.error("Error saving metrics:", error);
    res.status(500).json({ 
      message: "Internal server error", 
      error: error.message 
    });
  }
});


app.post("/api/savePuzzleMetrics2", async (req, res) => {
  try {
    const metricsData = req.body.data; // Expecting an array

    if (!Array.isArray(metricsData) || metricsData.length === 0) {
      return res.status(400).json({ message: "Invalid data format" });
    }

    const client = await pool.connect();

    try {
      // Start transaction
      await client.query('BEGIN');

      for (const metric of metricsData) {
        // Convert string timestamp to proper timestamp format
        const timestamp = new Date(metric.timestamp);
        
        // Query to get ChildID from the Session table
        const childQuery = `SELECT "ChildID" FROM "Session" WHERE "SessionID" = $1`;
        const childResult = await client.query(childQuery, [metric.session_id]);

        if (childResult.rows.length === 0) {
          throw new Error(`SessionID ${metric.session_id} not found`);
        }

        const ChildID = childResult.rows[0]["ChildID"];

        // Query to get Age and Gender from the Child table
        const childDetailsQuery = `SELECT "Age", "Gender" FROM "Child" WHERE "ChildID" = $1`;
        const childDetailsResult = await client.query(childDetailsQuery, [ChildID]);

        if (childDetailsResult.rows.length === 0) {
          throw new Error(`ChildID ${ChildID} not found`);
        }

        const { Age, Gender } = childDetailsResult.rows[0];
        const level = 2; // Hardcoded level as in balloon game

        const insertQuery = `
          INSERT INTO public."Puzzle" (
            "timestamp",
            attempt_number,
            correct_emotion,
            selected_emotion,
            reaction_time,
            is_correct,
            cumulative_time,
            "SessionID",
            "Age",
            "Gender",
            level
          ) 
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        `;

        await client.query(insertQuery, [
          timestamp,  // Now passing the converted timestamp
          metric.attempt_number,
          metric.correct_emotion,
          metric.selected_emotion,
          metric.reaction_time,
          metric.is_correct,
          metric.cumulative_time,
          BigInt(metric.session_id), // Ensure bigint conversion
          Age,
          Gender,
          level
        ]);
      }

      // Commit transaction
      await client.query('COMMIT');
      res.status(201).json({ message: "Metrics saved successfully!" });

    } catch (error) {
      // Rollback transaction on error
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

  } catch (error) {
    console.error("Error saving metrics:", error);
    res.status(500).json({ 
      message: "Internal server error", 
      error: error.message 
    });
  }
});

// app.get("/api/allSessions/:ChildID", async (req, res) => {
//   const { ChildID } = req.params;

//   try {
//     // Query to fetch all SessionIDs for the given ChildID
//     const query = `SELECT "SessionID" FROM "Session" WHERE "ChildID" = $1 ORDER BY "SessionID" DESC`;
//     const result = await pool.query(query, [ChildID]);

//     if (result.rows.length === 0) {
//       // return res.status(404).json({ message: "No sessions found for this ChildID" });
      
//       return res.status(200).json({ sessions: [] });
      
//     }

//     // Extract session IDs into an array
//     const sessionIDs = result.rows.map(row => row.SessionID);

//     res.status(200).json({ sessions: sessionIDs });
//   } catch (error) {
//     console.error("Error fetching sessions:", error);
//     res.status(500).json({ message: "Error fetching sessions" });
//   }
// });

// Get Questionnaire Data
app.get("/api/questionnaire", async (req, res) => {
  const { sessionId } = req.query;
  try {
    const result = await pool.query(
      'SELECT * FROM "Questionnaire" WHERE "Session_ID" = $1',
      [sessionId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Get Speech Analysis Data
app.get("/api/speech-analysis", async (req, res) => {
  const { sessionId } = req.query;
  try {
    const result = await pool.query(
      'SELECT * FROM "SpeechAnalysis" WHERE "SessionID" = $1',
      [sessionId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Get Balloon Game Data
app.get("/api/balloon-game", async (req, res) => {
  const { sessionId } = req.query;
  try {
    const result = await pool.query(
      'SELECT * FROM balloongame WHERE "SessionID" = $1',
      [sessionId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Get Emotion Puzzle Data
app.get("/api/emotion-puzzle", async (req, res) => {
  const { sessionId } = req.query;
  try {
    const result = await pool.query(
      'SELECT * FROM "Puzzle" WHERE "SessionID" = $1',
      [sessionId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});