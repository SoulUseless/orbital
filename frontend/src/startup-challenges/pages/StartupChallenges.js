import React, {useState, useContext} from "react";

import StartupChallengeList from "../components/StartupChallengeList.js";
import Button from "../../shared/components/formElements/Button";
import {AuthContext} from "../../shared/context/auth-context";

import "./StartupChallenge.css";

const DUMMY_CHALLENGES = [
    {
        id: "c1",
        name: "test1",
        owner: "google",
        description: "my first challenge",
        requirements: {},
        tier: "bronze",
        url: "https://cdn.worldvectorlogo.com/logos/google-icon.svg"
    },
    {
        id: "c2",
        name: "test2",
        owner: "google",
        description: "my first challenge",
        requirements: { javascript: "silver", java: "gold" },
        url: "https://cdn.worldvectorlogo.com/logos/google-icon.svg"
    },
    {
        id: "c3",
        name: "test3",
        owner: "facebook",
        description: "my first challenge",
        requirements: {},
        url: "https://cdn0.iconfinder.com/data/icons/social-messaging-ui-color-shapes-2-free/128/social-facebook-2019-square1-512.png"
    },
    {
        id: "c4",
        name: "test4",
        owner: "tencent",
        description: "my first challenge",
        requirements: {},
        url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTv_MNlp6gBL_CAc8mnwUirBnqJIBN7yjtxZZhjxAMwExKm0beX&s"
    },
    {
        id: "c5",
        name: "test5",
        owner: "facebook",
        description: "my first challenge",
        requirements: {},
        url: "https://cdn0.iconfinder.com/data/icons/social-messaging-ui-color-shapes-2-free/128/social-facebook-2019-square1-512.png"
    },
];

const StartupChallenges = (props) => {
    const [filteredLanguage, setFilteredLanguage] = useState(["python", "javascript"]);
    const [filteredTier, setFilteredTier] = useState(["silver", "gold"]);
    const [filteredOwnership, setFilteredOwnership] = useState(["yes", "no"]); //TO DO after profile is implemented
    const [filteredStartup, setFilteredStartup] = useState(["google", "facebook", "tencent"]);
    //can consider retrieving this from a database?
    const [hasFilters, setHasFilters] = useState(false);

    const auth = useContext(AuthContext);

    const languageFilterHandler = (event) => {
        const targetLanguage = event.target.value;
        let newFilteredLanguages;
        if (event.target.checked) { //something checked
            newFilteredLanguages = [...filteredLanguage];
            newFilteredLanguages.push(targetLanguage);
        } else { //something unchecked
            newFilteredLanguages = [...filteredLanguage].filter((language => language !== targetLanguage));
        }
        setFilteredLanguage(newFilteredLanguages);
        setHasFilters(true);
    };

    const tierFilterHandler = (event) => {
        const targetTier = event.target.value;
        let newFilteredTier;
        if (event.target.checked) { //something checked
            newFilteredTier = [...filteredTier];
            newFilteredTier.push(targetTier);
        } else { //something unchecked
            newFilteredTier = [...filteredTier].filter((tier => tier !== targetTier));
        }
        setFilteredTier(newFilteredTier);
        setHasFilters(true);
        //console.log(filteredTier);
    };

    const ownershipFilterHandler = (event) => {
        const targetOwnership = event.target.value;
        console.log(targetOwnership);
        let newFilteredOwnership;
        if (event.target.checked) { //something checked
            newFilteredOwnership = [...filteredOwnership];
            newFilteredOwnership.push(targetOwnership);
        } else { //something unchecked
            newFilteredOwnership = [...filteredOwnership].filter((ownership => ownership !== targetOwnership));
        }
        setFilteredOwnership(newFilteredOwnership);
        console.log(filteredOwnership);
        setHasFilters(true);
    };

    const startupFilterHandler = (event) => {
        const targetStartup = event.target.value;
        console.log(targetStartup);
        let newFilteredStartup;
        if (event.target.checked) { //something checked
            newFilteredStartup = [...filteredStartup];
            newFilteredStartup.push(targetStartup);
        } else { //something unchecked
            newFilteredStartup = [...filteredStartup].filter((startup => startup !== targetStartup));
        }
        setFilteredStartup(newFilteredStartup);
        console.log(filteredStartup);
        setHasFilters(true);
    };

    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "1fr 5fr",
                gridGap: 20,
            }}
        >
            <div className="sidebar">
                {/*TO DO: SCALABLE, hide the sidebar when with is too small */}
                {/* radio buttons go here */}
                <h3> Filters </h3>
                <div onChange={languageFilterHandler}>
                    <h4> Language</h4>
                    <input type="checkbox" value="python" defaultChecked />
                    Python <br />
                    <input type="checkbox" value="java" defaultChecked />
                    Java <br />
                    <input
                        type="checkbox"
                        value="javascript"
                        defaultChecked
                    />
                    Javascript
                </div>

                <div onChange={tierFilterHandler}>
                    <h4> Tier</h4>
                    <input type="checkbox" value="silver" defaultChecked />{" "}
                    Silver <br />
                    <input type="checkbox" value="gold" defaultChecked /> Gold
                </div>

                <div onChange={startupFilterHandler}>
                    <h4> Startup</h4>
                    <input type="checkbox" value="google" defaultChecked />{" "}
                    Google <br />
                    <input
                        type="checkbox"
                        value="facebook"
                        defaultChecked
                    />
                    Facebook <br />
                    <input
                        type="checkbox"
                        value="tencent"
                        defaultChecked
                    />
                    Tencent
                </div>

                {/*verify token going forward */}
                {auth.isLoggedIn && auth.userType === "startup" && (
                    <div onChange={ownershipFilterHandler}>
                        <h4> Ownership </h4>
                        <input
                            type="checkbox"
                            value="yes"
                            defaultChecked
                        />{" "}
                        View Mine <br />
                        <input type="checkbox" value="no" defaultChecked /> View
                        Others
                    </div>
                )}
            </div>
            <div>
                {auth.isLoggedIn && auth.userType === "startup" && (
                    <div className="new-challenge-container">
                        <Button to="/startup-challenge/new">
                            <h2> Create New Challenge</h2>
                        </Button>
                    </div>
                )}
                <StartupChallengeList
                    items={DUMMY_CHALLENGES}
                    hasFilters={hasFilters}
                    filters={{
                        filteredLanguage,
                        filteredTier,
                        filteredOwnership,
                        filteredStartup,
                    }}
                />
            </div>
        </div>
    );
}

export default StartupChallenges;