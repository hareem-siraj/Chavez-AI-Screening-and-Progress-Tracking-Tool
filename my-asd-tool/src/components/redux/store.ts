import { createStore } from 'redux';

// Define action types
const SET_USER_ID = 'SET_USER_ID';
const SELECT_CHILD = 'SELECT_CHILD';
const SET_SESSION_IDS = 'SET_SESSION_IDS';
const SET_FINAL_SCORE = 'SET_FINAL_SCORE'; // New action type

// Define action creators
export const setUserId = (UserID: string) => ({
  type: SET_USER_ID,
  payload: UserID,
});

export const selectChild = (ChildID: number) => ({
  type: SELECT_CHILD,
  payload: ChildID,
});

export const setSessionIds = (sessionData: {
  SessionID: string | null;
  QuestionnaireID: string | null;
  GameSessionID: string | null;
  ReportID: string | null;
}) => ({
  type: SET_SESSION_IDS,
  payload: sessionData,
});

export const setFinalScore = (finalScore: number) => ({ // New action creator
  type: SET_FINAL_SCORE,
  payload: finalScore,
});

// Define the initial state
interface SessionData {
  SessionID: string | null;
  QuestionnaireID: string | null;
  GameSessionID: string | null;
  ReportID: string | null;
}

interface State {
  UserID: string | null;
  selectedChildId: number | null;
  sessionData: SessionData;
  finalScore: number | null; // Add finalScore to the state
}

const initialState: State = {
  UserID: null,
  selectedChildId: null,
  sessionData: {
    SessionID: null,
    QuestionnaireID: null,
    GameSessionID: null,
    ReportID: null,
  },
  finalScore: null, // Initialize with null
};

// Define the reducer
const userReducer = (state = initialState, action: any): State => {
  switch (action.type) {
    case SET_USER_ID:
      return { ...state, UserID: action.payload };
    case SELECT_CHILD:
      return { ...state, selectedChildId: action.payload };
    case SET_SESSION_IDS:
      return {
        ...state,
        sessionData: {
          ...state.sessionData,
          ...action.payload,
        },
      };
    case SET_FINAL_SCORE: // Handle final score
      return { ...state, finalScore: action.payload };
    default:
      return state;
  }
};

// Create the Redux store
const store = createStore(userReducer);

export default store;