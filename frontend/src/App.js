import React, {useState, useCallback} from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch} from 'react-router-dom';

import Home from "./Home";
import Startups from "./startups/pages/Startups";
import StartupProfile from "./startups/pages/StartupProfile";
import Students from "./students/pages/Students";
import StudentProfile from "./students/pages/StudentProfile";
import Challenge from "./challenges/pages/Challenge";
import EditChallenge from "./challenges/pages/EditChallenge";
import ChallengeList from "./challenges/pages/ChallengeList";
import StartupChallenge from "./startup-challenges/pages/StartupChallenge";
import EditStartUpChallenge from "./startup-challenges/pages/EditStartupChallenge";
import StartupChallengeList from "./startup-challenges/pages/StartupChallengeList";
import Auth from "./shared/components/authentication/pages/Auth";
import MainNavigation from "./shared/components/navigation/pages/MainNavigation";
import Guide from "./shared/components/guide/Guide";

import { AuthContext } from "./shared/context/auth-context";

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userType, setUserType] = useState();

    const loginAsStudent = useCallback(() => {
      setIsLoggedIn(true);
      setUserType("student");
    }, []);

    const loginAsStartup = useCallback(() => {
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
                    <ChallengeList />
                </Route>

                <Route path="/challenges/:challengeId">
                    <Challenge />
                </Route>

                <Route path="/startup-challenge" exact={true}>
                    <StartupChallengeList />
                </Route>

                <Route path="/startup-challenge/:challengeId">
                    <StartupChallenge />
                </Route>
                <Route path="/how-to">
                    <Guide />
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

                <Route path="/startup/:startupId">
                    <StartupProfile />
                </Route>

                <Route path="/challenges" exact={true}>
                    <ChallengeList />
                </Route>

                <Route path="/challenges/:challengeId">
                    <Challenge />
                </Route>

                <Route path="/startup-challenge" exact={true}>
                    <StartupChallengeList />
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
                  <ChallengeList />
              </Route>

              <Route path="/challenges/:challengeId">
                  <Challenge />
              </Route>

              <Route path="/startup-challenge" exact={true}>
                  <StartupChallengeList />
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
                loginAsStartUp: loginAsStartup,
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
