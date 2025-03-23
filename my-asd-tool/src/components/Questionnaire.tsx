import React, { useState, useEffect } from "react";
import { 
  Box, 
  Typography, 
  Button, 
  List, 
  ListItem,
  Divider, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText
} from "@mui/material";
import { Link } from "react-router-dom";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Home from '@mui/icons-material/Home';
import Person from '@mui/icons-material/Person';
import QuestionAnswer from '@mui/icons-material/QuestionAnswer';
import Assessment from '@mui/icons-material/Assessment';
import Logout from '@mui/icons-material/Logout';
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import styles from "../theme/QuestionnairePage.module.css";
import { setFinalScore } from "./redux/store"; // Import the action
import { setSessionIds } from "./redux/store";

// Import QuestionLogic
const QuestionLogic = require("../components/questionnaireLogic");

type FollowUps = {
  yes: string[];
  no: string[];
  [key: string]: string[];
};

type Question = {
  id: number;
  text: string;
  followUps: FollowUps;
};


const Questions: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [progress, setProgress] = useState<
    { answered: boolean; selected: "yes" | "no" | null; result: boolean | null }[]
  >(Array(20).fill({ answered: false, selected: null, result: null }));
  const [followUpResponses, setFollowUpResponses] = useState<{ [key: string]: boolean }>({});
  const [score, setScore] = useState<number | null>(null);
  // Add this state to track dynamic follow-ups
  const [dynamicFollowUps, setDynamicFollowUps] = useState<string[]>([]);


  // Redux state
  const sessionData = useSelector((state: any) => state.sessionData);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(setSessionIds({ SessionID: null, QuestionnaireID: null, GameSessionID: null, ReportID: null }));
    localStorage.clear(); // Clear stored data
    sessionStorage.clear();
    window.location.href = "/sign-in"; // Redirect to login page
  };

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
              "Has your child’s hearing been tested?",
              "What were the results of the hearing test? (choose one):",
              "⁪ Hearing in normal range",
              "⁪ Hearing below normal",
              "⁪ Results inconclusive or not definitive",
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
          // id: 8,
          // text: "Is your child interested in other children? (FOR EXAMPLE, does your child watch them, smile at them, or go to them?)",
          // followUps: {
          //   yes: [
          //     "Does he/she play with children outside the family?",
          //     "Does he/she try to engage with other children?",
          //     "Does he/she make vocalizations to get their attention?"
          //   ],
          //   no: [
          //     "Does he/she avoid other children?",
          //     "Does he/she respond when approached by other children?"
          //   ]
          // }
          // ####### Modified Question 8 #######
          id: 8,
          text: "Is your child interested in other children? (FOR EXAMPLE, does your child watch them, smile at them, or go to them?)",
          followUps: { yes: [], no: [] } // Empty arrays for dynamic follow-ups
          // ##################################
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
              "Does he/she stop their activity when you call their name?",
              "Does he/she ignore you when called?",
              "Does he/she respond only when in front of you?",
              "Does he/she respond only if touched?"
            ],
            no: [
              "Does he/she look up when called?",
              "Does he/she talk or babble in response?",
              "Does he/she stop their activity when you call their name?",
              "Does he/she ignore you when called?",
              "Does he/she respond only when in front of you?",
              "Does he/she respond only if touched?"
            ]
          }
        },
        {
          id: 11,
          text: "When you smile at your child, does he/she smile back at you?",
          followUps: {
            yes: [],
            no: [
              "Does your child smile when you smile?",
              "Does your child smile when you enter the room?",
              "Does your child smile when you return from being away?",
              "Does he/she always smile?",
              "Does he/she smile at a favorite toy or activity?",
              "Does he/she smile randomly or at nothing in particular?"
            ]
          }
        },
        {
          id: 12,
          text: "Does ___________ get upset by everyday noises?",
          followUps: { yes: [], no: [] } // Empty arrays for dynamic follow-ups
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
              "Does he/she look you in the eye when he/she needs something?",
              "Does he/she look you in the eye when you are playing with him/her?",
              "Does he/she look you in the eye during feeding?",
              "Does he/she look you in the eye during diaper changes?",
              "Does he/she look you in the eye when you are reading him/her a story?",
              "Does he/she look you in the eye when you are talking to him/her?"
            ]
          }
        },
        {
          id: 15,
          text: "Does your child try to copy what you do?",
          followUps: {
            yes: [
              "Does your child try to copy you if you stick out your tongue?",
              "Does your child try to copy you if you clap your hands?",
              "Does your child try to copy you if you wave good bye?",
              "Does your child try to copy you if you make a funny sound?",
              "Does your child try to copy you if you blow a kiss?",
              "Does your child try to copy you if you put your fingers to your lips to signal 'Shhh'?"
            ],
            no: [
              "Does your child try to copy you if you stick out your tongue?",
              "Does your child try to copy you if you clap your hands?",
              "Does your child try to copy you if you wave good bye?",
              "Does your child try to copy you if you make a funny sound?",
              "Does your child try to copy you if you blow a kiss?",
              "Does your child try to copy you if you put your fingers to your lips to signal 'Shhh'?"
            ]
  }
        },
        {
          id: 16,
          text: " If you turn your head to look at something, does your child look around to see what you are looking at? ",
          followUps: {
            yes: [],  // No follow-ups needed for Yes response
            no: [
              // Pass examples
              "Does your child look toward the thing you are looking at?",
              "Does your child point toward the thing you are looking at?",
              "Does your child look around to see what you are looking at?",
              // Fail examples
              "Does your child look at your face?",
              "Does your child ignore you?",
            ]
          }
        },
        {
          id: 17,
          text: "Does your child try to get you to watch him/her?",
          followUps: {
            yes: [
              "Does your child say 'Look!' or 'Watch me!'?",
              "Does your child babble or make a noise to get you to watch what he/she is doing?",
              "Does your child look at you to get praise or comment?",
              "Does your child keep looking to see if you are looking?"
            ],
 
            no: [
              "Does your child say 'Look!' or 'Watch me!'?",
              "Does your child babble or make a noise to get you to watch what he/she is doing?",
              "Does your child look at you to get praise or comment?",
              "Does your child keep looking to see if you are looking?"
            ]
          }
        },
        {
          id: 18,
          text: "Does your child understand when you tell them to do something?",
          followUps: {
            yes: [
              "When you are dressed to go out and you tell your child to get their shoes, do they understand?",
              "If it is dinnertime and food is on the table, and you tell the child to sit down, will they come sit at the table?",
              "If you say, 'Show me your shoe' without pointing, making gestures, or giving hints (when you are not going out or getting dressed), does your child show you their shoe? ",
              "If you ask for another object without pointing, making gestures, or giving hints, does your child bring it to you?",
              "If you say, “Put the book on the chair” without pointing, making gestures, or giving any other hints, does your child put the book on the chair?"
              
            ],
 
            no: [
              "When you are dressed to go out and you tell your child to get their shoes, do they understand?",
              "If it is dinnertime and food is on the table, and you tell the child to sit down, will they come sit at the table?",
              "If you say, 'Show me your shoe' without pointing, making gestures, or giving hints (when you are not going out or getting dressed), does your child show you their shoe? ",
              "If you ask for another object without pointing, making gestures, or giving hints, does your child bring it to you?",
              "If you say, “Put the book on the chair” without pointing, making gestures, or giving any other hints, does your child put the book on the chair?"
            ]
          }
        },
        {
          id: 19,
          text: "If something new happens, does your child look at your face to see how you feel about it?",
          followUps: {
            yes: [],
 
            no: [
              "If your child hears a strange or scary noise, will he/she look at you before responding?",
              "Does your child look at you when someone new approaches?",
              "Does your child look at you when he/she is faced with something unfamiliar or a little scary?",
            ]
          }
        },
        {
          id: 20,
          text: "Does your child enjoy movement activites like being bounced or swung?",
          followUps: {
            yes: [],
 
            no: [
              "Does your child laugh or smile",
              "Does your child talk or babble",
              "Does your child request more by holding out his/her arms"
            ]
          }
        }
      ]);
    };
    fetchQuestions();
  }, []);

  const currentQuestion = questions[currentQuestionIndex];
  const selectedOption = progress[currentQuestionIndex]?.selected;

    // ########## Modified handleOptionChange ##########

    // Modify handleOptionChange to set dynamic follow-ups
    const handleOptionChange = (option: "yes" | "no") => {
      // const updatedProgress = [...progress];
      // updatedProgress[currentQuestionIndex] = {
      //   ...updatedProgress[currentQuestionIndex],
      //   answered: true,
      //   selected: option,
      // };
      // setProgress(updatedProgress);
    
      // // For Question 8, use dynamic follow-ups
      // if (currentQuestion.id === 8) {
      //   const followUps = QuestionLogic.getFollowUpQuestions(
      //     currentQuestion.id,
      //     option === "yes" ? "Yes" : "No"
      //   );
        
      //   if (followUps && Array.isArray(followUps)) {
      //     setDynamicFollowUps(followUps);
      //     const initialFollowUps: { [key: string]: boolean } = {};
      //     followUps.forEach((question: string) => {
      //       initialFollowUps[question] = false;
      //     });
      //     setFollowUpResponses(initialFollowUps);
      //   }
      // } else {
      //   // For other questions, use static follow-ups from the questions array
      //   const followUps = currentQuestion.followUps[option] || [];
      //   setDynamicFollowUps(followUps);
        
      //   const initialFollowUps: { [key: string]: boolean } = {};
      //   followUps.forEach((question: string) => {
      //     initialFollowUps[question] = false;
      //   });
      //   setFollowUpResponses(initialFollowUps);
      // }
      const updatedProgress = [...progress];
    updatedProgress[currentQuestionIndex] = {
      ...updatedProgress[currentQuestionIndex],
      answered: true,
      selected: option,
    };
    setProgress(updatedProgress);

    // Handle questions with dynamic follow-ups
    if (currentQuestion.id === 8 || currentQuestion.id === 12) {
      // For questions with dynamic follow-ups
      const followUps = QuestionLogic.getFollowUpQuestions(
        currentQuestion.id,
        option === "yes" ? "Yes" : "No"
      );
      
      if (followUps && Array.isArray(followUps)) {
        setDynamicFollowUps(followUps);
        const initialFollowUps: { [key: string]: boolean } = {};
        followUps.forEach((question: string) => {
          initialFollowUps[question] = false;
        });
        setFollowUpResponses(initialFollowUps);
      } else {
        // Reset if no follow-ups
        setDynamicFollowUps([]);
        setFollowUpResponses({});
      }
    } else {
      // For questions with static follow-ups
      const followUps = currentQuestion.followUps[option] || [];
      setDynamicFollowUps(followUps);
      
      const initialFollowUps: { [key: string]: boolean } = {};
      followUps.forEach((question: string) => {
        initialFollowUps[question] = false;
      });
      setFollowUpResponses(initialFollowUps);
      } 
    };

    const handleFollowUpChange = (followUpQuestion: string, option: "yes" | "no") => {
      const updatedResponses = { ...followUpResponses };
      updatedResponses[followUpQuestion] = option === "yes";
      setFollowUpResponses(updatedResponses);
    
      // Special handling for Question 8
      if (currentQuestion.id === 8) {
        if (followUpQuestion === "Is he/she interested in children who are not his/her brother or sister?" ||
            followUpQuestion === "When you are at the playground or supermarket, does your child usually respond to other children?") {
          
          if (option === "no") {
            // Load secondary follow-ups
            const secondaryFollowUps = QuestionLogic.getSecondaryFollowUps(8, false);
            setDynamicFollowUps(secondaryFollowUps);
          } else if (option === "yes" && followUpQuestion.includes("brother or sister")) {
            setDynamicFollowUps([]); // Clear follow-ups as it's a direct pass
          } else {
            // Load behavior options
            const behaviorOptions = QuestionLogic.getSecondaryFollowUps(8, false);
            setDynamicFollowUps([...behaviorOptions, "Does he/she respond to other children more than half of the time?"]);
          }
        }
      }
      if (currentQuestion.id === 12) {
        const firstSetResponses = [
          "Does your child have a negative reaction to a washing machine?",
          "Does your child have a negative reaction to babies crying?",
          "Does your child have a negative reaction to a vacuum cleaner?",
          "Does your child have a negative reaction to a hairdryer?",
          "Does your child have a negative reaction to traffic?",
          "Does your child have a negative reaction to babies squealing or screeching?",
          "Does your child have a negative reaction to loud music?",
          "Does your child have a negative reaction to the telephone/doorbell ringing?",
          "Does your child have a negative reaction to noisy places such as supermarkets or restaurants?"
        ];
    
        // Count yes responses to first set
        const yesCount = firstSetResponses.reduce((count, question) => 
          updatedResponses[question] === true ? count + 1 : count, 0
        );
    
        // If more than one yes in first set, show second set
        if (yesCount > 1) {
          const secondaryFollowUps = QuestionLogic.getSecondaryFollowUps(12, true);
          setDynamicFollowUps(secondaryFollowUps);
        }
      }
    };
    
    // ################################################
  
    

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
    case 15:
      result = QuestionLogic.evaluate_response_15(mainAnswer, followUpResponses);
      break;
    case 16:
      result = QuestionLogic.evaluate_response_16(mainAnswer, followUpResponses);
      break;
    case 17:
      result = QuestionLogic.evaluate_response_17(mainAnswer, followUpResponses);
      break;
    case 18:
      result = QuestionLogic.evaluate_response_18(mainAnswer, followUpResponses);
      break;
    case 19:
      result = QuestionLogic.evaluate_response_19(mainAnswer, followUpResponses);
      break;
    case 20:
      result = QuestionLogic.evaluate_response_20(mainAnswer, followUpResponses);
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
          // questionnaireID: sessionData.QuestionnaireID,
          sessionID: sessionData.SessionID,
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
      // Debug: Log the final state of progress before score calculation
      console.log("Final progress state before score calculation:", latestProgress);
    
      // Ensure `result` is aggregated correctly
      const totalScore = latestProgress.reduce((score: number, question) => {
        if (question.result === true) {
          return score + 1;
        }
        return score;
      }, 0);
    
      // Debug: Log the calculated score
      console.log("Calculated total score:", totalScore);

      const finalScore = Math.floor(totalScore);

      console.log("Calculated total score (integer):", finalScore);
    
      setScore(totalScore);
    
      dispatch(setFinalScore(totalScore));
    
      try {
        await fetch("http://localhost:5001/api/save-final-score", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            questionnaireID: sessionData.QuestionnaireID,
            sessionID: sessionData.SessionID,
            finalScore: totalScore,
          }),
        });
      } catch (error) {
        console.error("Error saving final score:", error);
      }
    
      navigate("/Score");
    };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  return (
    <Box display="flex" minHeight="100vh" bgcolor="#F5F9FF">
      {/* Sidebar Navigation */}
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
                <ListItemButton onClick={handleLogout}> {/* Call handleLogout on click */}
                  <ListItemIcon>
                    <Logout sx={{ color: "#003366" }} />
                  </ListItemIcon>
                  <ListItemText primary="Logout" primaryTypographyProps={{ sx: { color: "#003366" } }} />
                </ListItemButton>
              </ListItem>
            </List>
            
        </Box>
      </Box>

      {/* Main Content Area */}
      <Box flexGrow={1} p={4}>
        {/* Existing Questionnaire Component Content */}
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
        {selectedOption && dynamicFollowUps.length > 0 && (
          <Box className={styles.followUpBox}>
            <Typography variant="h6" sx={{ color: "#003366", fontWeight: "bold", mb: 2 }}>
              Follow-Up Questions
            </Typography>
            {dynamicFollowUps.map((followUp, index) => (
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
      <Box className="progress-sidebar" sx={{ width: "250px", flexShrink: 0 }}>
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
                sx={{ 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "space-between", 
                  width: "100%",
                  minWidth: "180px" 
                }}
              >
                Question {i + 1}
                {q.answered && <CheckCircleIcon sx={{ ml: 1, color: "green" }} />}
              </Button>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default Questions;