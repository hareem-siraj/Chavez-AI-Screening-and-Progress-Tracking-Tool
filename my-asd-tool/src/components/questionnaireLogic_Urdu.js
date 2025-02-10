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

    const passExamples = [ "کیا وہ اپنے ہاتھوں کو دیکھتا/دیکھتی ہے؟",
        "کیا وہ چھپن چھپائی کھیلتے وقت اپنی انگلیوں کو ہلاتا/ہلاتی ہے؟",];
    const failExamples = [
        "کیا وہ اپنے ہاتھوں کو دیکھتا/دیکھتی ہے؟",
        "کیا وہ چھپن چھپائی کھیلتے وقت اپنی انگلیوں کو ہلاتا/ہلاتی ہے؟",
        "کیا وہ اپنی انگلیوں کو اپنی آنکھوں کے قریب ہفتے میں دو سے زیادہ بار ہلاتا/ہلاتی ہے؟",
        "کیا وہ اپنے ہاتھوں کو اپنی آنکھوں کے قریب ہفتے میں دو سے زیادہ بار رکھتا/رکھتی ہے؟",
        "کیا وہ اپنے ہاتھوں کو اپنی آنکھوں کے سائیڈ پر ہفتے میں دو سے زیادہ بار رکھتا/رکھتی ہے؟",
        "کیا وہ اپنے چہرے کے قریب ہاتھ ہلاتا/ہلاتی ہے ہفتے میں دو سے زیادہ بار؟",
    ];

    const hasPass = passExamples.some((example) => followUpResponses[example]);
    const hasFail = failExamples.some((example) => followUpResponses[example]);
    if (hasPass && !hasFail) {
      return true; // PASS if only pass examples
    }
    return false; // Default to FAIL
    


    // if (hasFail) {
    //   return frequencyCheck ? false : true; // false for FAIL, true for PASS
    // }

    // return hasPass ? true : false; // true for PASS, false for FAIL
  }
  //  /**
  //  * Custom logic for Question 6
  //  * @param {string} mainResponse - User's main response (Yes/No)
  //  * @param {object} followUpResponses - Follow-up responses as a dictionary
  //  * @param {string} showMeResponse - Response to the "Show me" prompt (Yes/No)
  //  * @returns {boolean} - "PASS" or "FAIL"
  //  */
  //  static evaluate_response_6(mainResponse, followUpResponses, showMeResponse) {
  //   if (mainResponse === "Yes") {
  //     return true;
  //   } else if (mainResponse === "No") {
  //     const alternativeBehaviors = [
  //       "reach_with_whole_hand",
  //       "lead_to_object",
  //       "try_to_get",
  //       "use_words_or_sounds",
  //     ];
  //     const hasAlternative = alternativeBehaviors.some(
  //       (behavior) => followUpResponses[behavior]
  //     );

  //     return hasAlternative && showMeResponse === "Yes" ? true : false;
  //   }
  //   return false;
  // }

  static evaluate_response_6(mainResponse, followUpResponses, showMeResponse) {
    if (mainResponse === "Yes") {
      return true;
    } 
    else if (mainResponse === "No") {
      const alternativeBehaviors = [
        "کیا وہ اپنے پورے ہاتھ کے ساتھ چیز کی طرف پہنچتا/پہنچتی ہے؟",
        "کیا وہ آپ کو چیز کی طرف لے جاتا/جاتی ہے؟",
        "کیا وہ خود کے لئے چیز حاصل کرنے کی کوشش کرتا/کرتی ہے؟",
        "کیا وہ الفاظ یا آوازوں کا استعمال کر کے اسے مانگتا/مانگتی ہے؟",
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
        "آسمان میں ہوائی جہاز؟",
        "سڑک پر ٹرک؟",
        "زمین پر کیڑا؟",
        "صحن میں کوئی جانور؟",
      ];
      const pointsToInterest = interests.some(
        (interest) => followUpResponses[interest]
      );

      if (pointsToInterest) {
        return  true;
      }
      return false;
    
  }

  // /**
  //  * Custom logic for Question 8
  //  * @param {string} mainResponse - User's main response (Yes/No)
  //  * @param {object} followUpResponses - Follow-up responses as a dictionary
  //  * @param {boolean} [frequencyCheck=false] - Determines if the child responds to others more than half the time
  //  * @returns {boolean} - "PASS" or "FAIL"
  //  */
  // static evaluate_response_8(mainResponse, followUpResponses, frequencyCheck = false) {
  //   if (mainResponse === "Yes") {
  //     return followUpResponses["interested_in_non_siblings"] ? true : false;
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

  //       return hasBehaviors && frequencyCheck ? true : false;
  //     }
  //     return false;
  //   }
  //   return false;
  // }
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
        "کیا وہ آپ کو صرف دکھانے کے لئے تصویر یا کھلونا لاتا/لاتی ہے؟",
                    "کیا وہ اپنی بنائی ہوئی کوئی ڈرائنگ دکھاتا/دکھاتی ہے؟",
                    "کیا وہ آپ کو اپنے چنے ہوئے پھول دکھاتا/دکھاتی ہے؟",
                    "کیا وہ گھاس میں پائے ہوئے کسی کیڑے کو دکھاتا/دکھاتی ہے؟",
                    "کیا وہ چند بلاکس جوڑ کر آپ کو دکھاتا/دکھاتی ہے؟",
      ];
      const bringsItem = items.some((item) => followUpResponses[item]);

      return bringsItem ? true : false;
   
  }

  // /**
  //  * Custom logic for Question 10
  //  * @param {string} mainResponse - User's main response (Yes/No)
  //  * @param {object} followUpResponses - Follow-up responses as a dictionary
  //  * @param {string} [primaryBehavior] - Indicates whether PASS or FAIL behaviors are more frequent if both are present
  //  * @returns {boolean} - "PASS" or "FAIL"
  //  */
  // static evaluate_response_10(mainResponse, followUpResponses, primaryBehavior = null) {
  //   const passResponses = ["look_up", "talk_or_babble", "stop_activity"];
  //   const failResponses = [
  //     "make_no_response",
  //     "seem_to_ignore",
  //     "respond_only_if_in_front",
  //     "respond_only_if_touched",
  //   ];

  //   if (mainResponse === "Yes") {
  //     return passResponses.some((response) => followUpResponses[response])
  //       ? true
  //       : false;
  //   } else if (mainResponse === "No") {
  //     const hasPass = passResponses.some(
  //       (response) => followUpResponses[response]
  //     );
  //     const hasFail = failResponses.some(
  //       (response) => followUpResponses[response]
  //     );

  //     if (hasPass && !hasFail) {
  //       return true;
  //     } else if (hasFail && !hasPass) {
  //       return false;
  //     } else if (hasPass && hasFail) {
  //       return primaryBehavior === true ? true : false;
  //     }
  //     return false;
  //   }
  //   return false;
  // }
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