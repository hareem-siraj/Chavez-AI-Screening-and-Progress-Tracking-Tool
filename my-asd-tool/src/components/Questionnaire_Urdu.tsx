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
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import styles from "../theme/QuestionnairePage.module.css"; // Using the same styles as English version
import { setFinalScore, setSessionIds } from "./redux/store"; // Import the actions

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

const QuestionnaireUrdu: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [progress, setProgress] = useState<
    { answered: boolean; selected: "yes" | "no" | null; result: boolean | null }[]
  >(Array(14).fill({ answered: false, selected: null, result: null }));
  const [followUpResponses, setFollowUpResponses] = useState<{ [key: string]: boolean }>({});
  const [score, setScore] = useState<number | null>(null);
  const [dynamicFollowUps, setDynamicFollowUps] = useState<string[]>([]);

  // Redux state
  const sessionData = useSelector((state: any) => state.sessionData);
  const childName = sessionData.ChildName || "آپ کا بچہ"; // Use child name or default

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(setSessionIds({ SessionID: null, QuestionnaireID: null, GameSessionID: null, ReportID: null }));
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/sign-in";
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      setQuestions([
        {
          id: 1,
          text: "اگر آپ کمرے میں کسی چیز کی طرف اشارہ کرتے ہیں تو کیا بچہ اس کی طرف دیکھتا ہے؟",
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
          text: "کیا آپ نے کبھی سوچا ہے کہ آپ کا بچہ بہرا ہو سکتا ہے",
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
            text: "کیا آپ کا بچہ اپنی آنکھوں کے قریب غیر معمولی انگلیوں کی حرکت کرتا ہے؟ (مثال کے طور پر، کیا آپ کا بچہ اپنی انگلیوں کو آنکھوں کے قریب ہلاتا ہے؟)",
            followUps: {
                yes: [
                    "کیا وہ اپنے ہاتھوں کو دیکھتا/دیکھتی ہے؟",
                    "کیا وہ چھپن چھپائی کھیلتے وقت اپنی انگلیوں کو ہلاتا/ہلاتی ہے؟",
                    "کیا وہ اپنی انگلیوں کو اپنی آنکھوں کے قریب ہفتے میں دو سے زیادہ بار ہلاتا/ہلاتی ہے؟",
                    "کیا وہ اپنے ہاتھوں کو اپنی آنکھوں کے قریب ہفتے میں دو سے زیادہ بار رکھتا/رکھتی ہے؟",
                    "کیا وہ اپنے ہاتھوں کو اپنی آنکھوں کے سائیڈ پر ہفتے میں دو سے زیادہ بار رکھتا/رکھتی ہے؟",
                    "کیا وہ اپنے چہرے کے قریب ہاتھ ہلاتا/ہلاتی ہے ہفتے میں دو سے زیادہ بار؟",
                ],
                no: [],
            },
        },
        {
            id: 6,
            text: "کیا آپ کا بچہ ایک انگلی کے ساتھ کسی چیز کی طرف اشارہ کرتا ہے تاکہ وہ کوئی چیز حاصل کر سکے یا مدد مانگ سکے؟",
            followUps: {
                yes: [
                    "کیا وہ اپنے پورے ہاتھ کے ساتھ چیز کی طرف پہنچتا/پہنچتی ہے؟",
                    "کیا وہ آپ کو چیز کی طرف لے جاتا/جاتی ہے؟",
                    "کیا وہ خود کے لئے چیز حاصل کرنے کی کوشش کرتا/کرتی ہے؟",
                    "کیا وہ الفاظ یا آوازوں کا استعمال کر کے اسے مانگتا/مانگتی ہے؟",
                ],
                no: [],
          }
        },
        {
            id: 7,
            text: "کیا آپ کا بچہ کبھی کسی چیز کی طرف ایک انگلی سے اشارہ کرتا ہے تاکہ آپ کو کوئی دلچسپ چیز دکھا سکے، بغیر مدد حاصل کرنے کے ارادے کے؟",
            followUps: {
                yes: [
                    "آسمان میں ہوائی جہاز؟",
                    "سڑک پر ٹرک؟",
                    "زمین پر کیڑا؟",
                    "صحن میں کوئی جانور؟",
                ],
                no: [
                    "آسمان میں ہوائی جہاز؟",
                    "سڑک پر ٹرک؟",
                    "زمین پر کیڑا؟",
                    "صحن میں کوئی جانور؟",
                ],
            },
        },
        {
            id: 8,
            text: "کیا آپ کا بچہ دوسرے بچوں میں دلچسپی رکھتا ہے؟ (مثال کے طور پر، کیا آپ کا بچہ انہیں دیکھتا ہے، ان پر مسکراتا ہے، یا ان کے پاس جاتا ہے؟)",
            followUps: {
                yes: [
                    "کیا وہ خاندان سے باہر کے بچوں کے ساتھ کھیلتا/کھیلتی ہے؟",
                    "کیا وہ دوسرے بچوں کے ساتھ بات چیت کرنے کی کوشش کرتا/کرتی ہے؟",
                    "کیا وہ ان کی توجہ حاصل کرنے کے لئے آوازیں نکالتا/نکالتی ہے؟",
                ],
                no: [
                    "کیا وہ دوسرے بچوں سے دور رہتا/رہتی ہے؟",
                    "کیا وہ دوسرے بچوں کے قریب آنے پر جواب دیتا/دیتی ہے؟",
            ]
          }
        },
        {
            id: 9,
            text: "کیا آپ کا بچہ آپ کو چیزیں دکھانے کے لئے آپ کے پاس لاتا ہے یا انہیں اٹھا کر آپ کو دکھاتا ہے؟ صرف مدد کے لئے نہیں بلکہ بانٹنے کے لئے؟",
            followUps: {
                yes: [
                    "کیا وہ آپ کو صرف دکھانے کے لئے تصویر یا کھلونا لاتا/لاتی ہے؟",
                    "کیا وہ اپنی بنائی ہوئی کوئی ڈرائنگ دکھاتا/دکھاتی ہے؟",
                    "کیا وہ آپ کو اپنے چنے ہوئے پھول دکھاتا/دکھاتی ہے؟",
                    "کیا وہ گھاس میں پائے ہوئے کسی کیڑے کو دکھاتا/دکھاتی ہے؟",
                    "کیا وہ چند بلاکس جوڑ کر آپ کو دکھاتا/دکھاتی ہے؟",
                ],
                no: [
                    "کیا وہ آپ کو صرف دکھانے کے لئے تصویر یا کھلونا لاتا/لاتی ہے؟",
                    "کیا وہ اپنی بنائی ہوئی کوئی ڈرائنگ دکھاتا/دکھاتی ہے؟",
                    "کیا وہ آپ کو اپنے چنے ہوئے پھول دکھاتا/دکھاتی ہے؟",
                    "کیا وہ گھاس میں پائے ہوئے کسی کیڑے کو دکھاتا/دکھاتی ہے؟",
                    "کیا وہ چند بلاکس جوڑ کر آپ کو دکھاتا/دکھاتی ہے؟",
                ],
            },
        },
        {
            id: 10,
            text: "کیا آپ کا بچہ آپ کے نام پکارنے پر جواب دیتا ہے؟ (مثال کے طور پر، کیا آپ کا بچہ اوپر دیکھتا ہے، بات کرتا ہے، یا جو کچھ کر رہا ہے اسے روک دیتا ہے؟)",
            followUps: {
                yes: [
                    "کیا وہ نام پکارنے پر اوپر دیکھتا/دیکھتی ہے؟",
                    "کیا وہ جواب میں بات کرتا/کرتی ہے یا آوازیں نکالتا/نکالتی ہے؟",
                    "کیا وہ آپ کے نام پکارنے پر اپنی سرگرمی روک دیتا/دیتی ہے؟",
                ],
                no: [
                    "کیا وہ آپ کے نام پکارنے پر آپ کو نظر انداز کرتا/کرتی ہے؟",
                    "کیا وہ صرف آپ کے سامنے ہونے پر جواب دیتا/دیتی ہے؟",
                    "کیا وہ صرف چھونے پر جواب دیتا/دیتی ہے؟",
                ],
            },
        },
        {
            id: 11,
            text: `جب آپ ${childName} پر مسکراتے ہیں تو کیا وہ/وہ آپ کو واپس مسکراتا/مسکراتی ہے؟`,
            followUps: {
                yes: [
                    "کیا آپ کے مسکرانے پر آپ کا بچہ مسکراتا/مسکراتی ہے؟",
                    "کیا آپ کے کمرے میں داخل ہونے پر آپ کا بچہ مسکراتا/مسکراتی ہے؟",
                    "کیا آپ کے واپس آنے پر آپ کا بچہ مسکراتا/مسکراتی ہے؟",
                ],
                no: [
                    "کیا وہ ہمیشہ مسکراتا/مسکراتی ہے؟",
                    "کیا وہ کسی پسندیدہ کھلونے یا سرگرمی پر مسکراتا/مسکراتی ہے؟",
                    "کیا وہ بے ترتیب یا کسی خاص چیز کے بغیر مسکراتا/مسکراتی ہے؟",
                ],
            },
        },
        {
            id: 12,
            text: `کیا ${childName} روزمرہ کی آوازوں سے پریشان ہوتا/ہوتی ہے؟`,
            followUps: {
                yes: [
                    "کیا آپ کے بچے کو واشنگ مشین کی آواز پر منفی ردعمل ہوتا ہے؟",
                    "کیا آپ کے بچے کو بچوں کے رونے کی آواز پر منفی ردعمل ہوتا ہے؟",
                    "کیا آپ کے بچے کو ویکیوم کلینر کی آواز پر منفی ردعمل ہوتا ہے؟",
                    "کیا آپ کے بچے کو ہیئر ڈرائر کی آواز پر منفی ردعمل ہوتا ہے؟",
                    "کیا آپ کے بچے کو ٹریفک کی آواز پر منفی ردعمل ہوتا ہے؟",
                    "کیا آپ کے بچے کو بچوں کے چیخنے یا چلاتے ہوئے منفی ردعمل ہوتا ہے؟",
                    "کیا آپ کے بچے کو اونچی موسیقی کی آواز پر منفی ردعمل ہوتا ہے؟",
                    "کیا آپ کے بچے کو فون یا دروازے کی گھنٹی بجنے کی آواز پر منفی ردعمل ہوتا ہے؟",
                    "کیا آپ کے بچے کو شور والے مقامات جیسے سپر مارکیٹ یا ریستوران پر منفی ردعمل ہوتا ہے؟",
                ],
                no: [
                    "کیا آپ کا بچہ سکون سے اپنے کانوں کو ڈھانپ لیتا ہے؟",
                    "کیا آپ کا بچہ آپ کو بتاتا ہے کہ اسے شور پسند نہیں؟",
                ],
            },
        },
        {
            id: 13,
            text: "کیا آپ کا بچہ بغیر کسی چیز کو تھامے چلتا ہے؟",
            followUps: {
                yes: [],
                no: [],
            },
        },
        {
            id: 14,
            text: `کیا ${childName} آپ سے بات کرتے ہوئے، کھیلتے ہوئے، یا اس کا لباس بدلتے وقت آپ کی آنکھوں میں دیکھتا/دیکھتی ہے؟`,
            followUps: {
                yes: [
                    "کیا وہ کسی چیز کی ضرورت ہونے پر آپ کی آنکھوں میں دیکھتا/دیکھتی ہے؟",
                    "کیا وہ آپ کے ساتھ کھیلتے ہوئے آپ کی آنکھوں میں دیکھتا/دیکھتی ہے؟",
                    "کیا وہ کھلانے کے دوران آپ کی آنکھوں میں دیکھتا/دیکھتی ہے؟",
                    "کیا وہ ڈائپر بدلتے وقت آپ کی آنکھوں میں دیکھتا/دیکھتی ہے؟",
                    "کیا وہ کہانی سنتے وقت آپ کی آنکھوں میں دیکھتا/دیکھتی ہے؟",
                    "کیا وہ آپ سے بات کرتے وقت آپ کی آنکھوں میں دیکھتا/دیکھتی ہے؟",
                ],
                no: [
                    "کیا آپ کا بچہ روزانہ آپ کی آنکھوں میں دیکھتا ہے؟",
                    "ایک دن جب آپ سارا دن ساتھ ہوں، کیا وہ کم از کم 5 بار آپ کی آنکھوں میں دیکھتا/دیکھتی ہے؟",
            ]
          }
        },
        
      ]);
    };
    fetchQuestions();
  }, [childName]); // Add childName to dependency array

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
    const followUps = currentQuestion?.followUps[option] || [];
    setDynamicFollowUps(followUps);
    
    const initialFollowUps: { [key: string]: boolean } = {};
    followUps.forEach((question) => {
      initialFollowUps[question] = false;
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
      
    console.log(`Evaluating Question ${currentQuestion.id}:`, result);
    return result;
  };

  const handleNext = async () => {
    if (currentQuestionIndex < questions.length) {
      const result = evaluateCurrentQuestion();
  
      const updatedProgress = [...progress];
      updatedProgress[currentQuestionIndex] = {
        ...updatedProgress[currentQuestionIndex],
        answered: true,
        selected: selectedOption,
        result,
      };
  
      setProgress(updatedProgress);
  
      const questionData = {
        questionID: currentQuestion.id,
        questionnaireID: sessionData.QuestionnaireID,
        question_text: currentQuestion.text,
        followup_Qs_ans: followUpResponses,
        main_qs_ans: selectedOption === "yes",
        result,
      };
  
      try {
        await fetch("http://localhost:5001/api/save-question-response", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(questionData),
        });
      } catch (error) {
        console.error("Error saving question response:", error);
      }
  
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        calculateFinalScore(updatedProgress);
      }
    }
  };

  const calculateFinalScore = async (latestProgress: { answered: boolean; selected: string | null; result: boolean | null }[]) => {
    const totalScore = latestProgress.reduce((score: number, question) => {
      if (question.result === true) {
        return score + 1;
      }
      return score;
    }, 0);
  
    const finalScore = Math.floor(totalScore);
  
    setScore(finalScore);
    dispatch(setFinalScore(finalScore));
  
    try {
      await fetch("http://localhost:5001/api/save-final-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionnaireID: sessionData.QuestionnaireID,
          sessionID: sessionData.SessionID,
          finalScore: finalScore,
        }),
      });
    } catch (error) {
      console.error("Error saving final score:", error);
    }
  
    navigate("/Score-urdu");
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
                <ListItemText primary="ڈیش بورڈ" sx={{ color: "#003366", textAlign: "right" }} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/profile">
                <ListItemIcon><Person sx={{ color: "#003366" }} /></ListItemIcon>
                <ListItemText primary="پروفائل" sx={{ color: "#003366", textAlign: "right" }} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/questionnaire-urdu">
                <ListItemIcon><QuestionAnswer sx={{ color: "#003366" }} /></ListItemIcon>
                <ListItemText primary="سوالنامہ" sx={{ color: "#003366", textAlign: "right" }} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/game-selection-urdu">
                <ListItemIcon><Assessment sx={{ color: "#003366" }} /></ListItemIcon>
                <ListItemText primary="کھیل" sx={{ color: "#003366", textAlign: "right" }} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/reports-urdu">
                <ListItemIcon><Assessment sx={{ color: "#003366" }} /></ListItemIcon>
                <ListItemText primary="رپورٹس" sx={{ color: "#003366", textAlign: "right" }} />
              </ListItemButton>
            </ListItem>
          </List>

          <Divider />
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={handleLogout}>
                <ListItemIcon>
                  <Logout sx={{ color: "#003366" }} />
                </ListItemIcon>
                <ListItemText primary="لاگ آؤٹ" primaryTypographyProps={{ sx: { color: "#003366", textAlign: "right" } }} />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Box>

      {/* Main Content Area */}
      <Box flexGrow={1} p={4}>
        {/* Question Box */}
        <Box className={styles.questionBox} dir="rtl">
          <Typography variant="h5" className={styles.questionText}>
            {currentQuestion?.text}
          </Typography>
          <Box className={styles.options}>
            <Button
              className={`${styles.optionButton} ${selectedOption === "yes" && styles.selected}`}
              onClick={() => handleOptionChange("yes")}
            >
              ہاں
            </Button>
            <Button
              className={`${styles.optionButton} ${selectedOption === "no" && styles.selected}`}
              onClick={() => handleOptionChange("no")}
            >
              نہیں
            </Button>
          </Box>
        </Box>

        {/* Follow-Up Questions */}
        {selectedOption && dynamicFollowUps.length > 0 && (
          <Box className={styles.followUpBox} dir="rtl">
            <Typography variant="h6" sx={{ color: "#003366", fontWeight: "bold", mb: 2 }}>
              متعلقہ سوالات
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
                    ہاں
                  </Button>
                  <Button
                    className={`${styles.navButton} ${followUpResponses[followUp] === false ? styles.selectedButton : ""}`}
                    onClick={() => handleFollowUpChange(followUp, "no")}
                  >
                    نہیں
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
            پیچھے
          </Button>
          
          {currentQuestionIndex === questions.length - 1 ? (
            <Button
              className={`${styles.navButton} ${styles.selectedButton}`}
              onClick={handleNext}
            >
              جمع کرائیں
            </Button>
          ) : (
            <Button className={`${styles.navButton} ${styles.selectedButton}`} onClick={handleNext}>
              آگے
            </Button>
          )}
        </Box>
      </Box>

      {/* Progress Sidebar */}
      <Box width="250px" flexShrink={0} p={2} bgcolor="#ffffff" borderLeft="1px solid #ddd">
        <Typography variant="h6" sx={{ color: "#003366", fontWeight: "bold", mb: 2 }}>
          پیشرفت
        </Typography>
        <List>
          {progress.map((q, i) => (
            <ListItem key={i} disablePadding sx={{ mb: 1 }}>
              <Button
                variant="contained"
                disableElevation
                disabled
                sx={{ 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "space-between", 
                  width: "100%",
                  minWidth: "180px",
                  backgroundColor: q.answered ? "#e3f2fd" : "#f5f5f5",
                  color: "#003366"
                }}
              >
                {`سوال ${i + 1}`}
                {q.answered && <CheckCircleIcon sx={{ ml: 1, color: "green" }} />}
              </Button>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default QuestionnaireUrdu;

