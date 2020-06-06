import React from "react";
import { NavLink } from 'react-router-dom';

import Card from "../../shared/components/UIElements/Card";
import ChallengeListItem from "./ChallengeListItem";
import "./ChallengeList.css";

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

    return (
        <ul className="challenge-list">
            {props.items.map((challenge) => (
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