class QuestionLogic {
  /**
 * General evaluation logic for most questions
 * @param {string} questionID - ID of the question
 * @param {string} mainResponse - User's main response (Yes/No)
 * @param {object} followUpResponses - Follow-up responses as a dictionary
 * @returns {boolean} - true for PASS, false for FAIL
 */
static evaluate_response(questionID, mainResponse, followUpResponses) {
  if (mainResponse === "Yes") {
    const passExamples = followUpResponses["Yes"]?.PASS || [];
    return passExamples.some((key) => followUpResponses[key]) ? true : false;
  } else if (mainResponse === "No") {
    const failExamples = followUpResponses["No"]?.FAIL || [];
    return failExamples.every((key) => !followUpResponses[key]) ? false : true;
  }
  return false; // Default to FAIL
}
/**
 * Evaluation logic for Question 1
 * @param {string} mainResponse - User's main response (Yes/No)
 * @param {object} followUpResponses - Follow-up responses as a dictionary
 * @returns {boolean} - true for PASS, false for FAIL
 */
static evaluate_response_1(mainResponse, followUpResponses) {
  const passExamples = [
    "Does he/she Look at object?",
    "Does he/she Point to object?",
    "Does he/she Look and comment on object?",
    "Does he/she Look if you point and say 'look!'?",
  ];
  const failExamples = [
    "Does he/she Ignore you?",
    "Does he/she Look around room randomly?",
    "Does he/she Look at your finger?",
  ];

  // return false; // Default to FAIL
  // Store matched responses
  let passResponses = [];
  let failResponses = [];
  
  // Count 'Yes' responses and collect response types
  const passCount = passExamples.reduce((count, example) => {
      if (followUpResponses[example]) {
          passResponses.push(example);
          return count + 1;
      }
      return count;
  }, 0);
  
  const failCount = failExamples.reduce((count, example) => {
      if (followUpResponses[example]) {
          failResponses.push(example);
          return count + 1;
      }
      return count;
  }, 0);
  
  // Display all pass and fail responses
  // console.log("Pass Responses:", passResponses.length > 0 ? passResponses : "None");
  // console.log("Fail Responses:", failResponses.length > 0 ? failResponses : "None");
  
  // Determine outcome based on responses
  if (passCount > 0 && failCount === 0) {
      return true; // PASS
  }
  else if (failCount > 0 && passCount === 0) {
      return false; // FAIL
  }
  else if  (passCount === failCount) {
    if (mainResponse === "Yes") {
      return true; // PASS
    } else {
      return false; // FAIL
    }
  } 
  else if (passCount > 0 && failCount > 0) {
      return passCount > failCount; // Returns true if passCount > failCount, otherwise false
  }
  
  return false; // Default to FAIL

}

/**
 * Custom logic for Question 2
 * @param {string} mainResponse - User's main response (Yes/No)
 * @param {object} followUpResponses - Follow-up responses as a dictionary
 * @returns {boolean} - true for PASS, false for FAIL
 */
static evaluate_response_2(mainResponse, followUpResponses) {
  if (mainResponse === "No") {
    return true; // PASS
  }
  if (mainResponse === "Yes") {
    const failBehaviors = [
      "Does he/she often ignore sounds?",
      "Does he/she often ignore people?",
    ];
    return failBehaviors.some((behavior) => followUpResponses[behavior]) ? false : true;
  }
  return false; // Default to FAIL
}

// question 3
static evaluate_response_3(mainResponse, followUpResponses) {
  const pretendPlayExamples = [
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
  ];

  // Check if any pretend play example is marked as "true" in followUpResponses
  const hasPretendPlay = pretendPlayExamples.some(
    (example) => followUpResponses[example] === true
  );

  // Return true (PASS) if pretend play is detected, otherwise false (FAIL)
  return hasPretendPlay;
}

// question 4
static evaluate_response_4(mainResponse, followUpResponses) {
  const climbingExamples = [
    "Does he/she enjoy climbing on Stairs?",
    "Does he/she enjoy climbing on Chairs?",
    "Does he/she enjoy climbing on Furniture?",
    "Does he/she enjoy climbing on Playground equipment?",
];

// Check if any climbing example is marked as "true" in followUpResponses
const enjoysClimbing = climbingExamples.some(
    (example) => followUpResponses[example] === true
);

return enjoysClimbing; // PASS if any climbing example applies
  } 


/**
 * Custom logic for Question 5
 * @param {string} mainResponse - User's main response (Yes/No)
 * @param {object} followUpResponses - Follow-up responses as a dictionary
//  * @param {boolean} [frequencyCheck=false] - Optional frequency check
 * @returns {boolean} - true for PASS, false for FAIL
 */
static evaluate_response_5(mainResponse, followUpResponses, frequencyCheck = false) {
  if (mainResponse === "No") {
    return true; // PASS
  }

  const passExamples = ["Does he/she Look at hands?", "Does he/she Move fingers when playing peek-a-boo?"];
  const failExamples = [
    "Does he/she Look at hands?",
    "Does he/she Move fingers when playing peek-a-boo?",
    "Does he/she Wiggle his/her fingers near his/her eyes more than twice a week?",
    "Does he/she Hold his/her hands up close to his/her eyes more than twice a week?",
    "Does he/she Hold his/her hands off to the side of his/her eyes more than twice a week?",
    "Does he/she Flap his/her hands near his/her face more than twice a week?",
  ];

  const hasPass = passExamples.some((example) => followUpResponses[example]);
  const hasFail = failExamples.some((example) => followUpResponses[example]);
  if (hasPass && !hasFail) {
    return true; // PASS if only pass examples
  }
  return false; // Default to FAIL
  
}


static evaluate_response_6(mainResponse, followUpResponses, showMeResponse) {
  if (mainResponse === "Yes") {
    return true;
  } 
  else if (mainResponse === "No") {
    const alternativeBehaviors = [
      "Reach for the object with his/her whole hand?",
      "Lead you to the object?",
      "Try to get the object for him/herself?",
      "Ask for it using words or sounds?",
    ];
    const hasAlternative = alternativeBehaviors.some(
      (behavior) => followUpResponses[behavior]
    );

    return hasAlternative && showMeResponse === "Yes";
  }
  return true; // Default to FAIL
}


/**
 * Custom logic for Question 7
 * @param {string} mainResponse - User's main response (Yes/No)
 * @param {object} followUpResponses - Follow-up responses as a dictionary
 * @returns {boolean} - "PASS" or "FAIL"
 */
static evaluate_response_7(mainResponse, followUpResponses) {
    const interests = [
      "An airplane in the sky?",
      "A truck on the road?",
      "A bug on the ground?",
      "An animal in the yard?",
    ];
    const pointsToInterest = interests.some(
      (interest) => followUpResponses[interest]
    );

    if (pointsToInterest) {
      return  true;
    }
    return false;
  
}

static evaluate_response_8(mainResponse, followUpResponses, frequencyCheck = false) {
  if (mainResponse === "Yes") {
    return !!followUpResponses["interested_in_non_siblings"];
  } else if (mainResponse === "No") {
    if (followUpResponses["responds_to_others"]) {
      const behaviors = [
        "play_with_another_child",
        "talk_to_another_child",
        "babble_or_make_vocal_noises",
        "watch_another_child",
        "smile_at_another_child",
        "act_shy_then_smile",
        "get_excited_about_another_child",
      ];
      const hasBehaviors = behaviors.some(
        (behavior) => followUpResponses[behavior]
      );

      return hasBehaviors && frequencyCheck;
    }
    return false;
  }
  return true; // Default to FAIL
}


/**
 * Custom logic for Question 9
 * @param {string} mainResponse - User's main response (Yes/No)
 * @param {object} followUpResponses - Follow-up responses as a dictionary
 * @returns {boolean} - "PASS" or "FAIL"
 */
static evaluate_response_9(mainResponse, followUpResponses) {
  
    const items = [
      "A picture or toy just to show you?",
      "A drawing he/she has done?",
      "A flower he/she has picked?",
      "A bug he/she has found in the grass?",
      "A few blocks he/she has put together?",
    ];
    const bringsItem = items.some((item) => followUpResponses[item]);

    return bringsItem ? true : false;
 
}

static evaluate_response_10(mainResponse, followUpResponses, primaryBehavior = null) {
  const passResponses = ["look_up", "talk_or_babble", "stop_activity"];
  const failResponses = [
    "make_no_response",
    "seem_to_ignore",
    "respond_only_if_in_front",
    "respond_only_if_touched",
  ];

  if (mainResponse === "Yes") {
    return passResponses.some((response) => followUpResponses[response]);
  } else if (mainResponse === "No") {
    const hasPass = passResponses.some(
      (response) => followUpResponses[response]
    );
    const hasFail = failResponses.some(
      (response) => followUpResponses[response]
    );

    if (hasPass && !hasFail) {
      return true;
    } else if (hasFail && !hasPass) {
      return false;
    } else if (hasPass && hasFail) {
      return !!primaryBehavior; // Convert to boolean
    }
    return false;
  }
  return true;
}


 // Custom logic for Question 11
 static evaluate_response_11(mainResponse, followUpResponses) {
  // Define the main question and associated pass/fail question descriptions
  const mainPrompt = "When you smile at ____________, does he/she smile back at you?";
  const passQuestions = [
    { key: "smile_when_you_smile", desc: "Does your child smile when you smile?" },
    { key: "smile_when_you_enter_room", desc: "Does your child smile when you enter the room?" },
    { key: "smile_when_you_return", desc: "Does your child smile when you return from being away?" },
  ];
  const failQuestions = [
    { key: "always_smile", desc: "Does he/she always smile?" },
    { key: "smile_at_favorite_toy", desc: "Does he/she smile at a favorite toy or activity?" },
    { key: "smile_randomly", desc: "Does he/she smile randomly or at nothing in particular?" },
  ];

  const responses = followUpResponses;

  if (mainResponse === "No") {
    // Evaluate fail type questions
    const failYesCount = failQuestions.filter((q) => responses[q.key]).length;

    if (failYesCount === failQuestions.length) {
      // All fail responses are "Yes"
      return false; // FAIL
    }

    // Evaluate pass type questions
    const passYesCount = passQuestions.filter((q) => responses[q.key]).length;

    // Compare pass and fail response counts
    return passYesCount > failYesCount; // PASS if more pass responses
  }

  if (mainResponse === "Yes") {
    // Evaluate pass type questions
    const passYesCount = passQuestions.filter((q) => responses[q.key]).length;

    if (passYesCount === passQuestions.length) {
      // All pass responses are "Yes"
      return true; // PASS
    }

    // Evaluate fail type questions
    const failYesCount = failQuestions.filter((q) => responses[q.key]).length;

    // Compare pass and fail response counts
    return passYesCount > failYesCount; // PASS if more pass responses
  }

  return false; // Default to FAIL for invalid responses
}

// Custom logic for Question 12
static evaluate_response_12(mainResponse, followUpResponses) {
  // Define the main question, negative reactions, pass, and fail question descriptions
  const mainPrompt = "Does ___________ get upset by everyday noises?";
  const negativeReactionQuestions = [
    { key: "washing_machine", desc: "Does your child have a negative reaction to a washing machine?" },
    { key: "babies_crying", desc: "Does your child have a negative reaction to babies crying?" },
    { key: "vacuum_cleaner", desc: "Does your child have a negative reaction to a vacuum cleaner?" },
    { key: "hairdryer", desc: "Does your child have a negative reaction to a hairdryer?" },
    { key: "traffic", desc: "Does your child have a negative reaction to traffic?" },
    { key: "babies_squealing", desc: "Does your child have a negative reaction to babies squealing or screeching?" },
    { key: "loud_music", desc: "Does your child have a negative reaction to loud music?" },
    { key: "telephone_ringing", desc: "Does your child have a negative reaction to the telephone/doorbell ringing?" },
    { key: "noisy_places", desc: "Does your child have a negative reaction to noisy places such as supermarkets or restaurants?" },
  ];

  const passQuestions = [
    { key: "calmly_cover_ears", desc: "Does your child calmly cover his/her ears?" },
    { key: "tell_no_like_noise", desc: "Does your child tell you that he/she does not like the noise?" },
  ];

  const failQuestions = [
    { key: "scream", desc: "Does your child scream?" },
    { key: "cry", desc: "Does your child cry?" },
    { key: "cover_ears_upset", desc: "Does your child cover his/her ears while upset?" },
  ];

  if (mainResponse === "No") {
    return true; // PASS if the main response is "No"
  }

  // Evaluate negative reaction questions
  const negativeYesCount = negativeReactionQuestions.filter((q) => followUpResponses[q.key]).length;

  if (negativeYesCount <= 1) {
    return true; // PASS if one or no negative reactions
  }

  // Evaluate fail type questions
  const failYesCount = failQuestions.filter((q) => followUpResponses[q.key]).length;

  if (failYesCount === failQuestions.length) {
    return false; // FAIL if all fail-type responses are "Yes"
  }

  // Evaluate pass type questions
  const passYesCount = passQuestions.filter((q) => followUpResponses[q.key]).length;

  // Compare pass and fail response counts
  return passYesCount > failYesCount; // PASS if more pass responses, otherwise FAIL
}

// Custom logic for Question 13
static evaluate_response_13(mainResponse, followUpResponses) {
  // Define the main question and follow-up question prompts
  const mainPrompt = "Does your child walk without holding on to anything?"
  if (mainResponse === "Yes") {
    return true; // FAIL if the main response is "No"
  }
  return false; // PASS if follow-up response is "Yes", otherwise FAIL
}

// Custom logic for Question 14
static evaluate_response_14(mainResponse, followUpResponses) {
  // Define the main question, general follow-up questions, and additional prompts
  const mainPrompt = "Does ___________ look you in the eye when you are talking to him/her, playing with him/her, or changing him/her?";
  const generalFollowups = [
    { key: "needs_something", desc: "Does he/she look you in the eye when he/she needs something?" },
    { key: "playing", desc: "Does he/she look you in the eye when you are playing with him/her?" },
    { key: "feeding", desc: "Does he/she look you in the eye during feeding?" },
    { key: "diaper_changes", desc: "Does he/she look you in the eye during diaper changes?" },
    { key: "reading_story", desc: "Does he/she look you in the eye when you are reading him/her a story?" },
    { key: "talking", desc: "Does he/she look you in the eye when you are talking to him/her?" },
  ];
  const onlyOncePrompt = "Does your child look you in the eye every day?";
  const allDayFiveTimesPrompt = "On a day when you are together all day, does he/she look you in the eye at least 5 times?";

  // Evaluate general follow-up questions
  const generalYesCount = generalFollowups.filter((q) => followUpResponses[q.key]).length;

  if (generalYesCount >= 2) {
    return true; // PASS if Yes to two or more general follow-ups
  }
  if (generalYesCount === 0) {
    return false; // FAIL if No to all general follow-ups
  }

  // If Yes to only one general follow-up, evaluate additional prompts
  const onlyOnceResponse = followUpResponses["only_once"];

  if (!onlyOnceResponse) {
    return false; // FAIL if No to the "only once" prompt
  }

  const allDayResponse = followUpResponses["all_day_five_times"];

  return allDayResponse === true; // PASS if Yes to "all day 5 times", otherwise FAIL
}

}


module.exports = QuestionLogic;