import React from 'react';
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

const App = () => {
    return (
        <Router>
            <MainNavigation />
            <main>
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

                    <Route path="/challenge/edit/:challengeId">
                      <EditChallenge />
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

                </Switch>
            </main>
        </Router>
    );
}

export default App;
