import express from "express";
import pkg from "pg"; // Default import
import dotenv from "dotenv";
import cors from "cors"; // Import cors
import nodemailer from 'nodemailer';
// import fetch from 'node-fetch';
import crypto from 'crypto';

import sgMail from '@sendgrid/mail';

dotenv.config();

const { Pool } = pkg;
const app = express();
const port = 5001;

app.use(express.json({ limit: '10mb' }));   // 🔥 increase limit
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const allowedOrigins = [
  'https://chavez-ai-screening-and-progress-tracking-tool.vercel.app',
  'http://localhost:3000', 
  'https://balloon-game-9r5d.onrender.com',
  'https://puzzle-game-zscm.onrender.com',
  'https://fish-game-5szp.onrender.com',
  'https://hvo-game.onrender.com',
  'https://pythonserver-models-i4h5.onrender.com',
  'http://localhost:8000'
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS'],
    credentials: true, // if you're using cookies/auth
  })
);
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
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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


// Route to request password reset
app.post('/api/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const userResult = await pool.query(`SELECT * FROM "User" WHERE "Email" = $1`, [email]);
    if (userResult.rowCount === 0) {
      return res.status(404).json({ message: "Email not found" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetURL = `https://chavez-ai-screening-and-progress-tracking-tool.vercel.app/reset-password?token=${resetToken}`;
    // const resetURL = `http://localhost:3000/reset-password?token=${resetToken}`;

    // const expires = new Date(Date.now() + 3600000); // 1 hour
    const expires = new Date(Date.now() + 3600000).toISOString();

    // Store token in DB
    await pool.query(`
      UPDATE "User" SET "ResetToken" = $1, "ResetTokenExpiry" = $2 WHERE "Email" = $3
    `, [resetToken, expires, email]);

    await sendResetEmail(email, resetURL);
    res.json({ message: "Reset link sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

async function sendResetEmail(toEmail, resetLink) {
  const msg = {
    to: toEmail,
    from: process.env.FROM_EMAIL, // must be a verified sender
    subject: 'Chavez Password Reset Link',
    text: `Click the link to reset your password: ${resetLink}`,
    html: `<p>You requested a password reset for your account on Chavez.</p><p><a href="${resetLink}">Click here to reset your password</a></p>`,
  };

  try {
    await sgMail.send(msg);
    console.log('Reset email sent');
  } catch (error) {
    console.error('SendGrid error:', error);
    if (error.response) {
      console.error(error.response.body);
    }
    throw error;
  }
}


app.post('/api/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    // Get user with matching valid token
    const userResult = await pool.query(`
      SELECT * FROM "User" 
      WHERE "ResetToken" = $1 AND "ResetTokenExpiry" > NOW()
    `, [token]);

    if (userResult.rowCount === 0) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // const hashedPassword = await bcrypt.hash(newPassword, 10);
    const hashedPassword = newPassword;
    const email = userResult.rows[0].email;

    // Update password and clear the token
    await pool.query(`
      UPDATE "User"  
      SET "Password" = $1, "ResetToken" = NULL, "ResetTokenExpiry" = NULL 
      WHERE "Email" = $2
    `, [hashedPassword, email]);

    res.json({ message: 'Password has been reset successfully' });
  } catch (err) {
    console.error('Reset error:', err);
    res.status(500).json({ message: 'Server error' });
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
    // const QuestionnaireID = generateRandomId();
    // const GameSessionID = generateRandomId();
    // const ReportID = generateRandomId();

    // Insert the new session into the database
    // const insertQuery = `
    //   INSERT INTO "Session" ("ChildID", "SessionID", "QuestionnaireID", "GameSessionID", "ReportID")
    //   VALUES ($1, $2, $3, $4, $5) RETURNING *;
    // `;

    const insertQuery = `
    INSERT INTO "Session" ("ChildID", "SessionID")
    VALUES ($1, $2) RETURNING *;
  `;

    // const values = [ChildID, SessionID, QuestionnaireID, GameSessionID, ReportID];
    const values = [ChildID, SessionID];
    const result = await pool.query(insertQuery, values);

    // Return the new session data
    // res.status(201).json({
    //   session: result.rows[0],
    //   SessionID,
    //   QuestionnaireID,
    //   GameSessionID,
    //   ReportID,
    // });
    res.status(201).json({
      session: result.rows[0],
      SessionID,
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



app.post("/api/save-question-response", async (req, res) => {
  const { questionID, sessionID, question_text, followup_Qs_ans, result, main_qs_ans } = req.body;

  try {
    const insertOrUpdateQuery = `
      INSERT INTO "Question" ("QuestionID", "Question_Text", "FollowUpQs_Ans", "Result", "MainQs_Ans", "SessionID")
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT ("QuestionID", "SessionID")
      DO UPDATE SET 
        "Question_Text" = EXCLUDED."Question_Text",
        "FollowUpQs_Ans" = EXCLUDED."FollowUpQs_Ans",
        "Result" = EXCLUDED."Result",
        "MainQs_Ans" = EXCLUDED."MainQs_Ans";
    `;

    const values = [questionID, question_text, followup_Qs_ans, result, main_qs_ans, sessionID];  
    await pool.query(insertOrUpdateQuery, values);

    res.status(200).json({ message: "Question response saved successfully." });
  } catch (error) {
    console.error("Error saving question response:", error);
    res.status(500).json({ message: "Error saving question response." });
  }
});


// Endpoint to save the final score of the questionnaire
app.post("/api/save-final-score", async (req, res) => {
  const {sessionID, finalScore } = req.body;

  try {
    // Ensure sessionID is a number and questionnaireID is a string
    if (!sessionID || finalScore === undefined) {
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

    const updateSessionQuery = `
      UPDATE "Session"
      SET "audio_output" = $1
      WHERE "SessionID" = $2
    `;
    await pool.query(updateSessionQuery, [Prediction, SessionID]);


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
      'SELECT * FROM "SpeechData" WHERE "SessionID" = $1',
      [sessionId]
    );
    res.json(result.rows);
    console.log(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.post("/api/balloon-game", async (req, res) => {
  const { sessionID } = req.body;
  try {
    const result = await pool.query(
      'SELECT * FROM balloongame WHERE "SessionID" = $1',
      [sessionID]
    );
    res.json(result.rows);
    console.log(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});


// app.post("/api/emotion-puzzle", async (req, res) => {
//   const sessionID = parseInt(req.body.sessionID);

//   if (!sessionID || isNaN(sessionID)) {
//     return res.status(400).send("Invalid session ID");
//   }

//   try {
//     const result = await pool.query(
//       'SELECT * FROM "Puzzle" WHERE "SessionID" = $1',
//       [sessionID]
//     );

//     const data = result.rows;

//     if (data.length === 0) return res.status(404).send("No puzzle data found");

//     const reactionTimes = data.map(r => r.reaction_time);
//     const correctTotal = data.filter(r => r.is_correct === true || r.is_correct === "TRUE").length;

//     const average = arr => arr.reduce((a, b) => a + b, 0) / arr.length;
//     const median = arr => {
//       const sorted = [...arr].sort((a, b) => a - b);
//       const mid = Math.floor(sorted.length / 2);
//       return sorted.length % 2 === 0
//         ? (sorted[mid - 1] + sorted[mid]) / 2
//         : sorted[mid];
//     };

//     const summary = {
//       SessionID: sessionID,
//       Age: parseInt(data[0].Age),
//       Gender: data[0].Gender,
//       reaction_mean: parseFloat(average(reactionTimes).toFixed(2)),
//       reaction_median: parseFloat(median(reactionTimes).toFixed(2)),
//       reaction_min: Math.min(...reactionTimes),
//       reaction_max: Math.max(...reactionTimes),
//       correct_total: correctTotal,
//       attempts_total: data.length
//     };

//     res.json(summary);
//     console.log("Puzzle summary:", summary);
//   } catch (err) {
//     console.error("❌ Puzzle summary error:", err);
//     res.status(500).send("Server error");
//   }
// });

app.post("/api/emotion-puzzle1", async (req, res) => {
  const sessionID = parseInt(req.body.sessionID);

  if (!sessionID || isNaN(sessionID)) {
    return res.status(400).send("Invalid session ID");
  }

  try {
    const result = await pool.query(
      'SELECT * FROM "Puzzle" WHERE "SessionID" = $1',
      [sessionID]
    );

    const data = result.rows;

    if (data.length === 0) return res.status(404).send("No puzzle data found");

    const reactionTimes = data.map(r => r.reaction_time);
    const correctTotal = data.filter(r => r.is_correct === true || r.is_correct === "TRUE").length;

    const average = arr => arr.reduce((a, b) => a + b, 0) / arr.length;
    const median = arr => {
      const sorted = [...arr].sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      return sorted.length % 2 === 0
        ? (sorted[mid - 1] + sorted[mid]) / 2
        : sorted[mid];
    };

    const summary = {
      SessionID: sessionID,
      Age: parseInt(data[0].Age),
      Gender: data[0].Gender,
      reaction_mean: parseFloat(average(reactionTimes).toFixed(2)),
      reaction_median: parseFloat(median(reactionTimes).toFixed(2)),
      reaction_min: Math.min(...reactionTimes),
      reaction_max: Math.max(...reactionTimes),
      correct_total: correctTotal,
      attempts_total: data.length
    };

    res.json(summary);
    console.log("Puzzle summary:", summary);
  } catch (err) {
    console.error("❌ Puzzle summary error:", err);
    res.status(500).send("Server error");
  }
});

app.post("/api/emotion-puzzle", async (req, res) => {
  const { sessionID } = req.body; // ✅ Correct for POST
  try {
    const result = await pool.query(
      'SELECT * FROM "Puzzle" WHERE "SessionID" = $1',
      [sessionID]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.post("/api/save-human-data", async (req, res) => {
  try {
    const { SessionID, ScanPath, Timestamp } = req.body;

    // Validate input
    if (!SessionID || !ScanPath || !Array.isArray(ScanPath)) {
      return res.status(400).json({ error: "Missing required fields or invalid ScanPath format" });
    }

    console.log("Received SessionID:", SessionID);

    // Get ChildID from Session table
    const childQuery = `SELECT "ChildID" FROM "Session" WHERE "SessionID" = $1`;
    const childResult = await pool.query(childQuery, [SessionID]);

    console.log("Session Query Result:", childResult.rows);

    if (childResult.rows.length === 0) {
      return res.status(404).json({ error: "SessionID not found" });
    }

    const ChildID = childResult.rows[0]["ChildID"];

    console.log("Retrieved ChildID:", ChildID);

    // Get Age and Gender from Child table
    console.log("Querying Child table for ChildID:", ChildID);
    const childDetailsQuery = `SELECT "Age", "Gender" FROM "Child" WHERE "ChildID" = $1`;
    const childDetailsResult = await pool.query(childDetailsQuery, [ChildID]);

    console.log("Child Query Result:", childDetailsResult.rows);

    if (childDetailsResult.rows.length === 0) {
      return res.status(404).json({ error: "ChildID not found" });
    }

    const { Age, Gender } = childDetailsResult.rows[0];

    // Insert follow data into FollowData table
    const query = `
      INSERT INTO "HumanData" ("SessionID", "ScanPath", "Gender", "Age", "Timestamp")
      VALUES ($1, $2, $3, $4, COALESCE($5, NOW()))
      RETURNING "ID"
    `;

    const result = await pool.query(query, [SessionID, JSON.stringify(ScanPath), Gender, Age, Timestamp || null]);

    res.status(200).json({ message: "Human data saved successfully", id: result.rows[0].id });

  } catch (error) {
    console.error("Error saving follow data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.post("/api/save-follow-data", async (req, res) => {
  try {
    const { SessionID, ScanPath, Timestamp } = req.body;

    // Validate input
    if (!SessionID || !ScanPath || !Array.isArray(ScanPath)) {
      return res.status(400).json({ error: "Missing required fields or invalid ScanPath format" });
    }

    console.log("Received SessionID:", SessionID);

    // Get ChildID from Session table
    const childQuery = `SELECT "ChildID" FROM "Session" WHERE "SessionID" = $1`;
    const childResult = await pool.query(childQuery, [SessionID]);

    console.log("Session Query Result:", childResult.rows);

    if (childResult.rows.length === 0) {
      return res.status(404).json({ error: "SessionID not found" });
    }

    const ChildID = childResult.rows[0]["ChildID"];

    console.log("Retrieved ChildID:", ChildID);

    // Get Age and Gender from Child table
    console.log("Querying Child table for ChildID:", ChildID);
    const childDetailsQuery = `SELECT "Age", "Gender" FROM "Child" WHERE "ChildID" = $1`;
    const childDetailsResult = await pool.query(childDetailsQuery, [ChildID]);

    console.log("Child Query Result:", childDetailsResult.rows);

    if (childDetailsResult.rows.length === 0) {
      return res.status(404).json({ error: "ChildID not found" });
    }

    const { Age, Gender } = childDetailsResult.rows[0];

    // Insert follow data into FollowData table
    const query = `
      INSERT INTO "FollowData" ("SessionID", "ScanPath", "Gender", "Age", "Timestamp")
      VALUES ($1, $2, $3, $4, COALESCE($5, NOW()))
      RETURNING "ID"
    `;

    const result = await pool.query(query, [SessionID, JSON.stringify(ScanPath), Gender, Age, Timestamp || null]);

    res.status(200).json({ message: "Follow data saved successfully", id: result.rows[0].id });

  } catch (error) {
    console.error("Error saving follow data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});



// sameen end points
////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////

// Get Follow the Fish Data
app.get("/api/follow-data", async (req, res) => {
  let { sessionId } = req.query;

  try {
    if (!sessionId) {
      return res.status(400).json({ error: "SessionID is required" });
    }

    // Convert sessionId to an integer
    sessionId = parseInt(sessionId, 10);
    if (isNaN(sessionId)) {
      return res.status(400).json({ error: "Invalid SessionID format" });
    }

    console.log("Fetching Follow Data for SessionID:", sessionId);

    const result = await pool.query(
      'SELECT * FROM "FollowData" WHERE "SessionID" = $1',
      [sessionId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No follow data found for this session." });
    }

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching Follow the Fish data:", error);
    res.status(500).json({ error: "Server error" });
  }
});


// Get Human vs Object Data
app.get("/api/human-vs-object", async (req, res) => {
  const { sessionId } = req.query;

  try {
    const result = await pool.query(
      'SELECT * FROM "HumanData" WHERE "SessionID" = $1',
      [sessionId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No data found for Human vs Object." });
    }

    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching Human vs Object data:", err);
    res.status(500).send("Server error");
  }
});

app.get("/api/progress/:SessionID", async (req, res) => {
  const { SessionID } = req.params;

  try {
    // Check if the session exists
    const sessionCheckQuery = `SELECT * FROM "Session" WHERE "SessionID" = $1`;
    const sessionCheckResult = await pool.query(sessionCheckQuery, [SessionID]);

    if (sessionCheckResult.rows.length === 0) {
      return res.status(404).json({ message: "Session not found." });
    }

    // Get the number of answered questions
    const questionnaireQuery = `SELECT COUNT(*) AS answered FROM "Question" WHERE "QuestionnaireID" = (SELECT "QuestionnaireID" FROM "Session" WHERE "SessionID" = $1)`;
    const questionnaireResult = await pool.query(questionnaireQuery, [SessionID]);
    const questionsAnswered = parseInt(questionnaireResult.rows[0].answered) || 0;

    // Fetch game completion statuses
    const balloonGameQuery = `SELECT COUNT(*) AS completed FROM balloongame WHERE "SessionID" = $1`;
    const balloonGameResult = await pool.query(balloonGameQuery, [SessionID]);

    const followGameQuery = `SELECT COUNT(*) AS completed FROM "FollowData" WHERE "SessionID" = $1`;
    const followGameResult = await pool.query(followGameQuery, [SessionID]);

    const humanGameQuery = `SELECT COUNT(*) AS completed FROM "HumanData" WHERE "SessionID" = $1`;
    const humanGameResult = await pool.query(humanGameQuery, [SessionID]);

    const puzzleGameQuery = `SELECT COUNT(*) AS completed FROM "Puzzle" WHERE "SessionID" = $1`;
    const puzzleGameResult = await pool.query(puzzleGameQuery, [SessionID]);

    const speechQuery = `SELECT COUNT(*) AS completed FROM "SpeechAnalysis" WHERE "SessionID" = $1`;
    const speechResult = await pool.query(speechQuery, [SessionID]);

    // Check completion statuses
    const questionnaireCompleted = questionsAnswered >= 20;
    const balloonCompleted = parseInt(balloonGameResult.rows[0].completed) > 0;
    const followCompleted = parseInt(followGameResult.rows[0].completed) > 0;
    const humanCompleted = parseInt(humanGameResult.rows[0].completed) > 0;
    const puzzleCompleted = parseInt(puzzleGameResult.rows[0].completed) > 0;
    const speechCompleted = parseInt(speechResult.rows[0].completed) > 0;
    
    const gamesCompleted = balloonCompleted && followCompleted && humanCompleted && puzzleCompleted;
    const isSessionComplete = questionnaireCompleted && gamesCompleted && speechCompleted;

    res.status(200).json({
      sessionId: SessionID,
      questionnaireCompleted,
      questionsAnswered,  // ✅ This will now be returned in API response
      games: {
        balloonGame: balloonCompleted,
        followTheFish: followCompleted,
        humanVsObject: humanCompleted,
        emotionPuzzle: puzzleCompleted,
      },
      speechCompleted,
      isSessionComplete,
    });

  } catch (error) {
    console.error("Error fetching progress:", error);
    res.status(500).json({ message: "Server error while fetching progress." });
  }
});


app.get("/api/get-session/:ChildID", async (req, res) => {
  const { ChildID } = req.params;
  
  try {
    // const query = `
    //   SELECT "SessionID", "QuestionnaireID", "GameSessionID", "ReportID" 
    //   FROM "Session" 
    //   WHERE "ChildID" = $1 
    //   ORDER BY "SessionID" DESC 
    //   LIMIT 1;
    // `;
    const query = `
      SELECT "SessionID"
      FROM "Session" 
      WHERE "ChildID" = $1 
      ORDER BY "SessionID" DESC 
      LIMIT 1;
    `;
    const result = await pool.query(query, [ChildID]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No active session found for this ChildID" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching session:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// sameen coded seesion 4-3-25 = all sessionid against a child
// ✅ **Endpoint: Fetch All Sessions for a Child**
app.get("/api/allSessions/:ChildID", async (req, res) => {
  const { ChildID } = req.params;

  try {
    // const query = `
    //   SELECT "SessionID", "QuestionnaireID", "GameSessionID", "ReportID" 
    //   FROM "Session" 
    //   WHERE "ChildID" = $1 
    //   ORDER BY "SessionID" DESC;
    // `;

    const query = `
      SELECT "SessionID"
      FROM "Session" 
      WHERE "ChildID" = $1 
      ORDER BY "SessionID" DESC;
    `;
    const result = await pool.query(query, [ChildID]);

    if (result.rows.length === 0) {
      return res.status(200).json({ sessions: [] });
    }

    res.status(200).json({ sessions: result.rows });
  } catch (error) {
    console.error("Error fetching sessions:", error);
    res.status(500).json({ message: "Error fetching sessions" });
  }
});

app.get("/api/get-session-status-by-id/:sessionId", async (req, res) => {
  const { sessionId } = req.params;

  try {
    const result = await pool.query(
      `SELECT 
        "SessionID", 
        "FishStatus", 
        "HumanObjStatus", 
        "EmotionStatus", 
        "SpeechStatus", 
        "BalloonStatus", 
        "QuesStatus"
      FROM "Session"
      WHERE "SessionID" = $1`,
      [sessionId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Session not found." });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching session status by ID:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

app.post("/api/mark-speech-status-true/:sessionId", async (req, res) => {
  const { sessionId } = req.params;

  try {
    const result = await pool.query(
      `UPDATE "Session"
       SET "SpeechStatus" = true
       WHERE "SessionID" = $1
       RETURNING *`,
      [sessionId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Session not found." });
    }

    res.json({ message: "SpeechStatus marked as true.", session: result.rows[0] });
  } catch (error) {
    console.error("Error updating SpeechStatus:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

app.post("/api/mark-ques-status-true/:sessionId", async (req, res) => {
  const { sessionId } = req.params;

  try {
    const result = await pool.query(
      `UPDATE "Session"
       SET "QuesStatus" = true
       WHERE "SessionID" = $1
       RETURNING *`,
      [sessionId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Session not found." });
    }

    res.json({ message: "QuesStatus marked as true.", session: result.rows[0] });
  } catch (error) {
    console.error("Error updating QuesStatus:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

app.post("/api/mark-balloon-status-true/:sessionId", async (req, res) => {
  const { sessionId } = req.params;

  try {
    const result = await pool.query(
      `UPDATE "Session"
       SET "BalloonStatus" = true
       WHERE "SessionID" = $1
       RETURNING *`,
      [sessionId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Session not found." });
    }

    res.json({ message: "BalloonStatus marked as true.", session: result.rows[0] });
  } catch (error) {
    console.error("Error updating BalloonStatus:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

app.post("/api/mark-emotion-status-true/:sessionId", async (req, res) => {
  const { sessionId } = req.params;

  try {
    const result = await pool.query(
      `UPDATE "Session"
       SET "EmotionStatus" = true
       WHERE "SessionID" = $1
       RETURNING *`,
      [sessionId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Session not found." });
    }

    res.json({ message: "EmotionStatus marked as true.", session: result.rows[0] });
  } catch (error) {
    console.error("Error updating EmotionStatus:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

app.post("/api/mark-humanobj-status-true/:sessionId", async (req, res) => {
  const { sessionId } = req.params;

  try {
    const result = await pool.query(
      `UPDATE "Session"
       SET "HumanObjStatus" = true
       WHERE "SessionID" = $1
       RETURNING *`,
      [sessionId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Session not found." });
    }

    res.json({ message: "HumanObjStatus marked as true.", session: result.rows[0] });
  } catch (error) {
    console.error("Error updating HumanObjStatus:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

app.post("/api/mark-fish-status-true/:sessionId", async (req, res) => {
  const { sessionId } = req.params;

  try {
    const result = await pool.query(
      `UPDATE "Session"
       SET "FishStatus" = true
       WHERE "SessionID" = $1
       RETURNING *`,
      [sessionId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Session not found." });
    }

    res.json({ message: "FishStatus marked as true.", session: result.rows[0] });
  } catch (error) {
    console.error("Error updating FishStatus:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

app.post("/api/update-balloon-emotion-output", async (req, res) => {
  const { sessionID, balloonemotion_output } = req.body;

  if (!sessionID || !balloonemotion_output) {
    return res.status(400).send("Missing sessionID or balloonemotion_output");
  }

  try {
    const result = await pool.query(
      'UPDATE "Session" SET "balloonemotion_output" = $1 WHERE "SessionID" = $2',
      [balloonemotion_output, sessionID]
    );

    if (result.rowCount === 0) {
      return res.status(404).send("Session not found");
    }

    res.status(200).send("Balloon emotion output updated successfully");
  } catch (err) {
    console.error("❌ Error updating balloonemotion_output:", err);
    res.status(500).send("Server error");
  }
});

// ✅ New API route to update FTF Output
app.post("/api/update-ftf-output", async (req, res) => {
  const { sessionID, ftf_output } = req.body;

  if (!sessionID || !ftf_output) {
    return res.status(400).send("Missing sessionID or ftf_output");
  }

  try {
    const result = await pool.query(
      'UPDATE "Session" SET "ftf_output" = $1 WHERE "SessionID" = $2',
      [ftf_output, sessionID]
    );

    if (result.rowCount === 0) {
      return res.status(404).send("Session not found");
    }

    res.status(200).send("FTF output updated successfully");
  } catch (err) {
    console.error("❌ Error updating ftf_output:", err);
    res.status(500).send("Server error");
  }
});

app.post("/api/update-hvo-output", async (req, res) => {
  const { sessionID, hvo_output } = req.body;

  if (!sessionID || !hvo_output) {
    return res.status(400).send("Missing sessionID or hvo_output");
  }

  try {
    const result = await pool.query(
      'UPDATE "Session" SET "hvo_output" = $1 WHERE "SessionID" = $2',
      [hvo_output, sessionID]
    );

    if (result.rowCount === 0) {
      return res.status(404).send("Session not found");
    }

    res.status(200).send("HVO output updated successfully");
  } catch (err) {
    console.error("❌ Error updating hvo_output:", err);
    res.status(500).send("Server error");
  }
});

app.get("/api/session-output/:sessionId", async (req, res) => {
  const sessionId = req.params.sessionId;

  try {
    const result = await pool.query(
      `SELECT ftf_output, hvo_output, balloonemotion_output, audio_output FROM "Session" WHERE "SessionID" = $1`,
      [sessionId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Session not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching session outputs:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.post('/api/mark-complete', async (req, res) => {
  const { sessionId } = req.body;

  try {
    const result = await pool.query(
      `SELECT "CompleteDate" FROM "Session" WHERE "SessionID" = $1`,
      [sessionId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Session not found' });
    }

    if (result.rows[0].CompleteDate) {
      return res.status(200).json({ message: 'Session already marked complete' });
    }

    await pool.query(
      `UPDATE "Session" SET "CompleteDate" = NOW() WHERE "SessionID" = $1`,
      [sessionId]
    );

    res.status(200).json({ message: 'Session marked complete' });
  } catch (err) {
    console.error('Error marking session complete:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get("/api/allSessionsDate/:ChildID", async (req, res) => {
  const { ChildID } = req.params;

  try {
    const query = `
      SELECT "SessionID", "CompleteDate"
      FROM "Session" 
      WHERE "ChildID" = $1 
      ORDER BY "CompleteDate" DESC NULLS LAST;
    `;
    const result = await pool.query(query, [ChildID]);

    res.status(200).json({ sessions: result.rows });
  } catch (error) {
    console.error("Error fetching sessions:", error);
    res.status(500).json({ message: "Error fetching sessions" });
  }
});

app.get("/api/get-child-id-by-session/:sessionId", async (req, res) => {
  const { sessionId } = req.params;

  try {
    const result = await pool.query(
      `SELECT "ChildID" FROM "Session" WHERE "SessionID" = $1`,
      [sessionId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Session not found" });
    }

    res.json({ ChildID: result.rows[0].ChildID });
  } catch (error) {
    console.error("Error fetching ChildID by SessionID:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/completedSessionsCount/:ChildID", async (req, res) => {
  const { ChildID } = req.params;

  try {
    const query = `
      SELECT COUNT(*) AS completed_count
      FROM "Session"
      WHERE "ChildID" = $1 AND "CompleteDate" IS NOT NULL;
    `;
    const result = await pool.query(query, [ChildID]);

    res.status(200).json({ count: parseInt(result.rows[0].completed_count, 10) });
  } catch (error) {
    console.error("Error fetching completed session count:", error);
    res.status(500).json({ message: "Error fetching completed session count" });
  }
});


app.delete('/api/delete-user/:userId', async (req, res) => {
  const { userId } = req.params;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const childResult = await client.query(
      `SELECT "ChildID" FROM "Child" WHERE "UserID" = $1`,
      [userId]
    );

    const childIDs = childResult.rows.map(row => row.ChildID);

    for (const childID of childIDs) {
      const sessionResult = await client.query(
        `SELECT "SessionID" FROM "Session" WHERE "ChildID" = $1`,
        [childID]
      );
      const sessionIDs = sessionResult.rows.map(row => row.SessionID);

      for (const sessionID of sessionIDs) {
        await client.query(`DELETE FROM "Question" WHERE "SessionID" = $1`, [sessionID]);
        await client.query(`DELETE FROM "SpeechData" WHERE "SessionID" = $1`, [sessionID]);
        await client.query(`DELETE FROM "SpeechAnalysis" WHERE "SessionID" = $1`, [sessionID]);
        await client.query(`DELETE FROM "Questionnaire" WHERE "Session_ID" = $1`, [sessionID]);
        await client.query(`DELETE FROM "Puzzle" WHERE "SessionID" = $1`, [sessionID]);
        await client.query(`DELETE FROM balloongame WHERE "SessionID" = $1`, [sessionID]);
        await client.query(`DELETE FROM "FollowData" WHERE "SessionID" = $1`, [sessionID]);
        await client.query(`DELETE FROM "HumanData" WHERE "SessionID" = $1`, [sessionID]);
        await client.query(`DELETE FROM "Session" WHERE "SessionID" = $1`, [sessionID]);
      }

      await client.query(`DELETE FROM "Child" WHERE "ChildID" = $1`, [childID]);
    }

    await client.query(`DELETE FROM "User" WHERE "UserID" = $1`, [userId]);

    await client.query('COMMIT');
    res.sendStatus(200);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error("❌ Error deleting user data:", err);
    res.status(500).send("Failed to delete user");
  } finally {
    client.release();
  }
});

app.delete('/api/delete-child/:childId', async (req, res) => {
  const { childId } = req.params;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Fetch all sessions for this child
    const sessionResult = await client.query(
      `SELECT "SessionID" FROM "Session" WHERE "ChildID" = $1`,
      [childId]
    );

    const sessionIDs = sessionResult.rows.map(row => row.SessionID);

    for (const sessionID of sessionIDs) {
      await client.query(`DELETE FROM "Question" WHERE "SessionID" = $1`, [sessionID]);
      await client.query(`DELETE FROM "SpeechData" WHERE "SessionID" = $1`, [sessionID]);
      await client.query(`DELETE FROM "SpeechAnalysis" WHERE "SessionID" = $1`, [sessionID]);
      await client.query(`DELETE FROM "Questionnaire" WHERE "Session_ID" = $1`, [sessionID]);
      await client.query(`DELETE FROM "Puzzle" WHERE "SessionID" = $1`, [sessionID]);
      await client.query(`DELETE FROM balloongame WHERE "SessionID" = $1`, [sessionID]);
      await client.query(`DELETE FROM "FollowData" WHERE "SessionID" = $1`, [sessionID]);
      await client.query(`DELETE FROM "HumanData" WHERE "SessionID" = $1`, [sessionID]);
      await client.query(`DELETE FROM "Session" WHERE "SessionID" = $1`, [sessionID]);
    }

    await client.query(`DELETE FROM "Child" WHERE "ChildID" = $1`, [childId]);

    await client.query('COMMIT');
    res.sendStatus(200);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error("❌ Error deleting child profile:", err);
    res.status(500).send("Failed to delete child profile");
  } finally {
    client.release();
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});