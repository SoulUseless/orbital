import React, { useState, useContext } from "react";

import ChallengeList from "../components/ChallengeList";
import { AuthContext } from "../../shared/context/auth-context";

import "./Challenges.css";

const DUMMY_CHALLENGES = [
    {
        id: "c1",
        name: "test1",
        description: "my first challenge",
        language: "javascript",
        requirements: [],
        tier: "bronze",
        url: "https://cdn.worldvectorlogo.com/logos/javascript.svg"
    },
    {
        id: "c2",
        name: "test2",
        description: "my first challenge",
        language: "python",
        requirements: ["c1"],
        tier: "bronze",
        url: "https://logodownload.org/wp-content/uploads/2019/10/python-logo-4.png"
    },
    {
        id: "c3",
        name: "test3",
        description: "my first challenge",
        language: "javascript",
        requirements: [],
        tier: "silver",
        url: "https://cdn.worldvectorlogo.com/logos/javascript.svg"
    },
    {
        id: "c4",
        name: "test4",
        description: "my first challenge",
        language: "javascript",
        requirements: [],
        tier: "silver",
        url: "https://cdn.worldvectorlogo.com/logos/javascript.svg"
    },
    {
        id: "c5",
        name: "test5",
        description: "my first challenge",
        language: "python",
        requirements: [],
        tier: "gold",
        url: "https://logodownload.org/wp-content/uploads/2019/10/python-logo-4.png"
    },
];

const Challenges = (props) => {    
    const [filteredLanguage, setFilteredLanguage] = useState(["python", "javascript"]);
    const [filteredTier, setFilteredTier] = useState(["bronze", "silver", "gold"]);
    const [filteredRequirements, setFilteredRequirements] = useState(["yes", "no"]); //TO DO after profile is implemented
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

    const requirementsFilterHandler = (event) => {
        const targetRequirements = event.target.value;
        console.log(targetRequirements);
        let newFilteredRequirements;
        if (event.target.checked) { //something checked
            newFilteredRequirements = [...filteredRequirements];
            newFilteredRequirements.push(targetRequirements);
        } else { //something unchecked
            newFilteredRequirements = [...filteredRequirements].filter((requirement => requirement !== targetRequirements));
        }
        setFilteredRequirements(newFilteredRequirements);
        console.log(filteredRequirements);
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
                {/* radio buttons go here */}
                <h3> Filters </h3>
                <div onChange={languageFilterHandler}>
                    <h4> Language</h4>
                    <input type="checkbox" value="python" defaultChecked /> Python <br />
                    <input type="checkbox" value="javascript" defaultChecked/> Javascript
                </div>

                <div onChange={tierFilterHandler}>
                    <h4> Tier</h4>
                    <input type="checkbox" value="bronze" defaultChecked /> Bronze <br />
                    <input type="checkbox" value="silver" defaultChecked/> Silver <br />
                    <input type="checkbox" value="gold" defaultChecked/> Gold
                </div>

                {auth.isLoggedIn && (
                    <div onChange={requirementsFilterHandler}>
                        <h4> Requirements </h4>
                        <input type="checkbox" value="yes" defaultChecked /> Yes <br />
                        <input type="checkbox" value="no" defaultChecked/> No
                    </div>
                )}
            </div>
            <div>
                <ChallengeList
                    items={DUMMY_CHALLENGES}
                    hasFilters={hasFilters}
                    filters={{
                        filteredLanguage, filteredTier, filteredRequirements
                    }}
                />
            </div>
        </div>
    );
}

export default Challenges;