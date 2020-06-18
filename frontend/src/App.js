import React, {useState, useCallback} from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch} from 'react-router-dom';

import Home from "./Home";
import Startups from "./startups/pages/Startups";
import StartupProfile from "./startups/pages/StartupProfile";
import Students from "./students/pages/Students";
import StudentProfile from "./students/pages/StudentProfile";
import Challenge from "./challenges/pages/Challenge";
//import EditChallenge from "./challenges/pages/EditChallenge";
import Challenges from "./challenges/pages/Challenges";
import StartupChallenge from "./startup-challenges/pages/StartupChallenge";
import EditStartUpChallenge from "./startup-challenges/pages/EditStartupChallenge";
import StartupChallenges from "./startup-challenges/pages/StartupChallenges";
import NewStartupChallenge from "./startup-challenges/pages/NewStartupChallenge.js";
import Auth from "./shared/components/authentication/pages/Auth";
import MainNavigation from "./shared/components/navigation/pages/MainNavigation";
import Guide from "./shared/components/guide/Guide";
import Settings from "./shared/components/settings/settings";

import { AuthContext } from "./shared/context/auth-context";

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userType, setUserType] = useState();

    const loginAsStudent = useCallback((id) => {
      setIsLoggedIn(true);
      setUserType("student");
    }, []);

    const loginAsStartup = useCallback((id) => {
      setIsLoggedIn(true);
      setUserType("startup");
    }, []);

    const logout = useCallback(() => {
      setIsLoggedIn(false);
      setUserType(undefined);
    }, []);

    let routes;
    if (isLoggedIn) {
      if (userType === "student") {
        routes = (
            <Switch>
                <Route path="/" exact={true}>
                    <Home />
                </Route>

                <Route path="/student/" exact={true}>
                    <Students />
                </Route>

                <Route path="/student/:studentId">
                    <StudentProfile />
                </Route>

                <Route path="/startup/" exact={true}>
                    <Startups />
                </Route>

                <Route path="/startup/:startupId">
                    <StartupProfile />
                </Route>

                <Route path="/challenges" exact={true}>
                    <Challenges />
                </Route>

                <Route path="/challenges/:challengeId">
                    <Challenge />
                </Route>

                <Route path="/startup-challenge" exact={true}>
                    <StartupChallenges />
                </Route>

                <Route path="/startup-challenge/:challengeId">
                    <StartupChallenge />
                </Route>

                <Route path="/how-to">
                    <Guide />
                </Route>

                <Route path="/settings">
                    <Settings />
                </Route>

                <Redirect to="/" />
                {/* TO DO: save token and use this to redirect to student profile*/}
            </Switch>
        );

      } else if (userType === "startup") {
        routes = (
            <Switch>
                <Route path="/" exact={true}>
                    <Home />
                </Route>

                <Route path="/student/" exact={true}>
                    <Students />
                </Route>

                <Route path="/student/:studentId">
                    <StudentProfile />
                </Route>

                <Route path="/startup/" exact={true}>
                    <Startups />
                </Route>

                <Route path="/startup-challenge/new" exact={true}>
                    <NewStartupChallenge />
                </Route>

                <Route path="/startup/:startupId">
                    <StartupProfile />
                </Route>

                <Route path="/challenges" exact={true}>
                    <Challenges />
                </Route>

                <Route path="/challenges/:challengeId">
                    <Challenge />
                </Route>

                <Route path="/startup-challenge" exact={true}>
                    <StartupChallenges />
                </Route>

                <Route path="/startup-challenge/edit/:challengeId">
                    <EditStartUpChallenge />
                </Route>

                <Route path="/startup-challenge/:challengeId">
                    <StartupChallenge />
                </Route>

                <Route path="/auth">
                    <Auth />
                </Route>

                <Route path="/how-to">
                    <Guide />
                </Route>

                <Route path="/settings">
                    <Settings />
                </Route>

                <Redirect to="/" />
                {/* TO DO: save token and use this to redirect to startup profile*/}
            </Switch>
        );

      } else { //admin?

      }
    } else {
      routes = (
          <Switch>
              <Route path="/" exact={true}>
                  <Home />
              </Route>

              <Route path="/student/" exact={true}>
                  <Students />
              </Route>

              <Route path="/student/:studentId">
                  <StudentProfile />
              </Route>

              <Route path="/startup/" exact={true}>
                  <Startups />
              </Route>

              <Route path="/startup/:startupId">
                  <StartupProfile />
              </Route>

              <Route path="/challenges" exact={true}>
                  <Challenges />
              </Route>

              <Route path="/challenges/:challengeId">
                  <Challenge />
              </Route>

              <Route path="/startup-challenge" exact={true}>
                  <StartupChallenges />
              </Route>

              <Route path="/startup-challenge/:challengeId">
                  <StartupChallenge />
              </Route>

              <Route path="/auth">
                  <Auth />
              </Route>

              <Route path="/how-to">
                  <Guide />
              </Route>

              <Redirect to="/auth" />
          </Switch>
      );
    }

    return (
        <AuthContext.Provider
            value={{
                isLoggedIn: isLoggedIn,
                userType: userType,
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
}

export default App;
