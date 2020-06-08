import React, {useContext} from "react";
import { Link } from 'react-router-dom';

import Button from "../../shared/components/formElements/Button";
import Card from "../../shared/components/UIElements/Card";
import {AuthContext} from "../../shared/context/auth-context";

const DUMMY_CHALLENGE = {
    id: "c1",
    name: "Factorial",
    owner: "google",
    description: "my first challenge",
    language: "javascript",
    requirements: ["c3", "c5"], //to be populated to show more information
    requiredFor: ["c2", "c4"],
    taskDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    tier: "bronze",
    url: "https://cdn.worldvectorlogo.com/logos/javascript.svg",
    testCases: [
        { input: "factorial(3)", output: "6" },
        { input: "factorial(5)", output: "120" },
    ],
};

const StartupChallenge = (props) => {
    const auth = useContext(AuthContext);

    const footer = auth.isLoggedIn && auth.userType === "student" ? (
        <h1> SUBMITTER PLACEHOLDER </h1>
    ) : (
        <div className="challenge-auth-container">
            <Button to="/auth">
                <h2> Log In/Sign Up as a Student to Submit </h2>
            </Button>
        </div>
    );

    return (
        <div className="challenge-container">
            <Card className="challenge">
                <div className="challenge-header">
                    <img src={DUMMY_CHALLENGE.url} alt={"javascript"} />
                    <h1> {DUMMY_CHALLENGE.name} </h1>
                    {auth.isLoggedIn && auth.userType === "startup" && (
                        <Link to={`/startup-challenge/edit/${DUMMY_CHALLENGE.id}`}>
                            <img
                                src="https://toppng.com/uploads/preview/free-download-pencil-chalk-png-clipart-clip-art-pencil-ico-11562901060ymmwp55mwl.png"
                                alt="Edit"
                                height="100%"
                                width="auto"
                                padding-left="20px"
                            />
                        </Link>
                    )}
                    <Button to="/startup-challenge" inverse>
                        <h2> Back</h2>
                    </Button>
                </div>
                <hr />

                <table>
                    <tr>
                        <th className="left-col">
                            <h4>Description</h4>
                        </th>
                        <th>{DUMMY_CHALLENGE.description}</th>
                    </tr>

                    <tr>
                        <th className="left-col">
                            <h4>Startup</h4>
                        </th>
                        <th>
                            {DUMMY_CHALLENGE.owner.charAt(0).toUpperCase() +
                                DUMMY_CHALLENGE.owner.slice(1)}
                        </th>
                    </tr>

                    <tr>
                        <th className="left-col">
                            <h4>Pre-requisites</h4>
                        </th>
                        <td>
                            <ul>
                                {DUMMY_CHALLENGE.requirements.map((req) => {
                                    return <li> {req} </li>;
                                })}
                            </ul>
                        </td>
                    </tr>

                    <tr>
                        <th className="left-col">
                            <h4>Required For</h4>
                        </th>
                        <td>
                            <ul>
                                {DUMMY_CHALLENGE.requiredFor.map((req) => {
                                    return <li> {req} </li>;
                                })}
                            </ul>
                        </td>
                    </tr>
                </table>

                <hr />

                <h2> Task Requirements </h2>
                <p>{DUMMY_CHALLENGE.taskDescription}</p>

                <h2> Public Test Cases </h2>
                <div className="test-case-table-container">
                    <table className="test-case-table">
                        <tr>
                            <th className="test-case-col">Input</th>
                            <th className="test-case-col">Expected Output</th>
                        </tr>
                        {DUMMY_CHALLENGE.testCases.map((ts) => {
                            return (
                                <tr>
                                    <td className="test-case-col">
                                        {ts.input}
                                    </td>
                                    <td className="test-case-col">
                                        {ts.output}
                                    </td>
                                </tr>
                            );
                        })}
                    </table>
                </div>

                {footer}
            </Card>
        </div>
    );
}

export default StartupChallenge;