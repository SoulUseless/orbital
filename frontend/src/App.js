import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';

import Home from './Home';
import Startups from './users/pages/startups/Startups';
import StartupProfile from './users/pages/startups/StartupProfile';
import EditStartUpProfile from './users/pages/startups/EditStartupProfile';
import Students from './users/pages/students/Students';
import StudentProfile from './users/pages/students/StudentProfile';
import EditStudentProfile from './users/pages/students/EditStudentProfile';
import Challenge from './challenges/pages/Challenge';
//import EditChallenge from "./challenges/pages/EditChallenge";
import Challenges from './challenges/pages/Challenges';
import StartupChallenge from './startup-challenges/pages/StartupChallenge';
import EditStartUpChallenge from './startup-challenges/pages/EditStartupChallenge';
import StartupChallenges from './startup-challenges/pages/StartupChallenges';
import NewStartupChallenge from './startup-challenges/pages/NewStartupChallenge.js';
import Auth from './users/pages/authentication/Auth';
import MainNavigation from './shared/components/navigation/pages/MainNavigation';
import Guide from './shared/components/guide/Guide';
import Settings from './shared/components/settings/settings';

import { AuthContext } from './shared/context/auth-context';
import { useAuth } from "./shared/hooks/auth-hook";

const App = () => {
  const { token, userId, userType, loginAsStudent, loginAsStartup, logout } = useAuth();

  //console.log(token);
  //console.log(userId);
  //console.log(userType);

  let routes;
  if (token) {
    if (userType === 'student') {
      routes = (
        <Switch>
          <Route path='/' exact={true}>
            <Home />
          </Route>

          <Route path='/student/' exact={true}>
            <Students />
          </Route>

          <Route path='/student/edit/:studentId'>
            <EditStudentProfile />
          </Route>

          <Route path='/student/:studentId'>
            <StudentProfile />
          </Route>

          <Route path='/startup/' exact={true}>
            <Startups />
          </Route>

          <Route path='/startup/:startupId'>
            <StartupProfile />
          </Route>

          <Route path='/challenges' exact={true}>
            <Challenges />
          </Route>

          <Route path='/challenges/:challengeId'>
            <Challenge />
          </Route>

          <Route path='/startup-challenge' exact={true}>
            <StartupChallenges />
          </Route>

          <Route path='/startup-challenge/:challengeId'>
            <StartupChallenge />
          </Route>

          <Route path='/how-to'>
            <Guide />
          </Route>

          <Route path='/settings'>
            <Settings />
          </Route>

          <Redirect to='/' />

        </Switch>
      );
    } else if (userType === 'startup') {
      routes = (
        <Switch>
          <Route path='/' exact={true}>
            <Home />
          </Route>

          <Route path='/student/' exact={true}>
            <Students />
          </Route>

          <Route path='/student/:studentId'>
            <StudentProfile />
          </Route>

          <Route path='/startup/' exact={true}>
            <Startups />
          </Route>

          <Route path='/startup/edit/:startupId'>
            <EditStartUpProfile />
          </Route>

          <Route path='/startup/:startupId'>
            <StartupProfile />
          </Route>

          <Route path='/startup-challenge/new' exact={true}>
            <NewStartupChallenge />
          </Route>

          <Route path='/challenges' exact={true}>
            <Challenges />
          </Route>

          <Route path='/challenges/:challengeId'>
            <Challenge />
          </Route>

          <Route path='/startup-challenge' exact={true}>
            <StartupChallenges />
          </Route>

          <Route path='/startup-challenge/edit/:challengeId'>
            <EditStartUpChallenge />
          </Route>

          <Route path='/startup-challenge/:challengeId'>
            <StartupChallenge />
          </Route>

          <Route path='/auth'>
            <Auth />
          </Route>

          <Route path='/how-to'>
            <Guide />
          </Route>

          <Route path='/settings'>
            <Settings />
          </Route>

          <Redirect to='/' />
          
        </Switch>
      );
    } else {
      //admin?
    }
  } else {
    routes = (
      <Switch>
        <Route path='/' exact={true}>
          <Home />
        </Route>

        <Route path='/student/' exact={true}>
          <Students />
        </Route>

        <Route path='/student/:studentId'>
          <StudentProfile />
        </Route>

        <Route path='/startup/' exact={true}>
          <Startups />
        </Route>

        <Route path='/startup/:startupId'>
          <StartupProfile />
        </Route>

        <Route path='/challenges' exact={true}>
          <Challenges />
        </Route>

        <Route path='/challenges/:challengeId'>
          <Challenge />
        </Route>

        <Route path='/startup-challenge' exact={true}>
          <StartupChallenges />
        </Route>

        <Route path='/startup-challenge/:challengeId'>
          <StartupChallenge />
        </Route>

        <Route path='/auth'>
          <Auth />
        </Route>

        <Route path='/how-to'>
          <Guide />
        </Route>

        <Redirect to='/auth' />
      </Switch>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        token: token,
        userType: userType,
        userId: userId,
        loginAsStudent: loginAsStudent,
        loginAsStartup: loginAsStartup,
        logout: logout,
      }}
    >
      <Router>
        <MainNavigation />
        <main>{routes}</main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
