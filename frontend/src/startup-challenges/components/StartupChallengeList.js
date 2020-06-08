import React from "react";
import { NavLink } from 'react-router-dom';

import Card from "../../shared/components/UIElements/Card";
import StartupChallengeListItem from "./StartupChallengeListItem";
import "./StartupChallengeList.css";

const DUMMY_STARTUP = "tencent";

const StartupChallengeList = (props) => {
    if (props.items.length === 0) {
        return (
            <div className="challenge-list-center">
                <Card>
                    <h2>
                        No Challenge here yet.
                    </h2>
                </Card>
            </div>
        )
    } 

    let challenges = props.items;
    if (props.hasFilters) {
        if (!! props.filters.filteredLanguage) {
            challenges = challenges.filter(challenge => props.filters.filteredLanguage.includes(challenge.language));
        }
        if (!! props.filters.filteredTier) {
            challenges = challenges.filter(challenge => props.filters.filteredTier.includes(challenge.tier));
        }
        if (!! props.filters.filteredStartup){
            challenges = challenges.filter(challenge => props.filters.filteredStartup.includes(challenge.owner));
        }
        //console.log(props.filters.filteredRequirements);
        if (props.filters.filteredOwnership.length === 1) {
            if (props.filters.filteredOwnership[0] === "yes") { //view own challenges
                challenges = challenges.filter(challenge => challenge.owner === DUMMY_STARTUP);
            } else {
                challenges = challenges.filter(challenge => challenge.owner !== DUMMY_STARTUP);
            }
        }
        //TODO: requirements check need user info to be set up
        if (props.filters.filteredOwnership.length === 0) {
            challenges = [];
        }
    }

    console.log(challenges);
    return ( 
        <ul className="challenge-list">
            {challenges.map((challenge) => (
                <NavLink to={"/startup-challenge/" + challenge.id}>
                    <StartupChallengeListItem
                        id={challenge.id}
                        name={challenge.name}
                        url={challenge.url}
                        owner={challenge.owner}
                    />
                </NavLink>
            ))}
        </ul>
    );
}

export default StartupChallengeList;