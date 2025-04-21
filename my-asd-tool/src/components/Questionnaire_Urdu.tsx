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
  ListItemText,
  AppBar, 
  Toolbar, 
  IconButton
} from "@mui/material";
import { Link } from "react-router-dom";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Home, Person, CheckCircle, Cancel, Logout, Lock, CenterFocusStrong} from "@mui/icons-material";
// import QuestionAnswer from '@mui/icons-material/QuestionAnswer';
// import Assessment from '@mui/icons-material/Assessment';
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import styles from "../theme/QuestionnairePage.module.css";
import { setFinalScore } from "./redux/store"; // Import the action
import { setSessionIds } from "./redux/store";
import logoImage from "../assets/logo.png"; 
// import { keyframes } from '@mui/system';

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
    localStorage.removeItem("sessionData"); // Clear stored session
    localStorage.removeItem("selectedChildId"); // Clear child profile data
    localStorage.clear(); // Remove all stored data
    sessionStorage.clear();
    window.location.href = "/sign-in"; // Redirect to login page
  };

  const handleProfileSelection = () => {
    dispatch(setSessionIds({ SessionID: null, QuestionnaireID: null, GameSessionID: null, ReportID: null }));
    localStorage.removeItem("sessionData"); // Clear stored session
    localStorage.removeItem("selectedChildId"); // Clear child profile data
    localStorage.clear(); // Clear all stored data
    sessionStorage.clear();
    navigate("/profile-selection"); // Fallback in case userId is missing
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      setQuestions([
        {
          id: 1,
          text: "اگر آپ کمرے میں کسی چیز کی طرف اشارہ کرتے ہیں تو کیا بچہ اس کی طرف دیکھتا ہے؟ (مثال کے طور پر، اگر آپ کسی کھلونے یا جانور کی طرف اشارہ کرتے ہیں، تو کیا آپ کا بچہ اس کھلونے یا جانور کی طرف دیکھتا ہے؟)",
          followUps: {
            yes: [
              "کیا وہ چیز کی طرف دیکھتا/دیکھتی ہے؟",
              "کیا وہ چیز کی طرف اشارہ کرتا/کرتی ہے؟",
              "کیا وہ چیز کو دیکھ کر تبصرہ کرتا/کرتی ہے؟",
              "کیا وہ آپ کے اشارہ کرنے اور کہنے پر 'دیکھو' دیکھتا/دیکھتی ہے؟",
              "کیا وہ آپ کو نظر انداز کرتا/کرتی ہے؟",
              "کیا وہ کمرے کے اردگرد بے ترتیب طور پر دیکھتا/دیکھتی ہے؟",
              "کیا وہ آپ کی انگلی کو دیکھتا/دیکھتی ہے؟",
            ],
            no: [
              "کیا وہ چیز کی طرف دیکھتا/دیکھتی ہے؟",
              "کیا وہ چیز کی طرف اشارہ کرتا/کرتی ہے؟",
              "کیا وہ چیز کو دیکھ کر تبصرہ کرتا/کرتی ہے؟",
              "کیا وہ آپ کے اشارہ کرنے اور کہنے پر 'دیکھو' دیکھتا/دیکھتی ہے؟",
              "کیا وہ آپ کو نظر انداز کرتا/کرتی ہے؟",
              "کیا وہ کمرے کے اردگرد بے ترتیب طور پر دیکھتا/دیکھتی ہے؟",
              "کیا وہ آپ کی انگلی کو دیکھتا/دیکھتی ہے؟",
            ],
          },
        },
        {
          id: 2,
          text: "کیا آپ کبھی یہ سوچتے ہیں کہ آپ کا بچہ بہرا ہے؟",
          followUps: {
            yes: [
              "کیا وہ اکثر آوازوں کو نظرانداز کرتا/کرتی ہے؟",
              "کیا وہ اکثر لوگوں کو نظرانداز کرتا/کرتی ہے؟",
            ],
            no: [],
          },
        },
        {
          id: 3,
          text: "کیا آپ کا بچہ دکھاوا یا خیالی کھیل کھیلتا ہے؟ (مثال کے طور پر، خالی کپ سے پینے کا دکھاوا کرنا، فون پر بات کرنے کا دکھاوا کرنا، یا گڑیا یا کھلونا جانور کو کھانا کھلانے کا دکھاوا کرنا؟)",
          followUps: {
            yes: [
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
            ],
            no: [
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
            ],
          },
        },
        {
          id: 4,
          text: "کیا آپ کے بچے کو چیزوں پر چڑھنا پسند ہے؟ (مثال کے طور پر، فرنیچر، جھولے کا سامان، یا سیڑھیاں)",
          followUps: {
            yes: [
              "کیا اسے/اسے سیڑھیوں پر چڑھنا پسند ہے؟",
              "کیا اسے/اسے کرسیوں پر چڑھنا پسند ہے؟",
              "کیا اسے/اسے فرنیچر پر چڑھنا پسند ہے؟",
              "کیا اسے/اسے جھولے کے سامان پر چڑھنا پسند ہے؟",
            ],
            no: [
              "کیا اسے/اسے سیڑھیوں پر چڑھنا پسند ہے؟",
              "کیا اسے/اسے کرسیوں پر چڑھنا پسند ہے؟",
              "کیا اسے/اسے فرنیچر پر چڑھنا پسند ہے؟",
              "کیا اسے/اسے جھولے کے سامان پر چڑھنا پسند ہے؟",
            ],
          },
        },
        {
          id: 5,
          text: "کیا آپ کا بچہ اپنی آنکھوں کے قریب انگلیوں کی غیر معمولی حرکات کرتا ہے؟ (مثال کے طور پر، کیا آپ کا بچہ اپنی انگلیوں کو اپنی آنکھوں کے قریب ہلاتا ہے؟)",
          followUps: {
            yes: [
             "کیا وہ اپنے ہاتھوں کو دیکھتا/دیکھتی ہے؟",
              "کیا وہ آنکھ مچولی کھیلتے وقت اپنی انگلیاں ہلاتا/ہلاتی ہے؟",
              "کیا وہ ہفتے میں دو بار سے زیادہ اپنی انگلیوں کو اپنی آنکھوں کے قریب ہلاتا/ہلاتی ہے؟",
              "کیا وہ ہفتے میں دو بار سے زیادہ اپنے ہاتھوں کو اپنی آنکھوں کے قریب رکھتا/رکھتی ہے؟",
              "کیا وہ ہفتے میں دو بار سے زیادہ اپنے ہاتھوں کو اپنی آنکھوں کے کنارے رکھتا/رکھتی ہے؟",
              "کیا وہ ہفتے میں دو بار سے زیادہ اپنے ہاتھوں کو اپنے چہرے کے قریب پھڑپھڑاتا/پھڑپھڑاتی ہے؟",
            ],
            no: [],
          },
        },
        {
          id: 6,
          text: "کیا آپ کا بچہ کسی ایسی چیز کو مانگنے کے لیے ایک انگلی سے اشارہ کرتا ہے جو اس کی پہنچ سے باہر ہو یا مدد حاصل کرنے کے لیے؟",
          followUps: {
            yes: [
              "کیا وہ چیز کو اپنے پورے ہاتھ سے پکڑنے کی کوشش کرتا/کرتی ہے؟",
              "کیا وہ آپ کو اس چیز کی طرف لے جاتا/جاتی ہے؟",
              "کیا وہ خود اس چیز کو حاصل کرنے کی کوشش کرتا/کرتی ہے؟",
              "کیا وہ الفاظ یا آوازوں کا استعمال کرکے اسے مانگتا/مانگتی ہے؟",

            ],
            no: []
          }
        },
        {
          id: 7,
          text: "کیا آپ کا بچہ کبھی کبھی دلچسپ چیزوں کی طرف مدد مانگنے کے بجائے صرف دکھانے کے لیے ایک انگلی سے اشارہ کرتا ہے؟",
          followUps: {
            yes: [
              "آسمان میں ہوائی جہاز کی طرف؟",
              "سڑک پر ٹرک کی طرف؟",
              "زمین پر کیڑے کی طرف؟",
              "آنگن میں جانور کی طرف؟",
            ],
            no: [
              "آسمان میں ہوائی جہاز کی طرف؟",
              "سڑک پر ٹرک کی طرف؟",
              "زمین پر کیڑے کی طرف؟",
              "آنگن میں جانور کی طرف؟",
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
          text: "کیا آپ کا بچہ دوسرے بچوں میں دلچسپی لیتا ہے؟ (مثال کے طور پر، کیا آپ کا بچہ انہیں دیکھتا ہے، ان پر مسکراتا ہے، یا ان کے پاس جاتا ہے؟)",
          followUps: { yes: [], no: [] } // Empty arrays for dynamic follow-ups
          // ##################################
        },
        {
          id: 9,
          text: "کیا آپ کا بچہ آپ کو چیزیں دکھانے کے لیے انہیں آپ کے پاس لاتا ہے یا آپ کو دکھانے کے لیے اٹھا کر رکھتا ہے؟ صرف مدد حاصل کرنے کے لیے نہیں، بلکہ شیئر کرنے کے لیے؟",
          followUps: {
            yes: [
              "کیا وہ آپ کو دکھانے کے لیے کوئی تصویر یا کھلونا دکھاتا/دکھاتی ہے؟",
              "کیا وہ اپنی بنائی ہوئی ڈرائنگ دکھاتا/دکھاتی ہے؟",
              "کیا وہ اپنے چنے ہوئے پھول دکھاتا/دکھاتی ہے؟",
              "کیا وہ گھاس میں ملے ہوئے کیڑے دکھاتا/دکھاتی ہے؟",
              "کیا وہ اپنے جوڑے ہوئے بلاکس دکھاتا/دکھاتی ہے؟",
            ],
            no: [
              "کیا وہ آپ کو دکھانے کے لیے کوئی تصویر یا کھلونا دکھاتا/دکھاتی ہے؟",
              "کیا وہ اپنی بنائی ہوئی ڈرائنگ دکھاتا/دکھاتی ہے؟",
              "کیا وہ اپنے چنے ہوئے پھول دکھاتا/دکھاتی ہے؟",
              "کیا وہ گھاس میں ملے ہوئے کیڑے دکھاتا/دکھاتی ہے؟",
              "کیا وہ اپنے جوڑے ہوئے بلاکس دکھاتا/دکھاتی ہے؟",
            ]
          }
        },
        {
          id: 10,
          text: "کیا آپ کا بچہ اپنے نام سے پکارنے پر جواب دیتا ہے؟ (مثال کے طور پر، کیا آپ کا بچہ اوپر دیکھتا ہے، بات کرتا ہے، یا جو کچھ وہ کر رہا ہے اسے روک دیتا ہے؟)",
          followUps: {
            yes: [
              "کیا وہ پکارنے پر اوپر دیکھتا/دیکھتی ہے؟",
              "کیا وہ جواب میں بات کرتا/کرتی ہے یا بڑبڑاتا/بڑبڑاتی ہے؟",
              "کیا وہ اپنے نام سے پکارنے پر اپنی سرگرمی روک دیتا/دیتی ہے؟",
              "کیا وہ پکارنے پر آپ کو نظرانداز کرتا/کرتی ہے؟",
              "کیا وہ صرف آپ کے سامنے ہونے پر ہی جواب دیتا/دیتی ہے؟",
              "کیا وہ صرف چھونے پر ہی جواب دیتا/دیتی ہے؟",
            ],
            no: [
              "کیا وہ پکارنے پر اوپر دیکھتا/دیکھتی ہے؟",
              "کیا وہ جواب میں بات کرتا/کرتی ہے یا بڑبڑاتا/بڑبڑاتی ہے؟",
              "کیا وہ اپنے نام سے پکارنے پر اپنی سرگرمی روک دیتا/دیتی ہے؟",
              "کیا وہ پکارنے پر آپ کو نظرانداز کرتا/کرتی ہے؟",
              "کیا وہ صرف آپ کے سامنے ہونے پر ہی جواب دیتا/دیتی ہے؟",
              "کیا وہ صرف چھونے پر ہی جواب دیتا/دیتی ہے؟",
            ]
          }
        },
        {
          id: 11,
          text: "جب آپ اپنے بچے پر مسکراتے ہیں، تو کیا وہ آپ کی طرف دیکھ کر مسکراتا/مسکراتی ہے؟",
          followUps: {
            yes: [],
            no: [
              "کیا آپ کا بچہ آپ کے مسکرانے پر مسکراتا/مسکراتی ہے؟",
              "کیا آپ کا بچہ جب آپ کمرے میں داخل ہوتے ہیں تو مسکراتا/مسکراتی ہے؟",
              "کیا آپ کا بچہ جب آپ باہر سے واپس آتے ہیں تو مسکراتا/مسکراتی ہے؟",
              "کیا وہ ہمیشہ مسکراتا/مسکراتی رہتا/رہتی ہے؟",
              "کیا وہ کسی پسندیدہ کھلونے یا سرگرمی پر مسکراتا/مسکراتی ہے؟",
              "کیا وہ بغیر کسی خاص وجہ کے یا بے ترتیب طور پر مسکراتا/مسکراتی ہے؟",
            ]
          }
        },
        {
          id: 12,
          text: "کیا آپ کا بچہ روزمرہ کی آوازوں سے پریشان ہوتا ہے؟",
          followUps: { yes: [], no: [] } // Empty arrays for dynamic follow-ups
        },
        {
          id: 13,
          text: "کیا آپ کا بچہ بغیر کسی سہارے کے چل پاتا ہے؟",
          followUps: {
            yes: [
              // "Does he/she walk without holding on to anything?"
            ],
            no: []
          }
        },
        {
          id: 14,
          text: "کیا آپ کا بچہ جب آپ اس سے بات کرتے ہیں، اس کے ساتھ کھیلتے ہیں، یا اس کے کپڑے بدلتے ہیں تو آپ کی آنکھوں میں دیکھتا ہے؟",
          followUps: {
            yes: [
              "کیا آپ کا بچہ جب اسے کچھ چاہیے ہوتا ہے تو آپ کی آنکھوں میں دیکھتا ہے؟",
              "کیا آپ کا بچہ جب آپ اس کے ساتھ کھیلتے ہیں تو آپ کی آنکھوں میں دیکھتا ہے؟",
              "کیا آپ کا بچہ کھانا کھاتے وقت آپ کی آنکھوں میں دیکھتا ہے؟",
              "کیا آپ کا بچہ نیپی تبدیل کرتے وقت آپ کی آنکھوں میں دیکھتا ہے؟",
              "کیا آپ کا بچہ جب آپ اسے کہانی پڑھتے ہیں تو آپ کی آنکھوں میں دیکھتا ہے؟",
              "کیا آپ کا بچہ جب آپ اس سے بات کرتے ہیں تو آپ کی آنکھوں میں دیکھتا ہے؟",
            ],
            no: [
              "کیا آپ کا بچہ جب اسے کچھ چاہیے ہوتا ہے تو آپ کی آنکھوں میں دیکھتا ہے؟",
              "کیا آپ کا بچہ جب آپ اس کے ساتھ کھیلتے ہیں تو آپ کی آنکھوں میں دیکھتا ہے؟",
              "کیا آپ کا بچہ کھانا کھاتے وقت آپ کی آنکھوں میں دیکھتا ہے؟",
              "کیا آپ کا بچہ نیپی تبدیل کرتے وقت آپ کی آنکھوں میں دیکھتا ہے؟",
              "کیا آپ کا بچہ جب آپ اسے کہانی پڑھتے ہیں تو آپ کی آنکھوں میں دیکھتا ہے؟",
              "کیا آپ کا بچہ جب آپ اس سے بات کرتے ہیں تو آپ کی آنکھوں میں دیکھتا ہے؟",
            ]
          }
        },
        {
          id: 15,
          text: "کیا آپ کا بچہ آپ کی نقل کرنے کی کوشش کرتا ہے؟",
          followUps: {
            yes: [
              "کیا آپ کا بچہ آپ کی نقل کرنے کی کوشش کرتا ہے اگر آپ اپنی زبان باہر نکالیں؟",
              "کیا آپ کا بچہ آپ کی نقل کرنے کی کوشش کرتا ہے اگر آپ تالیاں بجائیں؟",
              "کیا آپ کا بچہ آپ کی نقل کرنے کی کوشش کرتا ہے اگر آپ ہاتھ ہلا کر الوداع کہیں؟",
              "کیا آپ کا بچہ آپ کی نقل کرنے کی کوشش کرتا ہے اگر آپ مزاحیہ آواز نکالیں؟",
              "کیا آپ کا بچہ آپ کی نقل کرنے کی کوشش کرتا ہے اگر آپ بوسہ پھینکیں؟",
              "کیا آپ کا بچہ آپ کی نقل کرنے کی کوشش کرتا ہے اگر آپ 'چپ' کا اشارہ کرنے کے لیے اپنی انگلیاں ہونٹوں پر رکھیں؟",
            ],
            no: [
              "کیا آپ کا بچہ آپ کی نقل کرنے کی کوشش کرتا ہے اگر آپ اپنی زبان باہر نکالیں؟",
              "کیا آپ کا بچہ آپ کی نقل کرنے کی کوشش کرتا ہے اگر آپ تالیاں بجائیں؟",
              "کیا آپ کا بچہ آپ کی نقل کرنے کی کوشش کرتا ہے اگر آپ ہاتھ ہلا کر الوداع کہیں؟",
              "کیا آپ کا بچہ آپ کی نقل کرنے کی کوشش کرتا ہے اگر آپ مزاحیہ آواز نکالیں؟",
              "کیا آپ کا بچہ آپ کی نقل کرنے کی کوشش کرتا ہے اگر آپ بوسہ پھینکیں؟",
              "کیا آپ کا بچہ آپ کی نقل کرنے کی کوشش کرتا ہے اگر آپ 'چپ' کا اشارہ کرنے کے لیے اپنی انگلیاں ہونٹوں پر رکھیں؟",
            ]
  }
        },
        {
          id: 16,
          text: "اگر آپ کسی چیز کو دیکھنے کے لیے اپنا سر گھماتے ہیں، تو کیا آپ کا بچہ یہ دیکھنے کے لیے اِدھر اُدھر دیکھتا ہے کہ آپ کیا دیکھ رہے ہیں؟",
          followUps: {
            yes: [],  // No follow-ups needed for Yes response
            no: [
              // پاس کی مثالیں
              "کیا آپ کا بچہ اس چیز کی طرف دیکھتا ہے جسے آپ دیکھ رہے ہیں؟",
              "کیا آپ کا بچہ اس چیز کی طرف اشارہ کرتا ہے جسے آپ دیکھ رہے ہیں؟",
              "کیا آپ کا بچہ یہ دیکھنے کے لیے اِدھر اُدھر دیکھتا ہے کہ آپ کیا دیکھ رہے ہیں؟",
              // فیل کی مثالیں
              "کیا آپ کا بچہ آپ کے چہرے کی طرف دیکھتا ہے؟",
              "کیا آپ کا بچہ آپ کو نظرانداز کرتا ہے؟",
            ]
          }
        },
        {
          id: 17,
          text: "کیا آپ کا بچہ آپ کو اپنی طرف متوجہ کرنے کی کوشش کرتا ہے؟",
          followUps: {
            yes: [
              "کیا آپ کا بچہ کہتا ہے 'دیکھو!' یا 'مجھے دیکھو!'؟",
              "کیا آپ کا بچہ آپ کو اس کی سرگرمی دیکھنے کے لیے بڑبڑاتا ہے یا آواز نکالتا ہے؟",
              "کیا آپ کا بچہ تعریف یا تبصرہ حاصل کرنے کے لیے آپ کی طرف دیکھتا ہے؟",
              "کیا آپ کا بچہ یہ دیکھنے کے لیے بار بار آپ کی طرف دیکھتا رہتا ہے کہ آیا آپ اسے دیکھ رہے ہیں؟"
            ],
 
            no: [
              "کیا آپ کا بچہ کہتا ہے 'دیکھو!' یا 'مجھے دیکھو!'؟",
              "کیا آپ کا بچہ آپ کو اس کی سرگرمی دیکھنے کے لیے بڑبڑاتا ہے یا آواز نکالتا ہے؟",
              "کیا آپ کا بچہ تعریف یا تبصرہ حاصل کرنے کے لیے آپ کی طرف دیکھتا ہے؟",
              "کیا آپ کا بچہ یہ دیکھنے کے لیے بار بار آپ کی طرف دیکھتا رہتا ہے کہ آیا آپ اسے دیکھ رہے ہیں؟"
            ]
          }
        },
        {
          id: 18,
          text: "کیا آپ کا بچہ سمجھتا ہے جب آپ اسے کچھ کرنے کو کہتے ہیں؟",
          followUps: {
            yes: [
              "جب آپ باہر جانے کے لیے تیار ہوں اور آپ اپنے بچے کو اس کے جوتے لانے کو کہیں، تو کیا وہ سمجھتا ہے؟",
              "اگر رات کے کھانے کا وقت ہو اور کھانا میز پر ہو، اور آپ بچے کو بیٹھنے کو کہیں، تو کیا وہ میز پر آ کر بیٹھ جاتا ہے؟",
              "اگر آپ اشارہ کیے بغیر، کوئی حرکت کیے بغیر، یا کوئی اشارہ دیے بغیر کہیں 'مجھے اپنا جوتا دکھاؤ' (جب آپ باہر نہیں جا رہے ہیں یا تیار نہیں ہو رہے ہیں)، تو کیا آپ کا بچہ آپ کو اپنا جوتا دکھاتا ہے؟",
              "اگر آپ اشارہ کیے بغیر، کوئی حرکت کیے بغیر، یا کوئی اشارہ دیے بغیر کسی اور چیز کو مانگیں، تو کیا آپ کا بچہ اسے آپ کے پاس لاتا ہے؟",
              "اگر آپ اشارہ کیے بغیر، کوئی حرکت کیے بغیر، یا کوئی اور اشارہ دیے بغیر کہیں 'کتاب کرسی پر رکھو'، تو کیا آپ کا بچہ کتاب کرسی پر رکھتا ہے؟",
              
            ],
 
            no: [
              "جب آپ باہر جانے کے لیے تیار ہوں اور آپ اپنے بچے کو اس کے جوتے لانے کو کہیں، تو کیا وہ سمجھتا ہے؟",
              "اگر رات کے کھانے کا وقت ہو اور کھانا میز پر ہو، اور آپ بچے کو بیٹھنے کو کہیں، تو کیا وہ میز پر آ کر بیٹھ جاتا ہے؟",
              "اگر آپ اشارہ کیے بغیر، کوئی حرکت کیے بغیر، یا کوئی اشارہ دیے بغیر کہیں 'مجھے اپنا جوتا دکھاؤ' (جب آپ باہر نہیں جا رہے ہیں یا تیار نہیں ہو رہے ہیں)، تو کیا آپ کا بچہ آپ کو اپنا جوتا دکھاتا ہے؟",
              "اگر آپ اشارہ کیے بغیر، کوئی حرکت کیے بغیر، یا کوئی اشارہ دیے بغیر کسی اور چیز کو مانگیں، تو کیا آپ کا بچہ اسے آپ کے پاس لاتا ہے؟",
              "اگر آپ اشارہ کیے بغیر، کوئی حرکت کیے بغیر، یا کوئی اور اشارہ دیے بغیر کہیں 'کتاب کرسی پر رکھو'، تو کیا آپ کا بچہ کتاب کرسی پر رکھتا ہے؟",
            ]
          }
        },
        {
          id: 19,
          text: "اگر کوئی نئی چیز ہوتی ہے، تو کیا آپ کا بچہ یہ دیکھنے کے لیے آپ کے چہرے کی طرف دیکھتا ہے کہ آپ اس کے بارے میں کیسا محسوس کرتے ہیں؟",
          followUps: {
            yes: [],
 
            no: [
              "اگر آپ کا بچہ کوئی عجیب یا ڈراؤنی آواز سنتا ہے، تو کیا وہ جواب دینے سے پہلے آپ کی طرف دیکھتا ہے؟",
              "کیا آپ کا بچہ آپ کی طرف دیکھتا ہے جب کوئی نیا شخص قریب آتا ہے؟",
              "کیا آپ کا بچہ آپ کی طرف دیکھتا ہے جب اسے کسی غیر مانوس یا تھوڑا ڈراؤنی چیز کا سامنا ہوتا ہے؟",
            ]
          }
        },
        {
          id: 20,
          text: "کیا آپ کے بچے کو حرکت والی سرگرمیاں پسند ہیں جیسے اچھالنا یا جھولنا؟",
          followUps: {
            yes: [],
 
            no: [
              "کیا آپ کا بچہ ہنستا ہے یا مسکراتا ہے؟",
              "کیا آپ کا بچہ بات کرتا ہے یا بڑبڑاتا ہے؟",
              "کیا آپ کا بچہ اپنے بازو پھیلا کر مزید کی درخواست کرتا ہے؟"
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
            // questionnaireID: sessionData.QuestionnaireID,
            sessionID: sessionData.SessionID,
            finalScore: totalScore,
          }),
        });

        await fetch(`http://localhost:5001/api/mark-ques-status-true/${sessionData.SessionID}`, {
          method: "POST",
        });
        
      } catch (error) {
        console.error("Error saving final score:", error);
      }
    
      // navigate("/Score");
      navigate("/dashboard");
    };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh" bgcolor="linear-gradient(135deg, #e6f4ff 30%, #ffffff 100%)">
      {/* Top Navigation Bar */}
      <AppBar position="static" sx={{ bgcolor: "#003366" }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box component="img" 
            src={logoImage} 
            alt="Chavez Logo"
            sx={{ 
              height: 60,
              maxHeight: "100%",
              py: 1
            }}
          />
  
          <Box display="flex" alignItems="center">
            <IconButton color="inherit" component={Link} to="/dashboard">
              <Home />
            </IconButton>            
            <IconButton color="inherit" onClick={handleProfileSelection}>
              <Person />
            </IconButton>
            <IconButton color="inherit" onClick={handleLogout}>
              <Logout />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
  
      {/* Content Area - Using Row Flex Direction for Side-by-Side Layout */}
      <Box display="flex" flexDirection="row" flexGrow={1} >
        {/* Main Content Area */}
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
  
        {/* Progress Sidebar - Now on the right with fixed width */}
        <Box sx={{ 
          width: "250px", 
          flexShrink: 0, 
          flexGrow: 0, 
          p: 2, 
          // borderLeft: "1px solid #ddd",
        }}>
          <Typography variant="h6" sx={{ color: "#003366", fontWeight: "bold", mb: 2}} align= "center">
            Progress
          </Typography>
          <List>
            {progress.map((q, i) => (
              <ListItem key={i} disablePadding sx={{ mb: 1 }}>
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
                    bgcolor: q.answered ? "#e0f2f1" : "#f5f5f5",
                    color: "#003366"
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
    </Box>
  );

  // return (
  //   <Box display="flex" flexDirection="column" minHeight="100vh" bgcolor="linear-gradient(135deg, #e6f4ff 30%, #ffffff 100%)">
  //     <AppBar position="static" sx={{ bgcolor: "#003366" }}>
  //       <Toolbar sx={{ justifyContent: "space-between" }}>
  //         <Box component="img" 
  //           src={logoImage} 
  //           alt="Chavez Logo"
  //           sx={{ 
  //             height: 60,
  //             maxHeight: "100%",
  //             py: 1
  //           }}
  //         />
  
  //         <Box display="flex" alignItems="center">
  //           <IconButton color="inherit" component={Link} to="/dashboard">
  //             <Home />
  //           </IconButton>            
  //           <IconButton color="inherit" onClick={handleProfileSelection}>
  //             <Person />
  //           </IconButton>
  //           <IconButton color="inherit" onClick={handleLogout}>
  //             <Logout />
  //           </IconButton>
  //         </Box>
  //       </Toolbar>
  //     </AppBar>

  //     <Box display="flex" flexDirection="row" flexGrow={1}>
  //       <Box sx={{ width: "250px", p: 2, borderRight: "1px solid #ddd"}}>
  //         <Typography variant="h6" sx={{ color: "#003366", fontWeight: "bold", mb: 2}}>
  //           Progress
  //         </Typography>
  //         <List>
  //           {progress.map((q, i) => (
  //             <ListItem key={i} disablePadding>
  //               <Button
  //                 variant="contained"
  //                 disableElevation
  //                 disabled
  //                 className={`progress-button ${q.answered ? "answered" : ""}`}
  //                 sx={{ 
  //                   display: "flex", 
  //                   alignItems: "center", 
  //                   justifyContent: "space-between", 
  //                   width: "100%",
  //                   minWidth: "180px", 
  //                   bgcolor: q.answered ? "#e0f2f1" : "#f5f5f5",
  //                   color: "#003366"
  //                 }}
  //               >
  //                 Question {i + 1}
  //                 {q.answered && <CheckCircleIcon sx={{ ml: 1, color: "green" }} />}
  //               </Button>
  //             </ListItem>
  //           ))}
  //         </List>
  //       </Box>

  //     <Box flexGrow={1} p={4}>
  //       <Box className={styles.questionBox}>
  //         <Typography variant="h5" className={styles.questionText}>
  //           {currentQuestion?.text}
  //         </Typography>
  //         <Box className={styles.options}>
  //           <Button
  //             className={`${styles.optionButton} ${selectedOption === "yes" && styles.selected}`}
  //             onClick={() => handleOptionChange("yes")}
  //           >
  //             Yes
  //           </Button>
  //           <Button
  //             className={`${styles.optionButton} ${selectedOption === "no" && styles.selected}`}
  //             onClick={() => handleOptionChange("no")}
  //           >
  //             No
  //           </Button>
  //         </Box>
  //       </Box>

  //       {/* Follow-Up Questions */}
  //       {selectedOption && dynamicFollowUps.length > 0 && (
  //         <Box className={styles.followUpBox}>
  //           <Typography variant="h6" sx={{ color: "#003366", fontWeight: "bold", mb: 2 }}>
  //             Follow-Up Questions
  //           </Typography>
  //           {dynamicFollowUps.map((followUp, index) => (
  //             <Box key={index} className={styles.followUpQuestion}>
  //               <Typography sx={{ color: "#003366", fontSize: "16px", fontWeight: "bold" }}>
  //                 {followUp}
  //               </Typography>
  //               <Box display="flex" gap={2} mt={1}>
  //                 <Button
  //                   className={`${styles.navButton} ${followUpResponses[followUp] === true ? styles.selectedButton : ""}`}
  //                   onClick={() => handleFollowUpChange(followUp, "yes")}
  //                 >
  //                   Yes
  //                 </Button>
  //                 <Button
  //                   className={`${styles.navButton} ${followUpResponses[followUp] === false ? styles.selectedButton : ""}`}
  //                   onClick={() => handleFollowUpChange(followUp, "no")}
  //                 >
  //                   No
  //                 </Button>
  //               </Box>
  //             </Box>
  //           ))}
  //         </Box>
  //       )}

  //       {/* Navigation Buttons */}
  //       <Box display="flex" justifyContent="space-between" mt={3}>
  //         <Button
  //           className={`${styles.navButton} ${currentQuestionIndex === 0 ? styles.disabledButton : ""}`}
  //           onClick={handleBack}
  //           disabled={currentQuestionIndex === 0}
  //         >
  //           Back
  //         </Button>
          
  //         {currentQuestionIndex === questions.length - 1 ? (
  //           <Button
  //             className={`${styles.navButton} ${styles.selectedButton}`}
  //             onClick={handleNext}
  //           >
  //             Submit
  //           </Button>
  //         ) : (
  //           <Button className={`${styles.navButton} ${styles.selectedButton}`} onClick={handleNext}>
  //             Next
  //           </Button>
  //         )}
  //       </Box>
  //     </Box>
  //     </Box>
  //   </Box>
  // );
};

export default Questions;