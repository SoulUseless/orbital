import React from "react";

import ChallengeList from "../components/ChallengeList";

const DUMMY_CHALLENGES = [
    {
        id: "c1",
        name: "test1",
        description: "my first challenge",
        language: "javascript",
        url: "https://cdn.worldvectorlogo.com/logos/javascript.svg"
    },
    {
        id: "c2",
        name: "test2",
        description: "my first challenge",
        language: "python",
        url: "https://logodownload.org/wp-content/uploads/2019/10/python-logo-4.png"
    },
    {
        id: "c3",
        name: "test3",
        description: "my first challenge",
        language: "javascript",
        url: "https://cdn.worldvectorlogo.com/logos/javascript.svg"
    },
    {
        id: "c1",
        name: "test4",
        description: "my first challenge",
        language: "javascript",
        url: "https://cdn.worldvectorlogo.com/logos/javascript.svg"
    },
    {
        id: "c4",
        name: "test5",
        description: "my first challenge",
        language: "python",
        url: "https://logodownload.org/wp-content/uploads/2019/10/python-logo-4.png"
    },
];

const Challenges = (props) => {
    console.log("trig");
    return <ChallengeList items={DUMMY_CHALLENGES} />
}

export default Challenges;