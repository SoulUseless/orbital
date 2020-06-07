import React from "react";
import { NavLink } from 'react-router-dom';

import Card from "../../shared/components/UIElements/Card";
import ChallengeListItem from "./ChallengeListItem";
import "./ChallengeList.css";

const DUMMY_CLEARED_MODULES = [];

const ChallengeList = (props) => {
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
        //console.log(props.filters.filteredRequirements);
        if (props.filters.filteredRequirements.length === 1) {
            if (props.filters.filteredRequirements[0] === "yes") {
                challenges = challenges.filter(
                    (challenge) => {
                        let result = true;
                        for (let i = 0; i < challenge.requirements.length; i++) {
                            if (! DUMMY_CLEARED_MODULES.includes(challenge.requirements.length[i])) {
                                result = false;
                            }
                        }
                        return result;
                    }
                );
                console.log(challenges);
            } else {
                challenges = challenges.filter(
                    (challenge) =>
                        challenge.requirements.length === 0
                            ? false
                            : challenge.requirements.reduce(
                                  (x, y) =>
                                      x || DUMMY_CLEARED_MODULES.includes(y)
                              )
                );
            }
        }
        //TODO: requirements check need user info to be set up
    }

    console.log(challenges);
    return ( 
        <ul className="challenge-list">
            {challenges.map((challenge) => (
                <NavLink to={"/challenges/" + challenge.id}>
                    <ChallengeListItem
                        id={challenge.id}
                        name={challenge.name}
                        url={challenge.url}
                    />
                </NavLink>
            ))}
        </ul>
    );
}

export default ChallengeList;