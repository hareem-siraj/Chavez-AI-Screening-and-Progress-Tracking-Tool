import React, { useState, useEffect } from "react";
import { 
  Box, Button, Typography, List, ListItem, ListItemButton, 
  ListItemIcon, ListItemText, Divider
} from "@mui/material";
import { Home, Person, QuestionAnswer, Assessment, Logout} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setFinalScore } from "./redux/store"; // Import the action
import styles from "../theme/Questions.module.css"; // Import custom styles
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const QuestionLogic = require("../components/questionnaireLogic");

type FollowUps = { yes: string[]; no: string[]; [key: string]: string[] };
type Question = { id: number; text: string; followUps: FollowUps };

const Questions: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [progress, setProgress] = useState<
    { answered: boolean; selected: "yes" | "no" | null; result: boolean | null }[]
  >(Array(20).fill({ answered: false, selected: null, result: null }));
  const [followUpResponses, setFollowUpResponses] = useState<{ [key: string]: boolean }>({});
  const [score, setScore] = useState<number | null>(null);

  // Redux state
  const sessionData = useSelector((state: any) => state.sessionData);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchQuestions = async () => {
      setQuestions([
        {
          id: 1,
          text: "If you point at something across the room, does your child look at it? (FOR EXAMPLE, if you point at a toy or an animal, does your child look at the toy or animal?)",
          followUps: {
            yes: [
              "Does he/she Look at object?",
              "Does he/she Point to object?",
              "Does he/she Look and comment on object?",
              "Does he/she Look if you point and say 'look!'?",
              "Does he/she Ignore you?",
              "Does he/she Look around room randomly?",
              "Does he/she Look at your finger?",
            ],
            no: [
              "Does he/she Look at object?",
              "Does he/she Point to object?",
              "Does he/she Look and comment on object?",
              "Does he/she Look if you point and say 'look!'?",
              "Does he/she Ignore you?",
              "Does he/she Look around room randomly?",
              "Does he/she Look at your finger?",
            ],
          },
        },
        {
          id: 2,
          text: "Have you ever wondered if your child might be deaf?",
          followUps: {
            yes: [
              "Does he/she often ignore sounds?",
              "Does he/she often ignore people?",
              // "Has your child’s hearing been tested?",
              // "What were the results of the hearing test? (choose one):",
              // "⁪ Hearing in normal range",
              // "⁪ Hearing below normal",
              // "⁪ Results inconclusive or not definitive",
            ],
            no: [],
          },
        },
        {
          id: 3,
          text: "Does your child play pretend or make-believe? (FOR EXAMPLE, pretend to drink from an empty cup, pretend to talk on a phone, or pretend to feed a doll or stuffed animal?)",
          followUps: {
            yes: [
              "Does he/she usually Pretend to drink from a toy cup?",
              "Does he/she usually Pretend to eat from a toy spoon or fork?",
              "Does he/she usually Pretend to talk on the telephone?",
              "Does he/she usually Pretend to feed a doll or stuffed animal with real or imaginary food?",
              "Does he/she usually Push a car as if it is going along a pretend road?",
              "Does he/she usually Pretend to be a robot, an airplane, a ballerina, or any other favorite character?",
              "Does he/she usually Put a toy pot on a pretend stove?",
              "Does he/she usually Stir imaginary food?",
              "Does he/she usually Put an action figure or doll into a car or truck as if it is the driver or passenger?",
              "Does he/she usually Pretend to vacuum the rug, sweep the floor, or mow lawn?",
            ],
            no: [
              "Does he/she usually Pretend to drink from a toy cup?",
              "Does he/she usually Pretend to eat from a toy spoon or fork?",
              "Does he/she usually Pretend to talk on the telephone?",
              "Does he/she usually Pretend to feed a doll or stuffed animal with real or imaginary food?",
              "Does he/she usually Push a car as if it is going along a pretend road?",
              "Does he/she usually Pretend to be a robot, an airplane, a ballerina, or any other favorite character?",
              "Does he/she usually Put a toy pot on a pretend stove?",
              "Does he/she usually Stir imaginary food?",
              "Does he/she usually Put an action figure or doll into a car or truck as if it is the driver or passenger?",
              "Does he/she usually Pretend to vacuum the rug, sweep the floor, or mow lawn?",
            ],
          },
        },
        {
          id: 4,
          text: "Does your child like climbing on things? (FOR EXAMPLE, furniture, playground equipment, or stairs)",
          followUps: {
            yes: [
              "Does he/she enjoy climbing on Stairs?",
              "Does he/she enjoy climbing on Chairs?",
              "Does he/she enjoy climbing on Furniture?",
              "Does he/she enjoy climbing on Playground equipment?",
            ],
            no: [
              "Does he/she enjoy climbing on Stairs?",
              "Does he/she enjoy climbing on Chairs?",
              "Does he/she enjoy climbing on Furniture?",
              "Does he/she enjoy climbing on Playground equipment?",
            ],
          },
        },
        {
          id: 5,
          text: "Does your child make unusual finger movements near his or her eyes? (FOR EXAMPLE, does your child wiggle his or her fingers close to his or her eyes?)",
          followUps: {
            yes: [
              "Does he/she Look at hands?",
              "Does he/she Move fingers when playing peek-a-boo?",
              "Does he/she Wiggle his/her fingers near his/her eyes more than twice a week?",
              "Does he/she Hold his/her hands up close to his/her eyes more than twice a week?",
              "Does he/she Hold his/her hands off to the side of his/her eyes more than twice a week?",
              "Does he/she Flap his/her hands near his/her face more than twice a week?",
            ],
            no: [],
          },
        },
        {
          id: 6,
          text: "Does your child point with one finger to ask for something that is out of reach or to get help?",
          followUps: {
            yes: [
              "Reach for the object with his/her whole hand?",
              "Lead you to the object?",
              "Try to get the object for him/herself?",
              "Ask for it using words or sounds?",
            ],
            no: []
          }
        },
        {
          id: 7,
          text: "Does your child sometimes point with one finger to things to show you something interesting without the intention of getting help?",
          followUps: {
            yes: [
              "An airplane in the sky?",
              "A truck on the road?",
              "A bug on the ground?",
              "An animal in the yard?",
            ],
            no: [
              "An airplane in the sky?",
              "A truck on the road?",
              "A bug on the ground?",
              "An animal in the yard?",
            ]
          }
        },
        {
          id: 8,
          text: "Is your child interested in other children? (FOR EXAMPLE, does your child watch them, smile at them, or go to them?)",
          followUps: {
            yes: [
              "Does he/she play with children outside the family?",
              "Does he/she try to engage with other children?",
              "Does he/she make vocalizations to get their attention?"
            ],
            no: [
              "Does he/she avoid other children?",
              "Does he/she respond when approached by other children?"
            ]
          }
        },
        {
          id: 9,
          text: "Does your child show you things by bringing them to you or holding them up for you to see? Not just to get help, but to share?",
          followUps: {
            yes: [
              "A picture or toy just to show you?",
              "A drawing he/she has done?",
              "A flower he/she has picked?",
              "A bug he/she has found in the grass?",
              "A few blocks he/she has put together?",
            ],
            no: [
              "A picture or toy just to show you?",
              "A drawing he/she has done?",
              "A flower he/she has picked?",
              "A bug he/she has found in the grass?",
              "A few blocks he/she has put together?",
            ]
          }
        },
        {
          id: 10,
          text: "Does your child respond when you call his or her name? (FOR EXAMPLE, does your child look up, talk, or stop what he or she is doing?)",
          followUps: {
            yes: [
              "Does he/she look up when called?",
              "Does he/she talk or babble in response?",
              "Does he/she stop their activity when you call their name?"
            ],
            no: [
              "Does he/she ignore you when called?",
              "Does he/she respond only when in front of you?",
              "Does he/she respond only if touched?"
            ]
          }
        },
        {
          id: 11,
          text: "When you smile at ____________, does he/she smile back at you?",
          followUps: {
            yes: [
              "Does your child smile when you smile?",
              "Does your child smile when you enter the room?",
              "Does your child smile when you return from being away?"
            ],
            no: [
              "Does he/she always smile?",
              "Does he/she smile at a favorite toy or activity?",
              "Does he/she smile randomly or at nothing in particular?"
            ]
          }
        },
        {
          id: 12,
          text: "Does ___________ get upset by everyday noises?",
          followUps: {
            yes: [
              "Does your child have a negative reaction to a washing machine?",
              "Does your child have a negative reaction to babies crying?",
              "Does your child have a negative reaction to a vacuum cleaner?",
              "Does your child have a negative reaction to a hairdryer?",
              "Does your child have a negative reaction to traffic?",
              "Does your child have a negative reaction to babies squealing or screeching?",
              "Does your child have a negative reaction to loud music?",
              "Does your child have a negative reaction to the telephone/doorbell ringing?",
              "Does your child have a negative reaction to noisy places such as supermarkets or restaurants?"
            ],
            no: [
              "Does your child calmly cover his/her ears?",
              "Does your child tell you that he/she does not like the noise?"
            ]
          }
        },
        {
          id: 13,
          text: "Does your child walk without holding anything   ?",
          followUps: {
            yes: [
              // "Does he/she walk without holding on to anything?"
            ],
            no: []
          }
        },
        {
          id: 14,
          text: "Does ___________ look you in the eye when you are talking to him/her, playing with him/her, or changing him/her?",
          followUps: {
            yes: [
              "Does he/she look you in the eye when he/she needs something?",
              "Does he/she look you in the eye when you are playing with him/her?",
              "Does he/she look you in the eye during feeding?",
              "Does he/she look you in the eye during diaper changes?",
              "Does he/she look you in the eye when you are reading him/her a story?",
              "Does he/she look you in the eye when you are talking to him/her?"
            ],
            no: [
              "Does your child look you in the eye every day?",
              "On a day when you are together all day, does he/she look you in the eye at least 5 times?"
            ]
          }
        },
        
      ]);
    };
    fetchQuestions();
  }, []);


  const currentQuestion = questions[currentQuestionIndex];
  const selectedOption = progress[currentQuestionIndex]?.selected;


    // Handle main question response
    const handleOptionChange = (option: "yes" | "no") => {
      const updatedProgress = [...progress];
      updatedProgress[currentQuestionIndex] = {
        ...updatedProgress[currentQuestionIndex],
        answered: true,
        selected: option,
      };
      setProgress(updatedProgress);
  
      // Reset follow-up responses for the selected option
      const initialFollowUps: { [key: string]: boolean } = {};
      currentQuestion.followUps[option]?.forEach((question) => {
        initialFollowUps[question] = false; // Use question text as key
      });
      setFollowUpResponses(initialFollowUps);
    };
  
    // Handle follow-up responses
    const handleFollowUpChange = (followUpQuestion: string, option: "yes" | "no") => {
      const updatedResponses = { ...followUpResponses };
      updatedResponses[followUpQuestion] = option === "yes";
      setFollowUpResponses(updatedResponses);
    };

    // Evaluate the current question using QuestionLogic
const evaluateCurrentQuestion = () => {
  const mainAnswer = selectedOption === "yes" ? "Yes" : "No";

    // Debug: Log main answer and follow-up responses
  console.log(`Evaluating Question ${currentQuestion.id}`);
  console.log("Main Answer:", mainAnswer);
  console.log("Follow-Up Responses:", followUpResponses);
  
  let result;

  switch (currentQuestion.id) {
    case 1:
      result = QuestionLogic.evaluate_response_1(mainAnswer, followUpResponses);
      break;
    case 2:
      result = QuestionLogic.evaluate_response_2(mainAnswer, followUpResponses);
      break;
    case 3:
      result = QuestionLogic.evaluate_response_3(mainAnswer, followUpResponses);
      break;
    case 4:
      result = QuestionLogic.evaluate_response_4(mainAnswer, followUpResponses);
      break;
    case 5:
      result = QuestionLogic.evaluate_response_5(mainAnswer, followUpResponses, false);
      break;
    case 6:
      result = QuestionLogic.evaluate_response_6(mainAnswer, followUpResponses);
      break;
    case 7:
      result = QuestionLogic.evaluate_response_7(mainAnswer, followUpResponses);
      break;
    case 8:
      result = QuestionLogic.evaluate_response_8(mainAnswer, followUpResponses);
      break;
    case 9:
      result = QuestionLogic.evaluate_response_9(mainAnswer, followUpResponses);
      break;
    case 10:
      result = QuestionLogic.evaluate_response_10(mainAnswer, followUpResponses);
      break;
    case 11:
      result = QuestionLogic.evaluate_response_11(mainAnswer, followUpResponses);
      break;
    case 12:
      result = QuestionLogic.evaluate_response_12(mainAnswer, followUpResponses);
      break;
    case 13:
      result = QuestionLogic.evaluate_response_13(mainAnswer, followUpResponses);
      break;
    case 14:
      result = QuestionLogic.evaluate_response_14(mainAnswer, followUpResponses);
      break;
    default:
      result = QuestionLogic.evaluate_response(currentQuestion.id, mainAnswer, followUpResponses);
  }
    
      console.log(`Evaluating Question ${currentQuestion.id}:`, result); // Debug
      return result;
    };

    const handleNext = async () => {
      if (currentQuestionIndex < questions.length) {
        const result = evaluateCurrentQuestion(); // Returns boolean (true for PASS, false for FAIL)
    
        // Debug: Log the current result
        console.log(`Question ${currentQuestion.id} result:`, result);
    
        // Update progress for the current question
        const updatedProgress = [...progress];
        updatedProgress[currentQuestionIndex] = {
          ...updatedProgress[currentQuestionIndex],
          answered: true,
          selected: selectedOption,
          result,
        };
    
        // Debug: Log progress state before and after updating
        console.log("Progress before update:", progress);
        console.log("Progress after update:", updatedProgress);
    
        setProgress(updatedProgress); // Set updated progress state
    
        const questionData = {
          questionID: currentQuestion.id,
          questionnaireID: sessionData.QuestionnaireID,
          question_text: currentQuestion.text,
          followup_Qs_ans: followUpResponses,
          main_qs_ans: selectedOption === "yes",
          result,
        };
    
        try {
          const response = await fetch("http://localhost:5001/api/save-question-response", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(questionData),
          });
    
          // Debug: Log the API response
          console.log("Save question response API response:", response.status);
        } catch (error) {
          console.error("Error saving question response:", error);
        }
    
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
          calculateFinalScore(updatedProgress); // Pass updatedProgress to avoid stale state
        }
      }
    };

    const calculateFinalScore = async (latestProgress: { answered: boolean; selected: string | null; result: boolean | null }[]) => {
      console.log("Final progress state before score calculation:", latestProgress);
    
      const totalScore = latestProgress.reduce((score, question) => (question.result ? score + 1 : score), 0);
      console.log("Calculated total score:", totalScore);
    
      const finalScore = Math.floor(totalScore);
      console.log("Calculated total score (integer):", finalScore);
    
      setScore(finalScore);
      dispatch(setFinalScore(finalScore));
    
      try {
        const response = await fetch("http://localhost:5001/api/save-final-score", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            questionnaireID: String(sessionData.QuestionnaireID), // Ensure it's a string
            sessionID: String(sessionData.SessionID), // Ensure it's a number
            finalScore: finalScore,
          }),
        });
    
        if (!response.ok) {
          throw new Error("Failed to save final score");
        }
        console.log("Final score saved successfully.");
      } catch (error) {
        console.error("Error saving final score:", error);
      }
    
      navigate("/Score");
      localStorage.setItem("questionnaireCompleted", "true"); // Save status
      alert("Questionnaire submitted successfully!");
    };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  return (
    <Box display="flex" minHeight="100vh" bgcolor="#F5F9FF">
      
     {/* Sidebar */}
     <Box width="250px" bgcolor="#ffffff" borderRight="1px solid #ddd" display="flex" flexDirection="column">
        <Box>
          <Typography variant="h6" align="center" p={2} sx={{ color: "#003366" }}>
            Chavez
          </Typography>
          <Divider />
          <List>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/dashboard">
                <ListItemIcon><Home sx={{ color: "#003366" }} /></ListItemIcon>
                <ListItemText primary="Dashboard" sx={{ color: "#003366" }} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/profile">
                <ListItemIcon><Person sx={{ color: "#003366" }} /></ListItemIcon>
                <ListItemText primary="Profile" sx={{ color: "#003366" }} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/questionnaire">
                <ListItemIcon><QuestionAnswer sx={{ color: "#003366" }} /></ListItemIcon>
                <ListItemText primary="Questionnaire" sx={{ color: "#003366" }} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/game-selection">
                <ListItemIcon><Assessment sx={{ color: "#003366" }} /></ListItemIcon>
                <ListItemText primary="Gamified Assessments" sx={{ color: "#003366" }}/>
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/audio-analysis">
                <ListItemIcon><Assessment sx={{ color: "#003366" }} /></ListItemIcon>
                <ListItemText primary="Audio Analysis" sx={{ color: "#003366" }}/>
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/reports">
                <ListItemIcon><Assessment sx={{ color: "#003366" }} /></ListItemIcon>
                <ListItemText primary="Reports" sx={{ color: "#003366" }}/>
              </ListItemButton>
            </ListItem>
          </List>

          <Divider />
            <List>
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/sign-in">
                  <ListItemIcon>
                    <Logout sx={{ color: "#003366" }} />
                  </ListItemIcon>
                  <ListItemText primary="Logout" primaryTypographyProps={{ sx: { color: "#003366" } }} />
                </ListItemButton>
              </ListItem>
            </List>
            
        </Box>
      </Box>
     {/* Main Content */}
    <Box flexGrow={1} p={4}>

   {/* Question Box */}
<Box className={styles.questionBox}>
  <Typography variant="h5" className={styles.questionText}>
    {currentQuestion?.text}
  </Typography>
  <Box className={styles.options}>
    <Button
      className={`${styles.optionButton} ${selectedOption === "yes" && styles.selected}`}
      onClick={() => handleOptionChange("yes")}
    >
      Yes
    </Button>
    <Button
      className={`${styles.optionButton} ${selectedOption === "no" && styles.selected}`}
      onClick={() => handleOptionChange("no")}
    >
      No
    </Button>
  </Box>
</Box>


   {/* Follow-Up Questions */}
{selectedOption && currentQuestion.followUps[selectedOption]?.length > 0 && (
  <Box className={styles.followUpBox}>
    <Typography variant="h6" sx={{ color: "#003366", fontWeight: "bold", mb: 2 }}>
      Follow-Up Questions
    </Typography>
    {currentQuestion.followUps[selectedOption].map((followUp, index) => (
      <Box key={index} className={styles.followUpQuestion}>
        <Typography sx={{ color: "#003366", fontSize: "16px", fontWeight: "bold" }}>
          {followUp}
        </Typography>
        <Box display="flex" gap={2} mt={1}>
          <Button
            className={`${styles.navButton} ${followUpResponses[followUp] === true ? styles.selectedButton : ""}`}
            onClick={() => handleFollowUpChange(followUp, "yes")}
          >
            Yes
          </Button>
          <Button
            className={`${styles.navButton} ${followUpResponses[followUp] === false ? styles.selectedButton : ""}`}
            onClick={() => handleFollowUpChange(followUp, "no")}
          >
            No
          </Button>
        </Box>
      </Box>
    ))}
  </Box>
)}


{/* Navigation Buttons */}
<Box display="flex" justifyContent="space-between" mt={3}>
  <Button
    className={`${styles.navButton} ${currentQuestionIndex === 0 ? styles.disabledButton : ""}`}
    onClick={handleBack}
    disabled={currentQuestionIndex === 0}
  >
    Back
  </Button>
  
  {currentQuestionIndex === questions.length - 1 ? (
    <Button
      className={`${styles.navButton} ${styles.selectedButton}`}
      onClick={handleNext}
    >
      Submit
    </Button>
  ) : (
    <Button className={`${styles.navButton} ${styles.selectedButton}`} onClick={handleNext}>
      Next
    </Button>
  )}
</Box>


    </Box>

    {/* Progress Sidebar */}

    <Box className="progress-sidebar" sx={{ width: "200px", flexShrink: 0 }}>
      <Typography variant="h6" sx={{ color: "#003366", fontWeight: "bold", mb: 2 }}>
        Progress
      </Typography>
      <List>
        {progress.map((q, i) => (
          <ListItem key={i} disablePadding>
            <Button
              variant="contained"
              disableElevation
              disabled
              className={`progress-button ${q.answered ? "answered" : ""}`}
              sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%",minWidth: "180px" }}
            >
              Question {i + 1}
              {q.answered && <CheckCircleIcon sx={{ ml: 1, color: "green" }} />} {/* Add checkmark if answered */}
            </Button>
          </ListItem>
        ))}
      </List>
    </Box>

    </Box>
  );
};

export default Questions;


