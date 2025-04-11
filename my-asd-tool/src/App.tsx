
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

import QC1 from './components/Questionnaire';
import QuestionComponent from 'components/Questionnaire_Urdu';

import Report from './components/Report';


import GameScreen from './components/AllGames';
import GameScreenUrdu from 'components/AllGamesUrdu';

import Balloon from './components/balloon';
import Gamefollow from 'components/follow';
import Human from 'components/human';
import Puzzle from 'components/puzzle';

import Audio from 'components/Audio';

import store from './components/redux/store';  
// import ProgressOverview from './components/ProgressOverview';

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

            <Route path="/create-profile" element={<ProfileCreation />} />
            <Route path="/create-profile-urdu" element={<ProfileCreationUrdu />} />

            <Route path="/questionnaire" element={<QC1 />} />
            <Route path='/questionnaire-urdu' element={<QuestionComponent/>} />

            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard-urdu" element={<DashboardUrdu />} />

            <Route path="/reports" element={<Report />} />

            <Route path="/game-selection" element={<GameScreen />} />
            <Route path="/game-selection-urdu" element={<GameScreenUrdu />} />

            <Route path="/follow" element={<Gamefollow/>} />
            <Route path="/balloon" element={<Balloon/>} />
            <Route path="/human" element={<Human/>} />
            <Route path="/puzzle" element={<Puzzle/>} /> 

            <Route path="/audio-analysis" element={<Audio/>} />
            {/* <Route path="/audio-analysis-urdu" element={<Audio/>} /> */}
            
            {/* <Route path="/progress-overview" element={<ProgressOverview/>}  */}
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  );
};

export default App;