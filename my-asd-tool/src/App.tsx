
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './theme/ThemeProvider';

import SignIn from './components/SignIn';
import SignInUrdu from './components/SignIn_Urdu';

import ForgotPassword from './components/ForgotPassword';
import ForgotPasswordUrdu from 'components/ForgotPassword_Urdu';

import CreateAccount from './components/CreateAccount';
import CreateAccountUr from 'components/CreateAccount_Urdu';

import LandingPage from './components/LandingPage';
import LandingPageUrdu from './components/LandingPage_Urdu';

import ProfileSelection from './components/ProfileSelection';
import ProfileSelectionUrdu from './components/ProfileSelection_Urdu';

import ProfileCreation from './components/ProfileCreation';
import ProfileCreationUrdu from './components/ProfileCreation_Urdu';

import Dashboard from './components/Dashboard';
import DashboardUrdu from './components/Dashboard_Urdu'

import FinalScore from './components/Score';
import FinalScoreUrdu from './components/Score_Urdu';

import Questions from './components/Questionnaire';
import QuestionComponent from 'components/Questionnaire_Urdu';

import Report from './components/Report';
import Setting from './components/Settings';
import AutismGuide from './components/AutismGuide';
import ProfileSettings from './components/ProfileSetting';

import GameScreen from './components/AllGames';

import Flashcard from './components/flashcard';
import Balloon from './components/balloon';
import Gamefollow from 'components/follow';
import Human from 'components/human';
import Puzzle from 'components/puzzle';

import store from './components/redux/store';  // Import the Redux store

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/urdu" element={<LandingPageUrdu />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-in-urdu" element={<SignInUrdu />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/forgot-password-urdu" element={<ForgotPasswordUrdu />} />
            <Route path="/create-account" element={<CreateAccount />} />
            <Route path="/create-account-urdu" element={<CreateAccountUr />} />
            <Route path="/profile-selection" element={<ProfileSelection />} />
            <Route path="/profile-selection-urdu" element={<ProfileSelectionUrdu />} />
            <Route path="/edit-profile" element={<ProfileSettings />} />
            <Route path="/create-profile" element={<ProfileCreation />} />
            <Route path="/create-profile-urdu" element={<ProfileCreationUrdu />} />
            <Route path="/questionnaire" element={<Questions />} />
            <Route path="/autism-guide" element={<AutismGuide />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard-urdu" element={<DashboardUrdu />} />
            <Route path="/reports" element={<Report />} />
            <Route path="/settings" element={<Setting />} />
            <Route path="/game-selection" element={<GameScreen />} />
            <Route path="/Score" element={<FinalScore />} />
            <Route path="/Score-Urdu" element={<FinalScoreUrdu />} />
            <Route path="/flashcard" element={<Flashcard/>} />
            <Route path="/follow" element={<Gamefollow/>} />
            <Route path="/balloon" element={<Balloon/>} />
            <Route path="/human" element={<Human/>} />
            <Route path='/questionnaire-urdu' element={<QuestionComponent/>} />
            <Route path="/puzzle" element={<Puzzle/>} /> 
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
