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
    "کیا وہ چیز کی طرف دیکھتا/دیکھتی ہے؟",
        "کیا وہ چیز کی طرف اشارہ کرتا/کرتی ہے؟",
        "کیا وہ چیز کو دیکھ کر تبصرہ کرتا/کرتی ہے؟",
        "کیا وہ آپ کے اشارہ کرنے اور کہنے پر 'دیکھو' دیکھتا/دیکھتی ہے؟",
  ];
  const failExamples = [
    "کیا وہ آپ کو نظر انداز کرتا/کرتی ہے؟",
        "کیا وہ کمرے کے اردگرد بے ترتیب طور پر دیکھتا/دیکھتی ہے؟",
        "کیا وہ آپ کی انگلی کو دیکھتا/دیکھتی ہے؟",
  ];

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
      "کیا وہ اکثر آوازوں کو نظرانداز کرتا/کرتی ہے؟",
          "کیا وہ اکثر لوگوں کو نظرانداز کرتا/کرتی ہے؟",
    ];
    return failBehaviors.some((behavior) => followUpResponses[behavior]) ? false : true;
  }
  return false; // Default to FAIL
}

// question 3
static evaluate_response_3(mainResponse, followUpResponses) {
  const pretendPlayExamples = [
    "کیا وہ عام طور پر کھلونے کے کپ سے پینے کا دکھاوا کرتا/کرتی ہے؟",
        "کیا وہ عام طور پر کھلونے کے چمچ یا کانٹے سے کھانے کا دکھاوا کرتا/کرتی ہے؟",
        "کیا وہ عام طور پر فون پر بات کرنے کا دکھاوا کرتا/کرتی ہے؟",
        "کیا وہ عام طور پر گڑیا یا کھلونا جانور کو حقیقی یا خیالی کھانے سے کھلانے کا دکھاوا کرتا/کرتی ہے؟",
        "کیا وہ عام طور پر کار کو اس طرح دھکیلتا/دھکیلتی ہے جیسے وہ خیالی سڑک پر جا رہی ہو؟",
        "کیا وہ عام طور پر روبوٹ، ہوائی جہاز، رقاصہ، یا کسی اور پسندیدہ کردار بننے کا دکھاوا کرتا/کرتی ہے؟",
        "کیا وہ عام طور پر کھلونے کے برتن کو خیالی چولہے پر رکھتا/رکھتی ہے؟",
        "کیا وہ عام طور پر خیالی کھانے کو ہلاتا/ہلاتی ہے؟",
        "کیا وہ عام طور پر کھلونا کار یا ٹرک میں ایکشن فگر یا گڑیا کو اس طرح رکھتا/رکھتی ہے جیسے وہ ڈرائیور یا مسافر ہو؟",
        "کیا وہ عام طور پر قالین صاف کرنے، فرش جھاڑنے، یا گھاس کاٹنے کا دکھاوا کرتا/کرتی ہے؟",
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
    "کیا اسے/اسے سیڑھیوں پر چڑھنا پسند ہے؟",
        "کیا اسے/اسے کرسیوں پر چڑھنا پسند ہے؟",
        "کیا اسے/اسے فرنیچر پر چڑھنا پسند ہے؟",
        "کیا اسے/اسے جھولے کے سامان پر چڑھنا پسند ہے؟",
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

  const passExamples = [
    "کیا وہ اپنے ہاتھوں کو دیکھتا/دیکھتی ہے؟",
        "کیا وہ آنکھ مچولی کھیلتے وقت اپنی انگلیاں ہلاتا/ہلاتی ہے؟",
  ];
  const failExamples = [
    "کیا وہ ہفتے میں دو بار سے زیادہ اپنی انگلیوں کو اپنی آنکھوں کے قریب ہلاتا/ہلاتی ہے؟",
        "کیا وہ ہفتے میں دو بار سے زیادہ اپنے ہاتھوں کو اپنی آنکھوں کے قریب رکھتا/رکھتی ہے؟",
        "کیا وہ ہفتے میں دو بار سے زیادہ اپنے ہاتھوں کو اپنی آنکھوں کے کنارے رکھتا/رکھتی ہے؟",
        "کیا وہ ہفتے میں دو بار سے زیادہ اپنے ہاتھوں کو اپنے چہرے کے قریب پھڑپھڑاتا/پھڑپھڑاتی ہے؟",
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
      "کیا وہ چیز کو اپنے پورے ہاتھ سے پکڑنے کی کوشش کرتا/کرتی ہے؟",
          "کیا وہ آپ کو اس چیز کی طرف لے جاتا/جاتی ہے؟",
          "کیا وہ خود اس چیز کو حاصل کرنے کی کوشش کرتا/کرتی ہے؟",
          "کیا وہ الفاظ یا آوازوں کا استعمال کرکے اسے مانگتا/مانگتی ہے؟",
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
      "آسمان میں ہوائی جہاز کی طرف؟",
        "سڑک پر ٹرک کی طرف؟",
        "زمین پر کیڑے کی طرف؟",
        "آنگن میں جانور کی طرف؟",
    ];
    const pointsToInterest = interests.some(
      (interest) => followUpResponses[interest]
    );

    if (pointsToInterest) {
      return  true;
    }
    return false;
  
}
// ##################Modified Q8##################
static getFollowUpQuestions(questionId, mainResponse) {
if (questionId === 8) {
  if (mainResponse === "Yes") {
    return ["کیا وہ اپنے بھائی یا بہن کے علاوہ دوسرے بچوں میں دلچسپی لیتا/لیتی ہے؟"];
  } else {
    return ["جب آپ کھیل کے میدان یا سپر مارکیٹ میں ہوتے ہیں، تو کیا آپ کا بچہ عام طور پر دوسرے بچوں کے ساتھ تعامل کرتا ہے؟"];
  }
}
if (questionId === 12) {
  if (mainResponse === "Yes") {
    return [
      "کیا آپ کے بچے کو واشنگ مشین سے منفی رد عمل ہوتا ہے؟",
      "کیا آپ کے بچے کو بچوں کے رونے سے منفی رد عمل ہوتا ہے؟",
      "کیا آپ کے بچے کو ویکیوم کلینر سے منفی رد عمل ہوتا ہے؟",
      "کیا آپ کے بچے کو ہیئر ڈرائر سے منفی رد عمل ہوتا ہے؟",
      "کیا آپ کے بچے کو ٹریفک سے منفی رد عمل ہوتا ہے؟",
      "کیا آپ کے بچے کو بچوں کے چیخنے یا چلانے سے منفی رد عمل ہوتا ہے؟",
      "کیا آپ کے بچے کو تیز موسیقی سے منفی رد عمل ہوتا ہے؟",
      "کیا آپ کے بچے کو ٹیلیفون/دروازے کی گھنٹی بجنے سے منفی رد عمل ہوتا ہے؟",
      "کیا آپ کے بچے کو شور والی جگہوں جیسے سپر مارکیٹ یا ریستوران سے منفی رد عمل ہوتا ہے؟"
    ];
  }
  return []; // No follow-ups for "No" response
}
// ...other questions logic...
}

// static getSecondaryFollowUps(questionId, firstResponse) {
//   if (questionId === 8) {
//     if (firstResponse === true) {
//       return [];  // Pass directly if yes to non-sibling interest
//     } else {
//       return [
//         "Play with another child?",
//         "Talk to another child?",
//         "Babble or make vocal noises?",
//         "Watch another child?",
//         "Smile at another child?",
//         "Act shy at first but then smile?",
//         "Get excited about another child?"
//       ];
//     }
//   }
//   if (questionId === 12 && hasMultipleReactions) {
//     return [
//       // Pass examples
//       "Does your child remain calm most of the time?",
//       "Does your child recover quickly from the noise?",
//       "Does your child try to move away from the noise?",
//       // Fail examples
//       "Does your child become aggressive?",
//       "Does your child have a meltdown?",
//       "Does your child take a long time to calm down?"
//     ];
//   }
// }

static getSecondaryFollowUps(questionId, condition) {
switch (questionId) {
  case 8:
    return [
      "کیا آپ کا بچہ دوسرے بچوں کے ساتھ کھیلتا ہے؟",
      "کیا آپ کا بچہ دوسرے بچوں سے بات کرتا ہے؟",
      "کیا آپ کا بچہ بڑبڑاتا ہے یا آوازیں نکالتا ہے؟",
      "کیا آپ کا بچہ دوسرے بچوں کو دیکھتا ہے؟",
      "کیا آپ کا بچہ دوسرے بچوں پر مسکراتا ہے؟",
      "کیا آپ کا بچہ پہلے شرماتا ہے پھر مسکراتا ہے؟",
      "کیا آپ کا بچہ دوسرے بچوں کو دیکھ کر پرجوش ہوتا ہے؟"
    ];

  case 12:
    // condition here represents whether there are multiple negative reactions
    if (condition === true) {
      return [
        // Pass examples (کامیابی کی مثالیں)
        "کیا آپ کا بچہ زیادہ تر وقت پرسکون رہتا ہے؟",
        "کیا آپ کا بچہ شور سے جلدی سنبھل جاتا ہے؟",
        "کیا آپ کا بچہ شور سے دور جانے کی کوشش کرتا ہے؟",
        // Fail examples (ناکامی کی مثالیں)
        "کیا آپ کا بچہ جارحانہ ہو جاتا ہے؟",
        "کیا آپ کے بچے کو غصے کا دورہ پڑتا ہے؟",
        "کیا آپ کے بچے کو پرسکون ہونے میں طویل وقت لگتا ہے؟"
      ];
    }
    return [];

  default:
    return [];
}
}

static evaluate_response_8(mainResponse, followUpResponses) {
const behaviorOptions = [
  "کیا آپ کا بچہ دوسرے بچوں کے ساتھ کھیلتا ہے؟",
  "کیا آپ کا بچہ دوسرے بچوں سے بات کرتا ہے؟",
  "کیا آپ کا بچہ بڑبڑاتا ہے یا آوازیں نکالتا ہے؟",
  "کیا آپ کا بچہ دوسرے بچوں کو دیکھتا ہے؟",
  "کیا آپ کا بچہ دوسرے بچوں پر مسکراتا ہے؟",
  "کیا آپ کا بچہ پہلے شرماتا ہے پھر مسکراتا ہے؟",
  "کیا آپ کا بچہ دوسرے بچوں کو دیکھ کر پرجوش ہوتا ہے؟"
];

// If main answer is Yes
if (mainResponse === "Yes") {
  // Check if interested in non-siblings
  const nonSiblingInterest = followUpResponses["کیا وہ اپنے بھائی یا بہن کے علاوہ دوسرے بچوں میں دلچسپی لیتا/لیتی ہے؟"];
  if (nonSiblingInterest === true) {
    return true; // Direct PASS if interested in non-siblings
  }
}

// Common path for both Yes/No main responses
const playgroundResponse = followUpResponses["جب آپ کھیل کے میدان یا سپر مارکیٹ میں ہوتے ہیں، تو کیا آپ کا بچہ عام طور پر دوسرے بچوں کے ساتھ تعامل کرتا ہے؟"];

if (!playgroundResponse) {
  return false; // FAIL if doesn't respond at playground/supermarket
}

// Check if any behavior option is marked as true
const hasAnyBehavior = behaviorOptions.some(behavior => 
  followUpResponses[behavior] === true
);

// PASS if they show any positive behavior, regardless of frequency
return hasAnyBehavior;
}
// ################################################
// static evaluate_response_8(mainResponse, followUpResponses, frequencyCheck = false) {
//   if (mainResponse === "Yes") {
//     return !!followUpResponses["interested_in_non_siblings"];
//   } else if (mainResponse === "No") {
//     if (followUpResponses["responds_to_others"]) {
//       const behaviors = [
//         "play_with_another_child",
//         "talk_to_another_child",
//         "babble_or_make_vocal_noises",
//         "watch_another_child",
//         "smile_at_another_child",
//         "act_shy_then_smile",
//         "get_excited_about_another_child",
//       ];
//       const hasBehaviors = behaviors.some(
//         (behavior) => followUpResponses[behavior]
//       );

//       return hasBehaviors && frequencyCheck;
//     }
//     return false;
//   }
//   return true; // Default to FAIL
// }


/**
 * Custom logic for Question 9
 * @param {string} mainResponse - User's main response (Yes/No)
 * @param {object} followUpResponses - Follow-up responses as a dictionary
 * @returns {boolean} - "PASS" or "FAIL"
 */
static evaluate_response_9(mainResponse, followUpResponses) {
  
    const items = [
      "کیا وہ آپ کو دکھانے کے لیے کوئی تصویر یا کھلونا دکھاتا/دکھاتی ہے؟",
      "کیا وہ اپنی بنائی ہوئی ڈرائنگ دکھاتا/دکھاتی ہے؟",
      "کیا وہ اپنے چنے ہوئے پھول دکھاتا/دکھاتی ہے؟",
      "کیا وہ گھاس میں ملے ہوئے کیڑے دکھاتا/دکھاتی ہے؟",
      "کیا وہ اپنے جوڑے ہوئے بلاکس دکھاتا/دکھاتی ہے؟",
    ];
    const bringsItem = items.some((item) => followUpResponses[item]);

    return bringsItem ? true : false;
 
}

static evaluate_response_10(mainResponse, followUpResponses, primaryBehavior = null) {
  const passExamples = [
    "کیا وہ پکارنے پر اوپر دیکھتا/دیکھتی ہے؟",
    "کیا وہ جواب میں بات کرتا/کرتی ہے یا بڑبڑاتا/بڑبڑاتی ہے؟",
    "کیا وہ اپنے نام سے پکارنے پر اپنی سرگرمی روک دیتا/دیتی ہے؟",
    
  ];

  const failExamples = [
    "کیا وہ پکارنے پر آپ کو نظرانداز کرتا/کرتی ہے؟",
    "کیا وہ صرف آپ کے سامنے ہونے پر ہی جواب دیتا/دیتی ہے؟",
    "کیا وہ صرف چھونے پر ہی جواب دیتا/دیتی ہے؟",
  ];

  // Count pass and fail responses
  const passCount = passExamples.reduce((count, example) => 
    followUpResponses[example] === true ? count + 1 : count, 0
  );

  const failCount = failExamples.reduce((count, example) => 
    followUpResponses[example] === true ? count + 1 : count, 0
  );

  // If equal counts, return based on main response
  if (passCount === failCount) {
    return mainResponse === "Yes";
  }

  // Return based on which count is higher
  return passCount > failCount;
}


 // Custom logic for Question 11
 static evaluate_response_11(mainResponse, followUpResponses) {
 
  // If main response is Yes, direct PASS
if (mainResponse === "Yes") {
  return true;
}

// For No response, evaluate follow-up answers
const passExamples = [
  "کیا آپ کا بچہ آپ کے مسکرانے پر مسکراتا/مسکراتی ہے؟",
  "کیا آپ کا بچہ جب آپ کمرے میں داخل ہوتے ہیں تو مسکراتا/مسکراتی ہے؟",
  "کیا آپ کا بچہ جب آپ باہر سے واپس آتے ہیں تو مسکراتا/مسکراتی ہے؟",
];

const failExamples = [
  "کیا وہ ہمیشہ مسکراتا/مسکراتی رہتا/رہتی ہے؟",
  "کیا وہ کسی پسندیدہ کھلونے یا سرگرمی پر مسکراتا/مسکراتی ہے؟",
  "کیا وہ بغیر کسی خاص وجہ کے یا بے ترتیب طور پر مسکراتا/مسکراتی ہے؟",
];

// Count pass and fail responses
const passCount = passExamples.reduce((count, example) => 
  followUpResponses[example] === true ? count + 1 : count, 0
);

const failCount = failExamples.reduce((count, example) => 
  followUpResponses[example] === true ? count + 1 : count, 0
);

// If equal counts and main response was No, return FAIL
if (passCount === failCount) {
  return false;
}

// Return based on which count is higher
return passCount > failCount;
}

// Custom logic for Question 12
static evaluate_response_12(mainResponse, followUpResponses) {
  if (mainResponse === "No") {
    return true;
  }

  // Count negative reactions
  const negativeReactions = [
    "کیا آپ کے بچے کو واشنگ مشین سے منفی رد عمل ہوتا ہے؟",
    "کیا آپ کے بچے کو بچوں کے رونے سے منفی رد عمل ہوتا ہے؟",
    "کیا آپ کے بچے کو ویکیوم کلینر سے منفی رد عمل ہوتا ہے؟",
    "کیا آپ کے بچے کو ہیئر ڈرائر سے منفی رد عمل ہوتا ہے؟",
    "کیا آپ کے بچے کو ٹریفک سے منفی رد عمل ہوتا ہے؟",
    "کیا آپ کے بچے کو بچوں کے چیخنے یا چلانے سے منفی رد عمل ہوتا ہے؟",
    "کیا آپ کے بچے کو تیز موسیقی سے منفی رد عمل ہوتا ہے؟",
    "کیا آپ کے بچے کو ٹیلیفون/دروازے کی گھنٹی بجنے سے منفی رد عمل ہوتا ہے؟",
    "کیا آپ کے بچے کو شور والی جگہوں جیسے سپر مارکیٹ یا ریستوران سے منفی رد عمل ہوتا ہے؟"
  ];

  const reactionCount = negativeReactions.reduce((count, reaction) => 
    followUpResponses[reaction] === true ? count + 1 : count, 0
  );

  // Pass if one or fewer negative reactions
  if (reactionCount <= 1) {
    return true;
  }

  // If more than one negative reaction, evaluate reaction types
  const passReactions = [
    "کیا آپ کا بچہ زیادہ تر وقت پرسکون رہتا ہے؟",
    "کیا آپ کا بچہ شور سے جلدی سنبھل جاتا ہے؟",
    "کیا آپ کا بچہ شور سے دور جانے کی کوشش کرتا ہے؟"
  ];

  const failReactions = [
    "کیا آپ کا بچہ جارحانہ ہو جاتا ہے؟",
    "کیا آپ کے بچے کو غصے کا دورہ پڑتا ہے؟",
    "کیا آپ کے بچے کو پرسکون ہونے میں طویل وقت لگتا ہے؟"
  ];

  const passCount = passReactions.reduce((count, reaction) => 
    followUpResponses[reaction] === true ? count + 1 : count, 0
  );

  const failCount = failReactions.reduce((count, reaction) => 
    followUpResponses[reaction] === true ? count + 1 : count, 0
  );

  // If counts are equal, return FAIL
  if (passCount === failCount) {
    return false;
  }

  // Return PASS if more pass reactions than fail reactions
  return passCount > failCount;
}

// Custom logic for Question 13
static evaluate_response_13(mainResponse, followUpResponses) {
  // Define the main question and follow-up question prompts
  const mainPrompt = "کیا آپ کا بچہ بغیر کسی سہارے کے چل پاتا ہے؟";
  if (mainResponse === "Yes") {
    return true; // FAIL if the main response is "No"
  }
  return false; // PASS if follow-up response is "Yes", otherwise FAIL
}

// Custom logic for Question 14
static evaluate_response_14(mainResponse, followUpResponses) {
  const followUpQuestions = [
    "کیا آپ کا بچہ جب اسے کچھ چاہیے ہوتا ہے تو آپ کی آنکھوں میں دیکھتا ہے؟",
    "کیا آپ کا بچہ جب آپ اس کے ساتھ کھیلتے ہیں تو آپ کی آنکھوں میں دیکھتا ہے؟",
    "کیا آپ کا بچہ کھانا کھاتے وقت آپ کی آنکھوں میں دیکھتا ہے؟",
    "کیا آپ کا بچہ نیپی تبدیل کرتے وقت آپ کی آنکھوں میں دیکھتا ہے؟",
    "کیا آپ کا بچہ جب آپ اسے کہانی پڑھتے ہیں تو آپ کی آنکھوں میں دیکھتا ہے؟",
    "کیا آپ کا بچہ جب آپ اس سے بات کرتے ہیں تو آپ کی آنکھوں میں دیکھتا ہے؟",
  ];

  // Count yes responses to follow-up questions
  const yesCount = followUpQuestions.reduce((count, question) => 
    followUpResponses[question] === true ? count + 1 : count, 0
  );

  // If 2 or more yes responses, it's a pass
  if (yesCount >= 2) {
    return true;
  }

  // If all responses are no, it's a fail
  if (yesCount === 0) {
    return false;
  }

  // If exactly one yes response, use main response as tiebreaker
  if (yesCount === 1) {
    return mainResponse === "Yes";
  }

  return false; // Default to fail
}

static evaluate_response_15(mainResponse, followUpResponses) {
  const followUpQuestions = [
    "کیا آپ کا بچہ آپ کی نقل کرنے کی کوشش کرتا ہے اگر آپ اپنی زبان باہر نکالیں؟",
    "کیا آپ کا بچہ آپ کی نقل کرنے کی کوشش کرتا ہے اگر آپ تالیاں بجائیں؟",
    "کیا آپ کا بچہ آپ کی نقل کرنے کی کوشش کرتا ہے اگر آپ ہاتھ ہلا کر الوداع کہیں؟",
    "کیا آپ کا بچہ آپ کی نقل کرنے کی کوشش کرتا ہے اگر آپ مزاحیہ آواز نکالیں؟",
    "کیا آپ کا بچہ آپ کی نقل کرنے کی کوشش کرتا ہے اگر آپ بوسہ پھینکیں؟",
    "کیا آپ کا بچہ آپ کی نقل کرنے کی کوشش کرتا ہے اگر آپ 'چپ' کا اشارہ کرنے کے لیے اپنی انگلیاں ہونٹوں پر رکھیں؟",
  ];

  // Count yes responses to follow-up questions
  const yesCount = followUpQuestions.reduce((count, question) => 
    followUpResponses[question] === true ? count + 1 : count, 0
  );

  // Pass if more than 1 yes response, fail otherwise
  return yesCount > 1;
}

static evaluate_response_16(mainResponse, followUpResponses) {
  // Direct pass if main response is Yes
  if (mainResponse === "Yes") {
    return true;
  }

  // For No response, evaluate follow-up answers
  const passExamples = [
    // پاس کی مثالیں
    "کیا آپ کا بچہ اس چیز کی طرف دیکھتا ہے جسے آپ دیکھ رہے ہیں؟",
    "کیا آپ کا بچہ اس چیز کی طرف اشارہ کرتا ہے جسے آپ دیکھ رہے ہیں؟",
    "کیا آپ کا بچہ یہ دیکھنے کے لیے اِدھر اُدھر دیکھتا ہے کہ آپ کیا دیکھ رہے ہیں؟",
  ];

  const failExamples = [
    // فیل کی مثالیں
    "کیا آپ کا بچہ آپ کے چہرے کی طرف دیکھتا ہے؟",
    "کیا آپ کا بچہ آپ کو نظرانداز کرتا ہے؟",  
  ];

  // Count pass and fail responses
  const passCount = passExamples.reduce((count, example) => 
    followUpResponses[example] === true ? count + 1 : count, 0
  );

  const failCount = failExamples.reduce((count, example) => 
    followUpResponses[example] === true ? count + 1 : count, 0
  );

  // If counts are equal, return FAIL since main response was No
  if (passCount === failCount) {
    return false;
  }

  // Return PASS if more pass examples than fail examples
  return passCount > failCount;
}

static evaluate_response_17(mainResponse, followUpResponses) {
  const followUpQuestions = [
    "کیا آپ کا بچہ کہتا ہے 'دیکھو!' یا 'مجھے دیکھو!'؟",
    "کیا آپ کا بچہ آپ کو اس کی سرگرمی دیکھنے کے لیے بڑبڑاتا ہے یا آواز نکالتا ہے؟",
    "کیا آپ کا بچہ تعریف یا تبصرہ حاصل کرنے کے لیے آپ کی طرف دیکھتا ہے؟",
    "کیا آپ کا بچہ یہ دیکھنے کے لیے بار بار آپ کی طرف دیکھتا رہتا ہے کہ آیا آپ اسے دیکھ رہے ہیں؟"
  ];

  // Count yes responses to follow-up questions
  const yesCount = followUpQuestions.reduce((count, question) => 
    followUpResponses[question] === true ? count + 1 : count, 0
  );

  // Pass if more than 1 yes response, fail otherwise
  return yesCount > 0;
}
static evaluate_response_18(mainResponse, followUpResponses) {
  const followUpQuestions = [
    "جب آپ باہر جانے کے لیے تیار ہوں اور آپ اپنے بچے کو اس کے جوتے لانے کو کہیں، تو کیا وہ سمجھتا ہے؟",
    "اگر رات کے کھانے کا وقت ہو اور کھانا میز پر ہو، اور آپ بچے کو بیٹھنے کو کہیں، تو کیا وہ میز پر آ کر بیٹھ جاتا ہے؟",
    "اگر آپ اشارہ کیے بغیر، کوئی حرکت کیے بغیر، یا کوئی اشارہ دیے بغیر کہیں 'مجھے اپنا جوتا دکھاؤ' (جب آپ باہر نہیں جا رہے ہیں یا تیار نہیں ہو رہے ہیں)، تو کیا آپ کا بچہ آپ کو اپنا جوتا دکھاتا ہے؟",
    "اگر آپ اشارہ کیے بغیر، کوئی حرکت کیے بغیر، یا کوئی اشارہ دیے بغیر کسی اور چیز کو مانگیں، تو کیا آپ کا بچہ اسے آپ کے پاس لاتا ہے؟",
    "اگر آپ اشارہ کیے بغیر، کوئی حرکت کیے بغیر، یا کوئی اور اشارہ دیے بغیر کہیں 'کتاب کرسی پر رکھو'، تو کیا آپ کا بچہ کتاب کرسی پر رکھتا ہے؟",
  ];

  // Count yes responses to follow-up questions
  const yesCount = followUpQuestions.reduce((count, question) => 
    followUpResponses[question] === true ? count + 1 : count, 0
  );

  // Pass if more than 1 yes response, fail otherwise
  return yesCount > 1;
}
static evaluate_response_19(mainResponse, followUpResponses) {
  // Direct pass if main response is Yes
  if (mainResponse === "Yes") {
    return true;
  }
  const followUpQuestions = [
    "اگر آپ کا بچہ کوئی عجیب یا ڈراؤنی آواز سنتا ہے، تو کیا وہ جواب دینے سے پہلے آپ کی طرف دیکھتا ہے؟",
    "کیا آپ کا بچہ آپ کی طرف دیکھتا ہے جب کوئی نیا شخص قریب آتا ہے؟",
    "کیا آپ کا بچہ آپ کی طرف دیکھتا ہے جب اسے کسی غیر مانوس یا تھوڑا ڈراؤنی چیز کا سامنا ہوتا ہے؟",
  ];

  // Count yes responses to follow-up questions
  const yesCount = followUpQuestions.reduce((count, question) => 
    followUpResponses[question] === true ? count + 1 : count, 0
  );

  // Pass if more than 1 yes response, fail otherwise
  return yesCount > 0;
}

static evaluate_response_20(mainResponse, followUpResponses) {
  // Direct pass if main response is Yes
  if (mainResponse === "Yes") {
    return true;
  }
  const followUpQuestions = [
    "کیا آپ کا بچہ ہنستا ہے یا مسکراتا ہے؟",
    "کیا آپ کا بچہ بات کرتا ہے یا بڑبڑاتا ہے؟",
    "کیا آپ کا بچہ اپنے بازو پھیلا کر مزید کی درخواست کرتا ہے؟"
  ];

  // Count yes responses to follow-up questions
  const yesCount = followUpQuestions.reduce((count, question) => 
    followUpResponses[question] === true ? count + 1 : count, 0
  );

  // Pass if more than 1 yes response, fail otherwise
  return yesCount > 0;
}

}


module.exports = QuestionLogic;